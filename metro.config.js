const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};
module.exports = {
  resolver: {
    sourceExts: ['js', 'json', 'ts', 'tsx', 'cjs'],
  },
};
module.exports = mergeConfig(getDefaultConfig(__dirname), config);
