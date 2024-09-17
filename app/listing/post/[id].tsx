  import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
  import React, { useEffect, useCallback, useState } from 'react';
  import { router, Stack, useLocalSearchParams } from 'expo-router';
  import { Alert } from 'react-native';
  import { FetchPostById } from '@/service';
  import { Post } from '@/constants/interface';
  import { calcDate } from '@/functions/calcDate';
  import CustomImage from '@/components/ui/Image';
  import { Ionicons } from '@expo/vector-icons';
  import Colors from '@/constants/Colors';
  import Animated, {
      useAnimatedRef,
      useAnimatedStyle,
      useScrollViewOffset,
      withTiming,
      interpolate,
      Extrapolate,
      useSharedValue,
      runOnJS,
      Extrapolation,
  } from 'react-native-reanimated';
  import { useHeaderHeight } from '@react-navigation/elements';
  import PostDetailContent from '@/components/PostDetail/PostDetailContent';
  import { StatusBar } from 'expo-status-bar';

  const Page = () => {
      const { id } = useLocalSearchParams<{ id: string }>();
      const [postDetail, setPostDetail] = useState<Post>();
      const [isLoading, setIsLoading] = useState<boolean>(false);
      const [statusBarHidden, setStatusBarHidden] = useState(false);


      const scrollRef = useAnimatedRef<Animated.ScrollView>();
      const scrollHandler = useScrollViewOffset(scrollRef);
      // const headerBorderOpacity = useSharedValue(0);

      const headerLeftStyle = useAnimatedStyle(() => {
          return {
              opacity: withTiming(interpolate(scrollHandler.value, [0, 10], [1, 0], Extrapolation.CLAMP), {
                  duration: 200,
              }),
              display: scrollHandler.value > 10 ? 'none' : 'flex',
          };
      });

      const headerTitleStyle = useAnimatedStyle(() => {
          return {
              opacity:withTiming(
                interpolate(
                    scrollHandler.value,
                    [0, 10],
                    [0, 1],
                    Extrapolation.CLAMP
                ),
                { duration: 200 }
            ),
              display: scrollHandler.value <= 10 ? 'none' : 'flex',
          };
      });

      useEffect(() => {

      }, [scrollHandler.value])


      const fetchPost = useCallback(async (id: string) => {
          try {
              setIsLoading(true);
              const data = await FetchPostById(id);
              if (data && data.length > 0) {
                  setPostDetail(data[0]);
              }
          } catch (error) {
              Alert.alert('Lỗi khi tải bài viết');
              console.error(error);
          } finally {
              setIsLoading(false);
          }
      }, []);

      useEffect(() => {
          fetchPost(id);
      }, [id, fetchPost]);

      return (
          <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary.background }}>
            <StatusBar hideTransitionAnimation='fade' hidden={statusBarHidden} style='light' />
            
              <Stack.Screen
                  options={{
                      headerStyle: { backgroundColor: Colors.primary.header },
                      
                      headerLeft: () => (
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <TouchableOpacity onPress={() => router.back()}>
                                  <Ionicons name="chevron-back" size={20} color={'#fff'} />
                              </TouchableOpacity>
                              <Animated.View
                                  style={[headerLeftStyle, { flexDirection: 'row', alignItems: 'center', marginLeft: 8 }]}
                              >
                                  <CustomImage
                                      source={require('@/assets/images/avatar.png')}
                                      style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#F9DFC0' }}
                                  />
                                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, marginLeft: 8 }}>
                                      Hoàng Thái
                                  </Text>
                              </Animated.View>
                          </View>
                      ),
                      headerTitle: () => (
                          <Animated.Text style={[headerTitleStyle, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>
                              Hoàng Thái'post
                          </Animated.Text>
                      ),
                  }}
              />
              <ScrollView
                  ref={scrollRef}
                
              >
                <PostDetailContent postDetail={postDetail} />
              </ScrollView>
          </SafeAreaView>
      );
  };

  export default Page;
