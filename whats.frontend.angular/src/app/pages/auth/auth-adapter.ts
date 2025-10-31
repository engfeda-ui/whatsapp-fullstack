// Adapter للتحويل بين Angular Auth models و .NET Auth models

import { LoginRequest } from './login/ILogin';
import { RegisterRequest } from './register/IRegister';

export interface DotNetLoginRequest {
    email: string;
    password: string;
}

export interface DotNetRegisterRequest {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber?: string;
}

// Convert Angular LoginRequest to .NET
export function toDotNetLoginRequest(angularLogin: LoginRequest): DotNetLoginRequest {
    return {
        email: angularLogin.MobileNumber, // Using mobile as email
        password: angularLogin.Password
    };
}

// Convert Angular RegisterRequest to .NET
export function toDotNetRegisterRequest(angularRegister: RegisterRequest): DotNetRegisterRequest {
    return {
        fullName: angularRegister.FullName || angularRegister.CompanyName,
        email: angularRegister.MobileNumber, // Using mobile as email
        password: angularRegister.Password,
        confirmPassword: angularRegister.Password,
        phoneNumber: angularRegister.MobileNumber
    };
}
