// src/constants/AuthSchemas.ts
import { z } from 'zod';

const FIELD_REQUIRED_STR = 'Trường này là bắt buộc';

export const emailSchema = z
    .string({
        invalid_type_error: 'Email phải là một chuỗi',
        required_error: FIELD_REQUIRED_STR,
    })
    .email('Email không hợp lệ');

export const passwordSchema = z
    .string({
        invalid_type_error: 'Mật khẩu phải là một chuỗi',
        required_error: FIELD_REQUIRED_STR,
    })
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(100, 'Mật khẩu không được vượt quá 100 ký tự');

export const loginFormSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

export const signUpFormSchema = loginFormSchema
    .extend({
        userName: z
            .string({
                invalid_type_error: 'Tên đăng nhập phải là một chuỗi',
                required_error: FIELD_REQUIRED_STR,
            })
            .min(3, 'Tối thiểu 3 ký tự')
            .max(20, 'Tối đa 20 ký tự')
            .trim(),
        name: z
            .string({
                invalid_type_error: 'Tên phải là một chuỗi',
                required_error: FIELD_REQUIRED_STR,
            })
            .min(3, 'Tối thiểu 3 ký tự')
            .max(20, 'Tối đa 20 ký tự')
            .trim(),
        passwordConfirmation: z
            .string({
                invalid_type_error: 'Xác nhận mật khẩu phải là một chuỗi',
                required_error: FIELD_REQUIRED_STR,
            })
            .min(6, 'Xác nhận mật khẩu phải có ít nhất 6 ký tự'),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: 'Mật khẩu xác nhận không khớp',
        path: ['passwordConfirmation'],
    });

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;
