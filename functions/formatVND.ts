export function formatToVND(amount: string | number): string {
    const number = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(number)) {
        return "Không hợp lệ";
    }

    const roundedNumber = Math.round(number * 100) / 100;

    const formattedNumber = roundedNumber.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

    return formattedNumber;
}
