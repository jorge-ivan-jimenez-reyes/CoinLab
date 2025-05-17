declare module 'react-native-vector-icons/Ionicons' {
  import { Component } from 'react';
  import { TextStyle, ViewStyle } from 'react-native';

  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle | ViewStyle;
  }

  export default class Icon extends Component<IconProps, any> {
    static getImageSource(
      name: string,
      size?: number,
      color?: string,
    ): Promise<any>;
    static getRawGlyphMap(): { [name: string]: number };
    static loadFont(
      file?: string,
    ): Promise<void>;
    static hasIcon(name: string): boolean;
  }
}

declare module 'react-native-vector-icons' {
  export { default as Ionicons } from 'react-native-vector-icons/Ionicons';
} 