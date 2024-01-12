module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {
        plugins: ['@babel/plugin-proposal-export-namespace-from', 'react-native-paper/babel', 'react-native-reanimated/plugin'],
      },
    },
    plugins: ['react-native-reanimated/plugin'],
  };
};