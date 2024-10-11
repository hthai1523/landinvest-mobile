import React, { useState } from 'react';
import { Image as RNImage, ImageProps as RNImageProps, ImageStyle, StyleProp } from 'react-native';
import images from '@/assets/images/noImage.png';
import Animated from 'react-native-reanimated';

// Định nghĩa kiểu dữ liệu cho props
interface CustomImageProps extends Omit<RNImageProps, 'source'> {
  source: string | { uri: string } | number;
  className?: string;
  style?: StyleProp<ImageStyle>;
  fallback?: { uri: string } | number;
  sharedTransitionTag?: string
}

const CustomImage: React.FC<CustomImageProps> = ({ source, className = '', style = {}, sharedTransitionTag = '' ,fallback = images, ...props }) => {
  const [imageSource, setImageSource] = useState(source);

  const handleError = () => {
    setImageSource(fallback);
  };

  const imageProps = {
    source: typeof imageSource === 'string' ? { uri: imageSource } : imageSource,
    className: className,
    style: style,
    onError: handleError,
    ...props,
  };

  return <Animated.Image sharedTransitionTag={sharedTransitionTag} {...imageProps} />;
};

export default CustomImage;