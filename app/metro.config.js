// Metro-config met SVG-ondersteuning (react-native-svg-transformer),
// zodat .svg-bestanden rechtstreeks als React-component geïmporteerd kunnen worden:
//   import Telefoon from '@/assets/images/iconen-100/donker/svg/niet-ingevuld/01-telefoon.svg';
//   <Telefoon width={24} height={24} />
// Zie: https://github.com/kristerkari/react-native-svg-transformer
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
};

module.exports = config;
