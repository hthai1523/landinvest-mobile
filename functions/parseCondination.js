export const parseCoordination = (coordinationString) => {
    try {
        // Loại bỏ ký tự xuống dòng và khoảng trắng thừa
        const cleanedString = coordinationString.replace(/\s/g, '');
        
        // Parse chuỗi JSON
        const parsedArray = JSON.parse(cleanedString);

        // Làm phẳng mảng nếu cần
        return Array.isArray(parsedArray[0]) ? parsedArray[0] : parsedArray;
    } catch (error) {
        console.error('Lỗi khi parse chuỗi coordination:', error);
        return [];
    }
};