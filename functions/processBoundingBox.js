const processBoundingBox = (boundingBoxStr) => {
    try {
        // Loại bỏ dấu ngoặc vuông và khoảng trắng, sau đó tách chuỗi thành mảng và chuyển thành số
        return JSON.parse(boundingBoxStr).map(Number);
    } catch (error) {
        console.error('Error processing bounding box:', error);
        return []; // Hoặc có thể trả về giá trị mặc định khác
    }
};

export default processBoundingBox;
