import Joi from 'joi';

const schema = Joi.object({
    url: Joi.string().uri().required(),
    message: Joi.string().max(140).optional(), 
})

export async function validPost(req, res, next){
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    next();
}