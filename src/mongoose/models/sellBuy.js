import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
	productName: {
		type: String,
		required: true,
		validate: {
			validator: function (value) {
				return value.length >= 4;
			},
			message: "product name should have minimum of four characters"
		}
	},
	costPrice: {
		type: Number,
		required: true,
		validate: {
			validator: function (value) {
				return value > 0;
			},
			message: "cost price value cannot be zero or negative value"
		}
	},
	soldPrice: {
		type: Number,
		validate: {
			validator: function (value) {
				return value > 0;
			},
			message: "sold price value cannot be zero or negative value"
		}
	}
});

const Product = mongoose.model('Product', productSchema, "sellbuys");

export default Product;