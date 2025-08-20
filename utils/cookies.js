import jwt from 'jsonwebtoken';

// ===== admin cookie =======
export const adminCookie = (jwt_secret, user, res, message) => {
    const expiresIn = 30 * 24 * 60 * 60 * 1000;
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        jwt_secret,
        { expiresIn: '30d' }
    );

    const expiresAt = new Date(Date.now() + expiresIn);

    res.status(200)
        .cookie('admin_token', token, {
            httpOnly: true,
            maxAge: expiresIn,
            sameSite: 'none',
            secure: true
        })
        .json({
            status: true,
            message: message,
            user: {
                prefix: user.prefix,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                mobile: user.mobile,
                id: user.id,
                business_type_id: user.business_type_id,
                is_online : user.is_online ,
                business_name: user.business_name,
                address: user.address,
                pincode: user.pincode,
                company_name: user.company_name,
                category_name: user.category_name,
                country_name: user.country_name,
                country_id: user.country_id,
                nif: user.nif,
                business_person: user.business_person,
                contact_mail: user.contact_mail,
                contact_mobile: user.contact_mobile,
                bank_id: user.bank_id,
                account_no: user.account_no,
                latitude: user.latitude,
                longitude: user.longitude,
                rating: user.rating,
                token: token,
                token_expires_at: expiresAt.toISOString()
            }
        });
};
