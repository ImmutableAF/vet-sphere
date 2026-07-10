export const validateName = (value) => { 
    if(!value) return {valid: false, message: "Name is required"}
    if(value.length < 2) return {valid: false, message: "Name must be at least two characters"}
    if(!/^[a-zA-Z\s]+$/.test(value)) return {valid: false, message: "Name can only contain letters"}
    return {valid: true, message: ""}
}

export const validateEmail = (value) => {
    if (!value) return { valid: false, message: "Email is required" }
    if (value.includes(" ")) return { valid: false, message: "Email cannot contain spaces" }
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) 
        return { valid: false, message: "Enter a valid email address" }
    if (/\.{2,}/.test(value)) return { valid: false, message: "Email cannot contain consecutive dots" }
    if (/[._-]{2,}/.test(value)) return { valid: false, message: "Email cannot contain consecutive special characters" }
    if (value.startsWith(".") || value.startsWith("-") || value.startsWith("_"))
        return { valid: false, message: "Email cannot start with a special character" }
    return { valid: true, message: "" }
}

export const validatePassword = (value) => {
    if (!value) return { valid: false, message: "Password is required" }
    if (value.length < 8) return { valid: false, message: "Password must be at least 8 characters" }
    if (!/[A-Z]/.test(value)) return { valid: false, message: "Password must contain at least one uppercase letter" }
    if (!/[0-9]/.test(value)) return { valid: false, message: "Password must contain at least one number" }
    return { valid: true, message: "" }
}

export const validateConfirmPassword = (value, password) => {
    if (!value) return { valid: false, message: "Please confirm your password" }
    if (value !== password) return { valid: false, message: "Passwords do not match" }
    return { valid: true, message: "" }
}

export const validatePhone = (value) => {
    if (!value) return { valid: false, message: "Phone number is required" }
    if (!/^\d+$/.test(value)) return { valid: false, message: "Phone number can only contain digits" }
    if (value.length < 10 || value.length > 13) return { valid: false, message: "Enter a valid phone number (10–13 digits)" }
    return { valid: true, message: "" }
}

export const validateSpecialization = (value) => {
    if (!value) return { valid: false, message: "Specialization is required" }
    if (value.length < 2) return { valid: false, message: "Specialization must be at least 2 characters" }
    return { valid: true, message: "" }
}

export const validateLicense = (value) => {
    if (!value) return { valid: false, message: "License number is required" }
    if (!/^[a-zA-Z0-9]+$/.test(value)) return { valid: false, message: "License number must be alphanumeric" }
    if (value.length < 4) return { valid: false, message: "License number must be at least 4 characters" }
    return { valid: true, message: "" }
}