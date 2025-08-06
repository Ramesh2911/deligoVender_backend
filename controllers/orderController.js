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

      for (let order of orders) {
         const [items] = await con.query(
            `SELECT oiid, product_name, quantity,total_amount,status FROM hr_order_item WHERE order_id = ?`,
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

//==== status update=====
export const updateOrderStatus = async (req, res) => {
   const { order_id } = req.query;
   const { status } = req.body;

   if (!order_id || ![2, 6].includes(status)) {
      return res.status(400).json({ status: false, message: "Invalid order_id or status" });
   }

   try {
      const [orderResult] = await con.query(
         "UPDATE hr_order SET status = ? WHERE oid = ?",
         [status, order_id]
      );

      const [itemResult] = await con.query(
         "UPDATE hr_order_item SET status = ? WHERE order_id = ?",
         [status, order_id]
      );

      return res.status(200).json({
         status: true,
         message: "Order status updated successfully",
      });
   } catch (error) {
      console.error("Update error:", error);
      return res.status(500).json({
         status: false,
         message: "Server error while updating order status",
      });
   }
};