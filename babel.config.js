module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@assets': './src/assets',
            '@components': './src/components',
            '@app': './app',
            '@routes': './src/routes',
            '@utils': './src/utils',
            '@libs': './src/libs',
          },
        },
      ],
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          allowUndefined: false,
        },
      ],
      require.resolve('expo-router/babel'),
    ],
  }
}
