import React from 'react';
import { Image, StyleProp, View, ViewStyle } from 'react-native';
import { Avatar } from '@rneui/themed';
import CustomImage from './Image';

interface AvatarUser {
    avatarLink: string | null | undefined;
    fullName?: string;
    className?: string;
    style?: StyleProp<ViewStyle>;
    size?: number;
    sharedTransitionTag?: string;
}

const AvatarUser = ({ avatarLink, fullName, className = '', style, size, sharedTransitionTag }: AvatarUser) => {
    return avatarLink ? (
        <CustomImage
            sharedTransitionTag={sharedTransitionTag}
            source={avatarLink}
            className={`w-10 h-10 rounded-full bg-[#F9DFC0] ${className}`}
        />
    ) : (
        <Avatar
            title={fullName ? fullName.slice(0, 1) : 'T'}
            size={size || 40}
            containerStyle={{ borderRadius: 9999, backgroundColor: '#4CAF50' }}
        />
    );
};

export default AvatarUser;
