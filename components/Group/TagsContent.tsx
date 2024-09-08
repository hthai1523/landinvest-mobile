import { View, Text } from 'react-native';
import React, { ReactElement } from 'react';
import { ListTagItem } from '@/constants/interface';
import CustomImage from '../ui/Image';

const TagsContent = ({ listItem, title }: { listItem: ListTagItem[]; title: string }) => {
    return (
        <View>
            <Text className="font-semibold text-lg">{title}</Text>
            <View
                className={`${
                    listItem.length === 4
                        ? 'flex flex-col space-y-4 items-start'
                        : 'flex flex-row flex-wrap gap-2 items-start'
                }`}
            >
                {listItem.map((item) => (
                    <View className="flex flex-row space-x-3">
                        {item.type === 'tag' || (
                            <CustomImage
                                className={`${listItem.length === 4 ? 'w-16 h-16' : 'w-8 h-8'} rounded object-contain`}
                                source={item.imageUrl}
                            />
                        )}
                        <CustomImage source={require('@/assets/images/avatar.png')} className="w-8 h-8 rounded" />
                        <View>
                            {/* Xử lý hiển thị chi tiết dựa trên type */}
                            {item.type === 'tag' && <Text>Posts count: {(item.details as TagDetails).tagPostCount}</Text>}
                            {item.type === 'admin' && (
                                <Text>Status: {(item.details as AdminDetails).adminIsOnline ? 'Online' : 'Offline'}</Text>
                            )}
                            {item.type === 'post' && <Text>Posted by: {(item.details as PostDetails).postedBy}</Text>}
                            {item.type === 'user' && <Text>Joined: {(item.details as UserDetails).userJoinedTime}</Text>}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default TagsContent;
