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
   const { order_id, item_id } = req.query;
   const { action, reason } = req.body;

   if (!order_id || !item_id || !['accept', 'reject'].includes(action)) {
      return res.status(400).json({ status: false, message: "Invalid parameters" });
   }

   try {
      let itemStatus;
      let orderStatus = null;

      if (action === 'accept') {
         itemStatus = 1;
      } else {
         itemStatus = 2;
      }

      await con.query(
         "UPDATE hr_order_item SET status = ?, vendor_notes = ? WHERE order_id = ? AND oiid = ?",
         [itemStatus, action === 'reject' ? reason : null, order_id, item_id]
      );

      const [items] = await con.query(
         "SELECT status FROM hr_order_item WHERE order_id = ?",
         [order_id]
      );

      const totalItems = items.length;
      const acceptedCount = items.filter(it => it.status === 1).length;
      const rejectedCount = items.filter(it => it.status === 2).length;
      const pendingCount = items.filter(it => it.status === 0).length;


      if (totalItems === 1) {
         orderStatus = (action === 'accept') ? 2 : 6;
         await con.query(
            "UPDATE hr_order SET status = ? WHERE oid = ?",
            [orderStatus, order_id]
         );
      } else {
         if (pendingCount === 0) {
            if (acceptedCount > 0 && rejectedCount > 0) {
               orderStatus = 2;
            } else if (acceptedCount === 0 && rejectedCount > 0) {
               orderStatus = 6;
            } else if (acceptedCount > 0 && rejectedCount === 0) {
               orderStatus = 2;
            }
            if (orderStatus !== null) {
               await con.query(
                  "UPDATE hr_order SET status = ? WHERE oid = ?",
                  [orderStatus, order_id]
               );
            }
         }
      }

      return res.status(200).json({
         status: true,
         message: "Order item updated successfully",
      });

   } catch (error) {
      console.error("Update error:", error);
      return res.status(500).json({
         status: false,
         message: "Server error while updating order item status",
      });
   }
};
