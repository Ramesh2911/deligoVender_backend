import con from '../db/db.js';

//=====addProduct=====
export const addProduct = async (req, res) => {
   try {
      const {
         product_cat,
         product_sub_cat,
         vendor_id,
         product_name,
         product_image,
         product_short,
         product_desc,
         mrp_price,
         price,
         sku,
         brand,
         stock_quantity,
         product_unit_id,
         is_active
      } = req.body;

      const query = `
      INSERT INTO hr_product
      (
        product_cat,
        product_sub_cat,
        vendor_id,
        product_name,
        product_image,
        product_short,
        product_desc,
        mrp_price,
        price,
        sku,
        brand,
        stock_quantity,
        product_unit_id,
        is_active,
        created_time
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, NOW())
    `;

      const values = [
         product_cat,
         product_sub_cat,
         vendor_id,
         product_name,
         product_image,
         product_short,
         product_desc,
         mrp_price,
         price,
         sku,
         brand,
         stock_quantity,
         product_unit_id,
         is_active
      ];

      const [result] = await con.query(query, values);

      res.status(200).json({
         status: true,
         message: 'Product added successfully',
         productId: result.insertId
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         status: false,
         message: 'Something went wrong',
         error: error.message
      });
   }
};

//====updateProduct=====
export const updateProduct = async (req, res) => {
   const {
      product_cat,
      product_sub_cat,
      vendor_id,
      product_name,
      product_image,
      product_short,
      product_desc,
      mrp_price,
      price,
      sku,
      brand,
      stock_quantity,
      product_unit_id,
      is_active,
   } = req.body;

   const { pid } = req.params;

   if (!pid) {
      return res.status(400).json({ success: false, message: 'Product ID (pid) is required' });
   }

   try {
      const sql = `
      UPDATE hr_product SET
        product_cat = ?,
        product_sub_cat = ?,
        vendor_id = ?,
        product_name = ?,
        product_image = ?,
        product_short = ?,
        product_desc = ?,
        mrp_price = ?,
        price = ?,
        sku = ?,
        brand = ?,
        stock_quantity = ?,
        product_unit_id = ?,
        is_active = ?,
        modified_time = NOW()
      WHERE pid = ?
    `;

      const values = [
         product_cat,
         product_sub_cat,
         vendor_id,
         product_name,
         product_image,
         product_short,
         product_desc,
         mrp_price,
         price,
         sku,
         brand,
         stock_quantity,
         product_unit_id,
         is_active,
         pid,
      ];

      const [result] = await con.query(sql, values);

      if (result.affectedRows === 0) {
         return res.status(404).json({ success: false, message: 'Product not found' });
      }

      return res.status(200).json({ success: true, message: 'Product updated successfully' });
   } catch (error) {
      console.error('Update Product Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
   }
};

//=====vendor against product====
export const getProductsByVendor = async (req, res) => {
   let { vendor_id } = req.query;

   vendor_id = parseInt(vendor_id);
   if (!vendor_id || isNaN(vendor_id)) {
      return res.status(400).json({ success: false, message: 'vendor_id must be a valid number' });
   }

   try {
      const [results] = await con.query(
         'SELECT * FROM hr_product WHERE vendor_id = ?',
         [vendor_id]
      );

      if (results.length === 0) {
         return res.status(200).json({
            success: true,
            message: 'No data available',
            data: [],
         });
      }

      return res.status(200).json({
         success: true,
         data: results,
      });

   } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
   }
};
