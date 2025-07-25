import dotenv from 'dotenv';
import twilio from 'twilio';
import con from '../db/db.js';
dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


//=======send OTP======
export const sendOTP = async (req, res) => {
   const { phone, areacode, countryid } = req.body;

   if (!phone || !areacode || !countryid) {
      return res.status(400).json({
         status: false,
         message: 'Phone number, country code, and country ID are required',
      });
   }

    const otp = Math.floor(1000 + Math.random() * 9000);
   const fullPhone = `+${areacode}${phone}`;

   try {
      const message = await client.messages.create({
         body: `Your Deligo OTP Service Verification code ${otp}`,
         from: process.env.TWILIO_PHONE_NUMBER,
         to: fullPhone,
      });

      await con.query(
         `INSERT INTO hr_otp (user_id,country_id, mobile, otp) VALUES (0,?, ?, ?)`,
         [countryid, phone, otp]
      );

      return res.status(200).json({
         status: true,
         message: 'OTP sent successfully',
      });
   } catch (error) {
      console.error('Twilio or DB Error:', error);
      return res.status(500).json({
         status: false,
         message: 'Failed to send and store OTP',
      });
   }
};

//=====verify OTP=====
export const verifyOTP = async (req, res) => {
   const { phone, otp, countryid } = req.body;

   if (!phone || !otp || !countryid) {
      return res.status(400).json({
         status: false,
         message: 'Phone, OTP, and country ID are required',
      });
   }

   try {
      const [rows] = await con.query(
         'SELECT * FROM hr_otp WHERE mobile = ? AND country_id = ? AND otp = ?',
         [phone, countryid, otp]
      );

      if (rows.length === 0) {
         return res.status(401).json({
            status: false,
            message: 'Invalid OTP',
         });
      }

      await con.query('DELETE FROM hr_otp WHERE mobile = ?', [phone]);

      return res.status(200).json({
         status: true,
         message: 'OTP verified successfully',
      });
   } catch (error) {
      console.error('OTP Verification Error:', error.message);
      return res.status(500).json({
         status: false,
         message: 'Server error during OTP verification',
      });
   }
};

//===== resend OTP====
export const resendOTP = async (req, res) => {
   const { phone, countryid, areacode } = req.body;

   if (!phone || !countryid || !areacode) {
      return res.status(400).json({
         status: false,
         message: 'Phone number, country ID, and area code are required',
      });
   }

   try {
      const [rows] = await con.query(
         `SELECT * FROM hr_otp WHERE country_id = ? AND mobile = ?`,
         [countryid, phone]
      );

      if (rows.length === 0) {
         return res.status(404).json({
            status: false,
            message: 'No OTP record found to resend',
         });
      }
      const otp = Math.floor(1000 + Math.random() * 9000);
      const fullPhone = `+${areacode}${phone}`;

      await con.query(`UPDATE hr_otp SET otp = ? WHERE id = ?`, [otp, rows[0].id]);

      const message = await client.messages.create({
         body: `Your Deligo OTP Resend Verification code is ${otp}`,
         from: process.env.TWILIO_PHONE_NUMBER,
         to: fullPhone,
      });

      return res.status(200).json({
         status: true,
         message: 'OTP resent successfully',
      });

   } catch (error) {
      console.error('Resend OTP Error:', error);
      return res.status(500).json({
         status: false,
         message: 'Failed to resend OTP',
      });
   }
};
