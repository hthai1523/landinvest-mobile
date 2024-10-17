import {
    BoxInterface,
    Comment,
    Group,
    ListTagResponse,
    NumberInteractions,
    Organization,
    PayloadNewLocation,
    Post,
    UserInfor,
    UserLikePost,
    UserPostNew,
    ViewAllGroupResponse,
    ViewAllPostResponse,
} from '@/constants/interface';
import { User } from '@/store/authStore';
import instance from '@/utils/axiosCustomize';
import removeAccents from 'remove-accents';

// API login, logout
export const callLogin = (Username: string, Password: string, LastLoginIP: string) => {
    const params = {
        Username,
        Password,
        LastLoginIP,
    };
    return instance.post('/api/login', params);
};

export const callLogout = () => {
    return instance.post('/api/logout');
};

// API register
export const callRegister = (
    Username: string,
    Fullname: string,
    Password: string,
    Gender: string,
    Latitude: number,
    Longitude: number,
    AvatarLink: string,
    ipAddress: string,
    Email: string,
) => {
    const payload = {
        Username,
        FullName: Fullname,
        Password,
        Gender,
        Latitude,
        Longitude,
        avatarLink: AvatarLink,
        Email,
        LastLoginIP: ipAddress,
    };

    console.log('Payload:', payload);

    return instance
        .post('/api/register', payload)
        .then((response) => response.data)
        .catch((error) => {
            if (error.response) {
                console.error('Error Response Data:', error.response.data);
            }
            throw error;
        });
};

// API token
export const callRefreshToken = () => {
    return instance.post('/refresh_token');
};

export const callForgotPassword = (email: string) => {
    return instance.post('/api/forgotPassword', {
        Email: email,
    });
};

export const ChangePassword = async ({
    password,
    newPassword,
}: {
    password: string;
    newPassword: string;
}) => {
    const payload = {
        Password: password,
        NewPassword: newPassword,
    };
    const { data } = await instance.patch(`/api/profile/change_password`, payload);
    return data;
};

// API User Infor
export const GetUserInfo = async (id: string): Promise<UserInfor> => {
    const { data } = await instance.get(`/api/get_user_by_userid/${id}`);
    return data[0];
};

export const GetUserPosted = async (
    id: string,
    page: number,
): Promise<{ data: Post[]; status: number; numberItem: number; numberPage: number }> => {
    const { data } = await instance.get(`/api/forum/list_all_post_by_user/${id}/${page}`);
    return data;
};

// API search quy hoạch
export const searchQueryAPI = (query: string) => {
    return instance.get(`/api/zonings/view?name=${encodeURIComponent(query)}`);
};

// API box
export const ViewlistBox = async (): Promise<BoxInterface[]> => {
    const { data } = await instance.get('/api/box/viewlist_box');
    return data;
};

export const CreateBox = (BoxName: string, Description: string, avatarLink: string) => {
    return instance.post('/api/box/add_box', { BoxName, Description, avatarLink });
};

export const UpdateBox = (
    BoxID: string,
    BoxName: string,
    Description: string,
    avatarLink: string,
) => {
    return instance.patch(`/api/box/update_box/${BoxID}`, { BoxName, Description, avatarLink });
};

// API Map
export const fetchAllQuyHoach = async () => {
    try {
        const { data } = await instance.get('/all_quyhoach');
        return data;
    } catch (error) {
        console.error('Error fetching all quy hoach: ', error);
        return [];
    }
};

export const fetchProvinces = async () => {
    try {
        const response = await instance.get('/api/provinces/view/');
        return response.data;
    } catch (error) {
        console.error('Error fetching provinces: ', error);
        return [];
    }
};

