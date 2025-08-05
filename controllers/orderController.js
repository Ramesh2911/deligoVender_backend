import con from '../db/db.js';

//===== order list====
export const orderDetails = async (req, res) => {
   const { vendor_id } = req.query;

   if (!vendor_id) {
      return res.status(400).json({ status: false, message: "vendor_id is required" });
   }

   try {
      const [orders] = await con.query(
         `SELECT
        o.oid AS order_id,
        o.user_id,
        u.first_name,
        u.last_name,
        o.total_amount,
        o.status,
        o.shipping_address,
        o.billing_address,
        o.payment_method,
        o.created_time
      FROM hr_order o
      JOIN hr_users u ON o.user_id = u.id
      WHERE o.vendor_id = ?`,
         [vendor_id]
      );

      // Fetch items for each order using oid as order_id
      for (let order of orders) {
         const [items] = await con.query(
            `SELECT product_name, quantity FROM hr_order_item WHERE order_id = ?`,
            [order.order_id]
         );
         order.items = items;
      }

      return res.status(200).json({ status: true, data: orders });
   } catch (error) {
      console.error("Error fetching order details:", error);
      return res.status(500).json({ status: false, message: "Internal server error" });
   }
};