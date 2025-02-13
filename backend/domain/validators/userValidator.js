import joi from 'joi';

export const validateUser = (data) => {
    const schema = joi.object({
        name : joi.string().min(3).required()
    })
    return schema.validate(data);
} 
