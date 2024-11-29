import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import Colors from '@/constants/Colors';
import { Hammer } from '@/assets/icons';
import AuctionsForm, { AuctionFormSchema } from '@/components/Auction/AuctionsForm';
import { BlurView } from 'expo-blur';
import { fetchFilteredAuctions } from '@/service';
import { AuctionResponse } from '@/constants/interface';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const listAuctionDemo: AuctionResponse[] = [
    {
        AuctionAddress:
            'Văn phòng Công ty Đấu giá hợp danh Dầu Khí Việt Nam, địa chỉ: Tầng 3 – Toà nhà Bình Minh, Số 2 Thi Sách, phường Bến Nghé, Quận 1, Tp.Hồ Chí Minh',
        AuctionUrl:
            'https://dgts.moj.gov.vn/thong-bao-cong-khai-viec-dau-gia/tai-san-1-quyen-su-dung-dat-tai-thua-dat-so-985-to-ban-do-so-19-dia-chi-xa-binh-my-huyen-cu-chi-tphcm-tai-san-2-quyen-su-dung-dat-tai-thua-dat-so-222-to-ban-do-so-8-dia-chi-xa-binh-my-huyen-cu-chi-tphcm--346240.html',
        DepositPaymentEndTime: '2024-07-30T16:00:00',
        DepositPaymentStartTime: '2024-07-04T08:00:00',
        DepositPrice: '2,350,260,000 VNĐ',
        Description:
            'Các cá nhân, tổ chức có nhu cầu, khả năng tài chính được tham gia đăng ký ngoại trừ những trường hợp quy định tại khoản 4 Điều 38 Luật đấu giá tài sản số 01/2016/QH14 ban hành ngày 17/11/2016.\nLiên hệ Văn phòng Công ty đấu giá hợp danh Dầu Khí Việt Nam, địa chỉ: Tầng 3, Toà nhà Bình Minh, số 2 Thi Sách, phường Bến Nghé, Quận 1, Tp.Hồ Chí Minh',
        DistrictID: 1,
        EventSchedule: '2024-08-02T09:30:00',
        Images: [
            { Image: 'https://apilandinvest.gachmen.org/api/group/image/groupimgid.jpeg' },
            { Image: 'https://apilandinvest.gachmen.org/api/group/image/groupimgid.jpeg' },
            { Image: 'https://apilandinvest.gachmen.org/api/group/image/groupimgid.jpeg' },
        ],
        LandAuctionCategoryID: 1,
        LandAuctionID: '461',
        Latitude: null,
        Longitude: null,
        OpenPrice: 23502600000.0,
        RegistrationEndTime: '2024-07-30T16:00:00',
        RegistrationStartTime: '2024-07-04T08:00:00',
        Title: 'Thông báo việc đấu giá đối với danh mục tài sản: Tài sản 1: Quyền sử dụng đất tại thửa đất số 985, tờ bản đồ số 19. Địa chỉ: Xã Bình Mỹ, Huyện Củ Chi, TP.HCM.  Tài sản 2: Quyền sử dụng đất tại thửa đất số 222, tờ bản đồ số 8. Địa chỉ: Xã Bình Mỹ, Huyện Củ Chi, TP.HCM',
    },
    {
        AuctionAddress:
            'Văn phòng Công ty Đấu giá hợp danh Dầu Khí Việt Nam, địa chỉ: Tầng 3 – Toà nhà Bình Minh, Số 2 Thi Sách, phường Bến Nghé, Quận 1, Tp.Hồ Chí Minh',
        AuctionUrl:
            'https://dgts.moj.gov.vn/thong-bao-cong-khai-viec-dau-gia/tai-san-1-quyen-su-dung-dat-tai-thua-dat-so-985-to-ban-do-so-19-dia-chi-xa-binh-my-huyen-cu-chi-tphcm-tai-san-2-quyen-su-dung-dat-tai-thua-dat-so-222-to-ban-do-so-8-dia-chi-xa-binh-my-huyen-cu-chi-tphcm--346240.html',
        DepositPaymentEndTime: '2024-07-30T16:00:00',
        DepositPaymentStartTime: '2024-07-04T08:00:00',
        DepositPrice: '2,350,260,000 VNĐ',
        Description:
            'Các cá nhân, tổ chức có nhu cầu, khả năng tài chính được tham gia đăng ký ngoại trừ những trường hợp quy định tại khoản 4 Điều 38 Luật đấu giá tài sản số 01/2016/QH14 ban hành ngày 17/11/2016.\nLiên hệ Văn phòng Công ty đấu giá hợp danh Dầu Khí Việt Nam, địa chỉ: Tầng 3, Toà nhà Bình Minh, số 2 Thi Sách, phường Bến Nghé, Quận 1, Tp.Hồ Chí Minh',
        DistrictID: 1,
        EventSchedule: '2024-08-02T09:30:00',
        Images: [
            { Image: 'https://apilandinvest.gachmen.org/api/group/image/groupimgid.jpeg' },
            { Image: 'https://apilandinvest.gachmen.org/api/group/image/groupimgid.jpeg' },
            { Image: 'https://apilandinvest.gachmen.org/api/group/image/groupimgid.jpeg' },
        ],
        LandAuctionCategoryID: 1,
        LandAuctionID: '461',
        Latitude: null,
        Longitude: null,
        OpenPrice: 23502600000.0,
        RegistrationEndTime: '2024-07-30T16:00:00',
        RegistrationStartTime: '2024-07-04T08:00:00',
        Title: 'Thông báo việc đấu giá đối với danh mục tài sản: Tài sản 1: Quyền sử dụng đất tại thửa đất số 985, tờ bản đồ số 19. Địa chỉ: Xã Bình Mỹ, Huyện Củ Chi, TP.HCM.  Tài sản 2: Quyền sử dụng đất tại thửa đất số 222, tờ bản đồ số 8. Địa chỉ: Xã Bình Mỹ, Huyện Củ Chi, TP.HCM',
    },
    {
        AuctionAddress:
            'Văn phòng Công ty Đấu giá hợp danh Dầu Khí Việt Nam, địa chỉ: Tầng 3 – Toà nhà Bình Minh, Số 2 Thi Sách, phường Bến Nghé, Quận 1, Tp.Hồ Chí Minh',
        AuctionUrl:
            'https://dgts.moj.gov.vn/thong-bao-cong-khai-viec-dau-gia/tai-san-1-quyen-su-dung-dat-tai-thua-dat-so-985-to-ban-do-so-19-dia-chi-xa-binh-my-huyen-cu-chi-tphcm-tai-san-2-quyen-su-dung-dat-tai-thua-dat-so-222-to-ban-do-so-8-dia-chi-xa-binh-my-huyen-cu-chi-tphcm--346240.html',
        DepositPaymentEndTime: '2024-07-30T16:00:00',
        DepositPaymentStartTime: '2024-07-04T08:00:00',
        DepositPrice: '2,350,260,000 VNĐ',
        Description:
            'Các cá nhân, tổ chức có nhu cầu, khả năng tài chính được tham gia đăng ký ngoại trừ những trường hợp quy định tại khoản 4 Điều 38 Luật đấu giá tài sản số 01/2016/QH14 ban hành ngày 17/11/2016.\nLiên hệ Văn phòng Công ty đấu giá hợp danh Dầu Khí Việt Nam, địa chỉ: Tầng 3, Toà nhà Bình Minh, số 2 Thi Sách, phường Bến Nghé, Quận 1, Tp.Hồ Chí Minh',
        DistrictID: 1,
        EventSchedule: '2024-08-02T09:30:00',
        Images: [
            { Image: 'https://apilandinvest.gachmen.org/api/group/image/groupimgid.jpeg' },
            { Image: 'https://apilandinvest.gachmen.org/api/group/image/groupimgid.jpeg' },
            { Image: 'https://apilandinvest.gachmen.org/api/group/image/groupimgid.jpeg' },
        ],
        LandAuctionCategoryID: 1,
        LandAuctionID: '461',
        Latitude: null,
        Longitude: null,
        OpenPrice: 23502600000.0,
        RegistrationEndTime: '2024-07-30T16:00:00',
        RegistrationStartTime: '2024-07-04T08:00:00',
        Title: 'Thông báo việc đấu giá đối với danh mục tài sản: Tài sản 1: Quyền sử dụng đất tại thửa đất số 985, tờ bản đồ số 19. Địa chỉ: Xã Bình Mỹ, Huyện Củ Chi, TP.HCM.  Tài sản 2: Quyền sử dụng đất tại thửa đất số 222, tờ bản đồ số 8. Địa chỉ: Xã Bình Mỹ, Huyện Củ Chi, TP.HCM',
    },
    {
        AuctionAddress:
            'Văn phòng Công ty Đấu giá hợp danh Dầu Khí Việt Nam, địa chỉ: Tầng 3 – Toà nhà Bình Minh, Số 2 Thi Sách, phường Bến Nghé, Quận 1, Tp.Hồ Chí Minh',
        AuctionUrl:
            'https://dgts.moj.gov.vn/thong-bao-cong-khai-viec-dau-gia/tai-san-1-quyen-su-dung-dat-tai-thua-dat-so-985-to-ban-do-so-19-dia-chi-xa-binh-my-huyen-cu-chi-tphcm-tai-san-2-quyen-su-dung-dat-tai-thua-dat-so-222-to-ban-do-so-8-dia-chi-xa-binh-my-huyen-cu-chi-tphcm--346240.html',
        DepositPaymentEndTime: '2024-07-30T16:00:00',
        DepositPaymentStartTime: '2024-07-04T08:00:00',
        DepositPrice: '2,350,260,000 VNĐ',
        Description:
            'Các cá nhân, tổ chức có nhu cầu, khả năng tài chính được tham gia đăng ký ngoại trừ những trường hợp quy định tại khoản 4 Điều 38 Luật đấu giá tài sản số 01/2016/QH14 ban hành ngày 17/11/2016.\nLiên hệ Văn phòng Công ty đấu giá hợp danh Dầu Khí Việt Nam, địa chỉ: Tầng 3, Toà nhà Bình Minh, số 2 Thi Sách, phường Bến Nghé, Quận 1, Tp.Hồ Chí Minh',
        DistrictID: 1,
        EventSchedule: '2024-08-02T09:30:00',
        Images: [
            { Image: 'https://apilandinvest.gachmen.org/api/group/image/groupimgid.jpeg' },
            { Image: 'https://apilandinvest.gachmen.org/api/group/image/groupimgid.jpeg' },
            { Image: 'https://apilandinvest.gachmen.org/api/group/image/groupimgid.jpeg' },
        ],
        LandAuctionCategoryID: 1,
        LandAuctionID: '461',
        Latitude: null,
        Longitude: null,
        OpenPrice: 23502600000.0,
        RegistrationEndTime: '2024-07-30T16:00:00',
        RegistrationStartTime: '2024-07-04T08:00:00',
        Title: 'Thông báo việc đấu giá đối với danh mục tài sản: Tài sản 1: Quyền sử dụng đất tại thửa đất số 985, tờ bản đồ số 19. Địa chỉ: Xã Bình Mỹ, Huyện Củ Chi, TP.HCM.  Tài sản 2: Quyền sử dụng đất tại thửa đất số 222, tờ bản đồ số 8. Địa chỉ: Xã Bình Mỹ, Huyện Củ Chi, TP.HCM',
    },
    {
        AuctionAddress:
            'Văn phòng Công ty Đấu giá hợp danh Dầu Khí Việt Nam, địa chỉ: Tầng 3 – Toà nhà Bình Minh, Số 2 Thi Sách, phường Bến Nghé, Quận 1, Tp.Hồ Chí Minh',
        AuctionUrl:
            'https://dgts.moj.gov.vn/thong-bao-cong-khai-viec-dau-gia/tai-san-1-quyen-su-dung-dat-tai-thua-dat-so-985-to-ban-do-so-19-dia-chi-xa-binh-my-huyen-cu-chi-tphcm-tai-san-2-quyen-su-dung-dat-tai-thua-dat-so-222-to-ban-do-so-8-dia-chi-xa-binh-my-huyen-cu-chi-tphcm--346240.html',
        DepositPaymentEndTime: '2024-07-30T16:00:00',
        DepositPaymentStartTime: '2024-07-04T08:00:00',
        DepositPrice: '2,350,260,000 VNĐ',
        Description:
            'Các cá nhân, tổ chức có nhu cầu, khả năng tài chính được tham gia đăng ký ngoại trừ những trường hợp quy định tại khoản 4 Điều 38 Luật đấu giá tài sản số 01/2016/QH14 ban hành ngày 17/11/2016.\nLiên hệ Văn phòng Công ty đấu giá hợp danh Dầu Khí Việt Nam, địa chỉ: Tầng 3, Toà nhà Bình Minh, số 2 Thi Sách, phường Bến Nghé, Quận 1, Tp.Hồ Chí Minh',
        DistrictID: 1,
        EventSchedule: '2024-08-02T09:30:00',
        Images: [
            { Image: 'https://apilandinvest.gachmen.org/api/group/image/groupimgid.jpeg' },
            { Image: 'https://apilandinvest.gachmen.org/api/group/image/groupimgid.jpeg' },
            { Image: 'https://apilandinvest.gachmen.org/api/group/image/groupimgid.jpeg' },
        ],
        LandAuctionCategoryID: 1,
        LandAuctionID: '461',
        Latitude: null,
        Longitude: null,
        OpenPrice: 23502600000.0,
        RegistrationEndTime: '2024-07-30T16:00:00',
        RegistrationStartTime: '2024-07-04T08:00:00',
        Title: 'Thông báo việc đấu giá đối với danh mục tài sản: Tài sản 1: Quyền sử dụng đất tại thửa đất số 985, tờ bản đồ số 19. Địa chỉ: Xã Bình Mỹ, Huyện Củ Chi, TP.HCM.  Tài sản 2: Quyền sử dụng đất tại thửa đất số 222, tờ bản đồ số 8. Địa chỉ: Xã Bình Mỹ, Huyện Củ Chi, TP.HCM',
    },
];

