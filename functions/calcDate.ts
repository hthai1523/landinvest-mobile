export const calcDate = (dateString: string | undefined): string | undefined=> {
   if(dateString) {
    const date = new Date(dateString);
    const currentDate = new Date();
    const diffInMs = currentDate.getTime() - date.getTime();
    const seconds = Math.floor(diffInMs / 1000);

    if (seconds < 60) {
        return "Hiện tại";
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} phút trước`;
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        return `${hours} giờ trước`;
    } else if (seconds < 604800) {
        const days = Math.floor(seconds / 86400);
        return `${days} ngày trước`;
    } else {
        return date.toLocaleDateString();
    }
   } else {
    return undefined
   }
};
