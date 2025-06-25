/**
 * Validate Vietnamese phone number (must start with 0 and have 10 digits)
 * @param phone string
 * @returns string
 */
export function validatePhone(phone: string): string {
	return /^0\d{9,10}$|^\+84\d{9,10}$/.test(phone) ? "" : "Số điện thoại không hợp lệ";
}

/**
 * Validate OTP (must be 6 digits)
 * @param otp string
 * @returns string
 */
export function validateOtp(otp: string): string {
	return /^\d{6}$/.test(otp) ? "" : "OTP phải gồm 6 chữ số";
}

/**
 * Validate number (must be a positive integer)
 * @param number number
 * @returns string
 */
export function validateNumber(number: number): string {
	return Number.isInteger(number) && number > 0 ? "" : "Số lần phải > 0";
}