const Auction = () => {
    const [isBlur, setIsBlur] = useState<boolean>(false);
    const [listAuction, setListAuction] = useState<AuctionResponse[]>([]);
    const setIsBackDrop = (params: boolean) => {
        setIsBlur(params);
    };

    const onSubmit = async (data: AuctionFormSchema) => {
        console.log('data', data);
        const { tuNgay, denNgay, tuGia, denGia, tinhThanhPho, tenTaiSan, toChucDGTS } = data;
        try {
            const data = await fetchFilteredAuctions(
                tuNgay,
                denNgay,
                tuGia,
                denGia,
                tinhThanhPho,
                null,
            );
            console.log('data fetch', data);
            data && setListAuction(data);
        } catch (error) {
            console.log('error', error);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={{ padding: 12 }}
            style={{ flex: 1, backgroundColor: Colors.primary.background }}
            keyboardShouldPersistTaps="handled"
            className="space-y-3"
        >
            {isBlur && (
                <BlurView
                    intensity={20}
                    tint="regular"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1,
                    }}
                />
            )}
            <View
                className="flex flex-row items-center justify-center p-2 rounded-[20px] "
                style={{ backgroundColor: Colors.primary.header }}
            >
                <Hammer />
                <Text className="font-semibold text-2xl text-[#B7A800] ml-2">
                    THÔNG BÁO ĐẤU GIÁ
                </Text>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}
            >
                <AuctionsForm setIsBackDrop={setIsBackDrop} onSubmitFilter={onSubmit} />
            </KeyboardAvoidingView>
            <FlatList
                scrollEnabled={false}
                data={listAuctionDemo}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => router.navigate(`/listing/auction/${item.LandAuctionID}`)}
                        className="w-full p-2 bg-white rounded-md relative"
                    >
                        <Text numberOfLines={2} className="font-medium text-base">
                            {item.Title}
                        </Text>
                        <Text numberOfLines={2} className="font-normal text-sm">
                            {new Date(item.EventSchedule).toLocaleString()}
                        </Text>
                        <View className="absolute bottom-0 right-0 p-1">
                            <Ionicons name="chevron-down" size={18} />
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => item.LandAuctionID.toString() + index}
                ListEmptyComponent={() => (
                    <Text className="text-white text-center">Danh sách đấu giá trống</Text>
                )}
                ItemSeparatorComponent={() => <View className="w-1 h-3" />}
            />
        </ScrollView>
    );
};

export default Auction;
