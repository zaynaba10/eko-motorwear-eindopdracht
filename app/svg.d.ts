// Maakt `import Icon from './icoon.svg'` type-veilig: elk .svg-bestand wordt
// gezien als een React-component dat de props van react-native-svg accepteert
// (width, height, fill, stroke, ...). Nodig omdat react-native-svg-transformer
// svg's op die manier omzet — zonder dit bestand geeft TypeScript een importfout.
declare module '*.svg' {
  import * as React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