export const fetchListInfo = async (idProvince: string) => {
    try {
        const { data } = await instance.get(`/api/location/list_info_by_district/${idProvince}`);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const fetchAllProvince = async (): Promise<
    { TenTinhThanhPho: string; TinhThanhPhoID: number }[]
> => {
    const { data } = await instance.get('/api/provinces/view/');
    return data;
};

export const fetchDistrictsByProvinces = async (
    provinceID: number,
): Promise<{ DistrictID: number; DistrictName: string; ProvinceID: number }[]> => {
    const { data } = await instance.get(`/api/districts/Byprovince/${provinceID}`);
    return data;
};

export const fetchDistrictByName = async (name: string) => {
    try {
        let apiName = removeAccents(name.toLowerCase());

        if (apiName === 'south tu liem') {
            apiName = 'nam tu liem';
        } else if (apiName === 'north tu liem') {
            apiName = 'bac tu liem';
        }

        const { data } = await instance.get(`/quyhoach/search/${apiName}`);
        if (data && data.length > 0) {
            return data.Posts[0];
        } else return null;
    } catch (error) {
        console.error('Error fetching location data:', error);
        throw error;
    }
};

export const AddNewLocation = async (payload: PayloadNewLocation) => {
    try {
        const { data } = await instance.post('/api/location/add_info', payload);
        return data;
    } catch (error) {
        throw new Error('Failed to add new location');
    }
};
// API Auction
export const fetchListHighestLocation = async (districtId: string) => {
    try {
        const response = await instance.get(`/api/location/list_info_highest/${districtId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching districts', error);
    }
};

export const fetchFilteredAuctions = async (
    startTime: string,
    endTime: string,
    startPrice: number,
    endPrice: number,
    province: string,
    district: string,
) => {
    const params = {
        StartTime: startTime,
        EndTime: endTime,
        Province: province,
        District: district,
        StartPrice: startPrice,
        EndPrice: endPrice,
    };
    const response = await instance.post('/api/landauctions/filter_auction', params);
    return response.data;
};

export const fetchAuctionInfor = async (LandAuctionID: string) => {
    const response = await instance.get(`/api/landauctions/view/${LandAuctionID}`);
    return response.data;
};

export const fetchOrganization = async (): Promise<{
    message: Organization[];
    status: number;
}> => {
    const response = await instance.get('/api/list_organizers');
    return response.data;
};

export const fetchCreateComment = async (IDAuction: string, comment: string, userId: string) => {
    const params = {
        idUser: userId,
        content: comment,
    };
    const response = await instance.post(`/api/landauctions/create_comment/${IDAuction}`, params);
    console.log('responseData', response);
    return response.data;
};

// API list comment
export const fetchListComment = async (IDAuction: string) => {
    const response = await instance.get(`/api/landauctions/list_comment/${IDAuction}`);
    return response.data;
};

// API edit comment
export const EditCommentAuction = async (IDComment: string, EditComment: string) => {
    const params = {
        content: EditComment,
    };
    const response = await instance.patch(`/api/landauctions/edit_comment/${IDComment}`, params);
    return response.data;
};

// API delete comment
export const DeleteCommentAuction = async (IDComment: string) => {
    const response = await instance.delete(`/api/landauctions/delete_comment/${IDComment}`);
    return response.data;
};

// Forums post
export const ViewlistPost = async (pageNumber: number): Promise<ViewAllPostResponse> => {
    const { data } = await instance.get(`/api/forum/view_allpost/${pageNumber}`);
    return data;
};

export const ViewHotPost = async (pageNumber: number): Promise<ViewAllPostResponse> => {
    const { data } = await instance.get(
        `/api/forum/view_allpost_sort_timeview_count/${pageNumber}`,
    );
    return data;
};

export const CreatePost = async (params: UserPostNew) => {
    const { data } = await instance.post('/api/forum/add_post', params);
    return data;
};

export const UpdatePost = (PostID: string, Title: string, Content: string) => {
    return instance.patch(`/api/forum/update_post/${PostID}`, { Title, Content });
};

export const FetchPostById = async (PostID: string): Promise<Post[]> => {
    const { data } = await instance.get(`/api/forum/view_post/${PostID}`);
    return data;
};

export const DeletePost = (PostID: string) => {
    return instance.delete(`/api/forum/delete_post/${PostID}`);
};

export const GetListTags = async (pageNum: number): Promise<ListTagResponse> => {
    const { data } = await instance.get(`/api/forum/sort_hashtag/${pageNum}`);
    return data;
};

// API like, comment, share
export const LikePost = (idUser: string, idPost: string) => {
    return instance.post(`/api/forum/like_post/${idUser}/${idPost}`);
};

export const ListUserLike = async (idPost: string): Promise<UserLikePost[]> => {
    const { data } = await instance.get(`/api/forum/list_user_like_post/${idPost}`);
    return data;
};

export const numberInteractions = async (idPost: string): Promise<NumberInteractions> => {
    const { data } = await instance.get(`/api/forum/number_info_post/${idPost}`);
    return data;
};

export const AllPostInfor = () => {
    return instance.get('/api/forum/all_post_info');
};

export const IsUserLikePost = async (
    userId: string,
    idPost: string,
): Promise<{ liked: boolean; status: number }> => {
    const { data } = await instance.get(`/api/forum/check_user_like_post/${userId}/${idPost}`);
    return data;
};

// API comment post
export const ViewlistComment = async (
    PostID: string,
    pageNum: number,
): Promise<{ data: Comment[]; status: number; numberPage: number; total_item: number }> => {
    const { data } = await instance.get(`/api/post/comments/${PostID}`, {
        params: {
            page: pageNum,
        },
    });
    return data;
};

export const CreateComment = async (
    PostID: string,
    Content: string,
    Images: string[],
): Promise<{ Status: number; data: Comment; message: string }> => {
    const payload = {
        Content,
        Images,
    };
    const { data } = await instance.post(`/api/post/add_comment/${PostID}`, payload);
    return data;
};

export const UpdateComment = (CommentID: string, Content: string, PhotoURL: string) => {
    return instance.patch(`/api/post/comment/update/${CommentID}`, { Content, PhotoURL });
};

export const DeleteComment = (CommentID: string) => {
    return instance.delete(`/api/post/comment/remove/${CommentID}`);
};

// API group
export const CreateGroup = (BoxID: string, GroupName: string, avatarLink: string) => {
    return instance.post('/api/group/add_group', { BoxID, GroupName, avatarLink });
};

export const UpdateGroup = (GroupID: string, GroupName: string) => {
    return instance.patch(`/api/group/update_group/${GroupID}`, { GroupName });
};

export const DeleteGroup = (GroupID: string) => {
    return instance.delete(`/api/group/remove_group/${GroupID}`);
};

export const ViewlistGroup = async (
    BoxID: number,
): Promise<
    {
        BoxID: number;
        CreateAt: string;
        GroupID: number;
        GroupName: string;
        UserID: number;
        avatarLink: string;
    }[]
> => {
    const { data } = await instance.get(`/api/group/all_group/${BoxID}`);
    return data;
};

export const ViewListAllGroup = async (pageNum: number): Promise<ViewAllGroupResponse> => {
    const { data } = await instance.get(`api/group/list_all_group/${pageNum}`);
    return data;
};

// API user, check online
export const callGetAllUsers = () => {
    return instance.get('/api/listalluser');
};

export const ViewProfileUser = async (USERID: string) => {
    const { data } = await instance.get(`/api/private/profile/${USERID}`);
    return data;
};

export const CheckUserOnline = (USERID: string) => {
    return instance.get(`/api/checkOnline/${USERID}`);
};

export const BlockUserPost = (USERID: string) => {
    return instance.patch(`/api/forum/block_user/${USERID}`);
};

export const UpdateProfileUser = (data: Partial<User>) => {
    return instance.patch(`/api/profile/updateprofile`, data);
};

export const GetUserProfile = async (idUser: string): Promise<User> => {
    const { data } = await instance.get(`/api/profile/other_user/${idUser}`);
    return data.data;
};

export const ChangeAvatarUser = async (idUser: string, formData: any) => {
    const { data } = await instance.post(`/api/profile/update_image/${idUser}`, formData, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

// group
export const GetGroupDetail = async (id: number): Promise<Group> => {
    const { data } = await instance.get(`/api/group/view_group/${id}`);
    return data[0];
};

export const GetPostByGroupId = async (
    id: number,
    page: number,
): Promise<{ data: Post[]; status: number; numberItem: number; numberPage: number }> => {
    const { data } = await instance.get(`/api/forum/group/${id}`, {
        params: {
            page,
        },
    });

    return data;
};

export const CheckUserJoinGroup = async (
    idUser: number,
    idGroup: number,
): Promise<{ message: string; status: number }> => {
    const { data } = await instance.get(`/api/group/check_user_join_group/${idUser}/${idGroup}`);
    return data;
};

export const JoinGroup = async (
    idUser: number,
    idGroup: number,
): Promise<{ message: string; status: number }> => {
    const { data } = await instance.post(`/api/group/join_group/${idUser}/${idGroup}`);
    return data;
};

export const LeaveGroup = async (
    idUser: number,
    idGroup: number,
): Promise<{ message: string; status: number }> => {
    const { data } = await instance.delete(`/api/group/leave_group/${idUser}/${idGroup}`);
    return data;
};

export const SearchUserInvite = async (
    userName: string,
): Promise<{
    data: {
        avatar: string;
        idUser: number;
        username: string;
        fullName: string
    }[];
    status: number;
}> => {
    const { data } = await instance.post('/api/group/search_user', {
        name: userName,
    });

    return data;
};
