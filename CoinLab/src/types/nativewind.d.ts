/// <reference types="nativewind/types" />

declare module 'nativewind' {
  import type { ViewStyle, TextStyle, ImageStyle } from "react-native";

  type ExtendedStyle = ViewStyle & TextStyle & ImageStyle;

  export function styled<T>(Component: T, styles?: ExtendedStyle): T;
} 