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
            '@contexts': './src/contexts',
            '@screens': './src/screens',
            '@routes': './src/routes',
            '@utils': './src/utils',
            '@hooks': './src/hooks',
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
