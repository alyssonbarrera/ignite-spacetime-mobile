/* eslint-disable no-async-promise-executor */
import * as SecureStore from 'expo-secure-store'
import axios, { AxiosInstance, AxiosError } from 'axios'

import { API_URL } from '@env'
import { AppError } from '@utils/errors/AppError'

type SignOut = () => void

type PromiseType = {
  onSuccess: (token: string) => void
  onFailure: (error: AxiosError) => void
}

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'X-Request-Origin': 'mobile',
  },
}) as APIInstanceProps

let failedQueue: Array<PromiseType> = []
let isRefreshing = false

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError?.response?.status === 401) {
        if (requestError.response.data?.message.includes('token expired')) {
          const refreshToken = await SecureStore.getItemAsync('refreshToken')

          if (!refreshToken) {
            signOut()
            return Promise.reject(requestError)
          }

          const originalRequestConfig = requestError.config

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                onSuccess: (token: string) => {
                  originalRequestConfig.headers = {
                    Authorization: `Bearer ${token}`,
                  }
                  resolve(api(originalRequestConfig))
                },
                onFailure: (error: AxiosError) => {
                  reject(error)
                },
              })
            })
          }

          isRefreshing = true

          return new Promise(async (resolve, reject) => {
            try {
              const { data } = await api.patch('/token/refresh', {
                refreshToken,
              })
              await SecureStore.setItemAsync('token', data.token)
              await SecureStore.setItemAsync('refreshToken', data.refreshToken)

              if (originalRequestConfig.data) {
                originalRequestConfig.data = JSON.parse(
                  originalRequestConfig.data,
                )
              }

              originalRequestConfig.headers = {
                Authorization: `Bearer ${data.token}`,
              }

              api.defaults.headers.common.Authorization = `Bearer ${data.token}`

              failedQueue.forEach((request) => request.onSuccess(data.token))

              resolve(api(originalRequestConfig))
            } catch (error: any) {
              failedQueue.forEach((request) => request.onFailure(error))

              signOut()
              reject(error)
            } finally {
              isRefreshing = false
              failedQueue = []
            }
          })
        } else {
          signOut()
        }
      }

      if (requestError.response && requestError.response.data) {
        return Promise.reject(
          new AppError(
            requestError.response.data.message.includes('Expired')
              ? 'Sessão expirada, faça login novamente'
              : requestError.response.data.message,
          ),
        )
      } else {
        return Promise.reject(requestError)
      }
    },
  )

  return () => {
    api.interceptors.response.eject(interceptTokenManager)
  }
}

export { api }
