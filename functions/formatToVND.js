export function formatToVND(amount) {
    // Kiểm tra nếu input không phải là số
    if (isNaN(amount)) {
        return "Không hợp lệ";
    }

    // Chuyển đổi sang số và làm tròn đến 2 chữ số thập phân
    const number = parseFloat(amount);
    const roundedNumber = Math.round(number * 100) / 100;

    // Định dạng số theo chuẩn Việt Nam
    const formattedNumber = roundedNumber.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

    return formattedNumber;
}