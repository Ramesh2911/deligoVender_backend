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
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                mobile: user.mobile,
                id: user.id,
                business_type_id: user.business_type_id,
                token: token,
                token_expires_at: expiresAt.toISOString()
            }
        });
};
