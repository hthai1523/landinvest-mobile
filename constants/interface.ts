export interface Address {
    city: string;
    ISO3166_2_lvl4: string;
    country: string;
    country_code: string;
}

export interface GeoJSON {
    type: string;
    coordinates: number[];
}

export interface PlaceResult {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: number;
    lon: number;
    class: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name: string;
    display_name: string;
    address: Address;
    boundingbox: [number, number, number, number];
    geojson: GeoJSON;
}

export interface ImageLink {
    id: number;
    imageLink: string;
}

export interface ListMarker {
    addAt: string;
    area: number;
    description: string;
    id: number;
    idDistrict: number;
    idUser: number;
    imageLink: ImageLink[];
    latitude: number;
    longitude: number;
    priceOnM2: number;
    typeArea: string;
}

export interface QuyHoachResponse {
    boundingbox: string;
    description: string;
    huyen_image: string;
    id: number;
    idDistrict: number;
    idProvince: number;
}

export interface LocationData {
    administrativeArea: string;
    country: string;
    countryCode: string;
    locality: string;
    name: string;
    postalCode: string | null;
    subAdministrativeArea: string;
    subLocality: string;
    subThoroughfare: string | null;
    thoroughfare: string | null;
}

export interface ResponseDataListMarkers {
    data: ListMarker[];
    status: number;
}

export interface ListTagItem {
    id: string;
    title: string;
    imageUrl: string;
    type: 'tag' | 'admin' | 'post' | 'user';
    details: TagDetails | AdminDetails | PostDetails | UserDetails;
}

interface TagDetails {
    tagPostCount: number;
}

interface AdminDetails {
    adminIsOnline: boolean;
}

interface PostDetails {
    postedBy: string;
}

interface UserDetails {
    userJoinedTime: string;
}

export interface Post {
    Content: string;
    FullName: string;
    Username: string;
    avatarLink: string | null;
    FavoriteNumber: number;
    GroupID: number;
    Hastags: string[];
    IPPosted: string;
    Images: string[];
    PostID: string;
    PostLatitude: string;
    PostLongitude: string;
    PostTime: string;
    Title: string;
    UpdatePostAt: string | null;
    UserID: number;
    timeView: number;
    view: number;
}

export interface UserPostNew {
    GroupID: number;
    Title: string;
    Content: string;
    PostLatitude: number;
    PostLongitude: number;
    Images: string[];
}

export interface ViewAllPostResponse {
    data: Post[];
    message: string;
    numberItem: number;
    numberPage: number;
    status: number;
}
export interface Group {
    BoxID: number;
    CreateAt: string;
    GroupID: number;
    GroupName: string;
    UserID: number;
    avatarLink: string;
}

export interface ViewAllGroupResponse {
    data: Group[];
    message: string;
    numberItem: number;
    numberPage: number;
    status: number | 200 | 400;
}

export interface Comment {
    Avatar: string;
    CmtPhoto: string[] | null;
    Images?: string[] | null;
    CommentID: number;
    CommentTime: string;
    CommentUpdateTime?: string;
    Content: string;
    FavoriteCount: number;
    FullName: string;
    PostID: number;
    UserID: number;
    Username: string;
}

export interface UserLikePost {
    avatar: string;
    fullName: string;
    idLike: number;
    idUser: number;
    username: string;
}

export interface NumberInteractions {
    TotalComment: number;
    TotalLike: number;
    TotalShare: number;
}

export interface ListTag {
    Hastag: string;
    count_number: number;
    create_at: string;
    idUser_create_hashtag: number;
}

export interface ListTagResponse {
    data: ListTag[];
    message: string;
    numberItem: number;
    numberPage: number;
    status: number | 200 | 400;
}

export interface UserInfor {
    Email: string;
    FullName: string;
    UserName: string;
    avatarLink: string | null;
    userId: number;
}

export interface BoxInterface {
    BoxID: number;
    BoxName: string;
    CreateAt: string;
    Description: string;
    UserID: number;
    avatarLink: string | null;
}

export interface PayloadNewLocation {
    idUser: string | number;
    imageLink: string[];
    description: string | undefined;
    longitude: number;
    latitude: number;
    priceOnM2: number;
    idDistrict: string | number;
    area: number;
    typeArea: string;
}

export interface Organization {
    id: number;
    name: string;
}

export interface AuctionResponse {
    AuctionAddress: string;
    AuctionUrl: string;
    DepositPaymentEndTime: string;
    DepositPaymentStartTime: string;
    DepositPrice: string;
    Description: string;
    DistrictID: number;
    EventSchedule: string;
    Images: Array<{
      Image: string;
    }>;
    LandAuctionCategoryID: number;
    LandAuctionID: string;
    Latitude: number | null;
    Longitude: number | null;
    OpenPrice: number;
    RegistrationEndTime: string;
    RegistrationStartTime: string;
    Title: string;
  }
  

  export interface AuctionDetailResponse {
    AddressAuctionHouse: string;
    AddressProperty: string;
    AddressPropertyOwner: string;
    AuctionAddress: string;
    AuctionUrl: string;
    CreateAt: string;
    DepositPaymentEndTime: string;
    DepositPaymentStartTime: string;
    DepositPrice: string;
    Description: string;
    DistrictID: number;
    EventSchedule: string;
    Images: AuctionImage[];
    LandAuctionCategoryID: number;
    LandAuctionID: number;
    Latitude: number | null;
    Longitude: number | null;
    NameAuctionHouse: string;
    NameProperty: string;
    NamePropertyOwner: string;
    Note: string;
    OpenPrice: number;
    PhoneNumberAuctionHouse: string;
    PostTime: number;
    PreviousPost: any[]; 
    RegistrationEndTime: string;
    RegistrationStartTime: string;
    Title: string;
    Videos: AuctionVideo[];
  }
  
  export interface AuctionImage {
    AuctionImgID: number;
    Descritption: string;
    Image: string;
    LandAuctionID: number;
  }
  
  export interface AuctionVideo {
    AuctionImgID: number;
    Descritption: string;
    LandAuctionID: number;
    Video: string;
  }
  

  interface QuyHoach {
    boundingbox: string;
    coordation: string;
    description: string;
    huyen_image: string;
    idDistrict: number;
    idProvince: number;
    id_quyhoach: number;
    location: string;
  }
  
  interface QuanHuyen {
    id_huyen: number;
    name_huyen: string;
    quyhoach: QuyHoach[];
  }
  
export  interface TinhQuyHoach {
    id_tinh: number;
    link_image: string;
    name_tinh: string;
    quan_huyen_1_tinh: QuanHuyen[];
  }
  
  // Mảng trả về từ API

  