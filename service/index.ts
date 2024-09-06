import instance from '@/utils/axiosCustomize';
import removeAccents from 'remove-accents';

// API login, logout
export const callLogin = (Username: string, Password: string, LastLoginIP: string) => {
    const params = {
        Username,
        Password,
        LastLoginIP
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

// API search quy hoạch
export const searchQueryAPI = (query: string) => {
    return instance.get(`/api/zonings/view?name=${encodeURIComponent(query)}`);
};

// API box
export const ViewlistBox = () => {
    return instance.get('/api/box/viewlist_box');
};

export const CreateBox = (BoxName: string, Description: string, avatarLink: string) => {
    return instance.post('/api/box/add_box', { BoxName, Description, avatarLink });
};

export const UpdateBox = (BoxID: string, BoxName: string, Description: string, avatarLink: string) => {
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

export const fetchAllProvince = async () => {
    try {
        const { data } = await instance.get('/api/provinces/view/');
        return data;
    } catch (error) {
        console.error('Error fetching provinces: ', error);
        return [];
    }
};

export const fetchDistrictsByProvinces = async (ProvinceID: string) => {
    try {
        const { data } = await instance.get(`/api/districts/Byprovince/${ProvinceID}`);
        return data;
    } catch (error) {
        console.error('Error fetching districts', error);
    }
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

export const fetchOrganization = async () => {
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
export const ViewlistPost = () => {
    return instance.get('/api/forum/view_allpost');
};

export const CreatePost = (
    GroupID: string,
    Title: string,
    Content: string,
    PostLatitude: number,
    PostLongitude: number,
    base64Images: string[],
    isHastags: string[],
) => {
    const params = {
        GroupID,
        Title,
        Content,
        PostLatitude,
        PostLongitude,
        Images: base64Images,
        Hastags: isHastags,
    };
    console.log('params', params);
    return instance.post('/api/forum/add_post', params);
};

export const UpdatePost = (PostID: string, Title: string, Content: string) => {
    return instance.patch(`/api/forum/update_post/${PostID}`, { Title, Content });
};

export const callFetchPostById = (PostID: string) => {
    return instance.get(`/api/forum/view_post/${PostID}`);
};

export const DeletePost = (PostID: string) => {
    return instance.delete(`/api/forum/delete_post/${PostID}`);
};

// API like, comment, share
export const LikePost = (idUser: string, idPost: string) => {
    return instance.post(`/api/forum/like_post/${idUser}/${idPost}`);
};

export const ListUserLike = (idPost: string) => {
    return instance.get(`/api/forum/list_user_like_post/${idPost}`);
};

export const numberInteractions = (idPost: string) => {
    return instance.get(`/api/forum/number_info_post/${idPost}`);
};

export const AllPostInfor = () => {
    return instance.get('/api/forum/all_post_info');
};

// API comment post
export const ViewlistComment = (PostID: string) => {
    return instance.get(`/api/post/comments/${PostID}`);
};

export const CreateComment = (PostID: string, Content: string, Images: string[]) => {
    return instance.post(`/api/post/add_comment/${PostID}`, { Content, Images });
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

export const ViewlistGroup = (BoxID: string) => {
    return instance.get(`/api/group/all_group/${BoxID}`);
};

// API user, check online
export const callGetAllUsers = () => {
    return instance.get('/api/listalluser');
};

export const ViewProfileUser = (USERID: string) => {
    return instance.get(`/api/private/profile/${USERID}`);
};

export const CheckUserOnline = (USERID: string) => {
    return instance.get(`/api/checkOnline/${USERID}`);
};

export const BlockUserPost = (USERID: string) => {
    return instance.patch(`/api/forum/block_user/${USERID}`);
};

export const UpdateProfileUser = (
    USERID: string,
    fullname: string,
    gender: string,
    email: string,
    ipAddress: string,
) => {
    const payload = {
        FullName: fullname,
        Gender: gender,
        Email: email,
        LastLoginIP: ipAddress,
    };
    return instance.patch(`/api/private/profile/update/${USERID}`, payload);
};