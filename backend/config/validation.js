import Joi from 'joi';

const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(), // Mengubah name menjadi fullName
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid("user", "admin"), // Tambahkan validasi untuk `role`
        image: Joi.string().allow(null, ""),
        address: Joi.string().allow(null, ""),
        phone: Joi.string().allow(null, ""),
    });
    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(), // Memperbaiki Joi.email() menjadi Joi.string().email()
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
}

export { registerValidation, loginValidation };