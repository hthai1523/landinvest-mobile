import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { styled } from 'nativewind';
import PostProfileSection from './PostProfileSection';

const PostsPersonal = () => {
    return (
        <View className=" px-2">
           <PostProfileSection post={null}  />
           <PostProfileSection post={null} />
           <PostProfileSection post={null} />
           <PostProfileSection post={null} />
        </View>
    );
};



export default PostsPersonal;
