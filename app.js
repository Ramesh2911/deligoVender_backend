import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import cors from 'cors';
import authRoute from './routes/authRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import unitRoutes from './routes/unitRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

import Stripe from "stripe";

config({
    path: './config.env'
});

const app = express();
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.LOCAL_HOST],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRoute);
app.use('/api', otpRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', unitRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', orderRoutes);


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/payment-sheet', async (req, res) => {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2025-07-30.basil' }
    );
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1099,
        currency: 'eur',
        customer: customer.id,
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: 'pk_test_51RyWnhAcEylHxGbjiFCv3x0mDXcxixAm6L6X7BvTi1tnD9iQs4ko7N8iAGSVZlbi4pq74NBQkO0q4t1hSYNaeLf000LjYLOVtK'
    });
});



export default app;
