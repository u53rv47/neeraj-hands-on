import express from 'express';
import mongoose from 'mongoose';
import SellBuy from "../mongoose/models/sellBuy.js"


mongoose.connect("mongodb+srv://u53rv47:Vij88086ay@cluster0.wwxfm8e.mongodb.net/" + 'product');

const app = express();
app.use(express.json());

sell.get('/sellProduct', async (req, res) => {
	console.log("request query:", req.query);
	const { product = null, sortBy = null } = req.query
	let allProducts;
	try {
		if (product !== null) {
			allProducts = await SellBuy.find({ productName: product });
		} else if (sortBy !== null) {
			let sort = "soldPrice";
			let order = 1;
			if (sortBy.indexOf("CostPrice") !== -1) {
				sort = "costPrice"
				order = sortBy.split("CostPrice")[0] === "lower" ? 1 : -1;
			} else {
				order = sortBy.split("SoldPrice")[0] === "lower" ? 1 : -1;
			}
			console.log(sort, order);
			allProducts = await SellBuy.find({}).sort({ [sort]: order });

		} else allProducts = await SellBuy.find({});

		res.status(200).json(allProducts);
	} catch (err) {
		res.sendStatus(400);
	}
});

app.post("/sellProduct", async (req, res) => {
	console.log("request body:", req.body);
	const { productName, costPrice } = req.body;

	try {
		const product = new SellBuy({
			productName, costPrice
		});
		await product.save();
		res.status(201).json({ message: "Product Added" });
	} catch (err) {
		if (err.message.indexOf("productName") !== -1)
			res.status(400).json({ error: "product name should have minimum of four characters" })
		else res.status(400).json({ error: "cost price value cannot be zero or negative value" })
	}
});

app.patch("/sellProduct/:id", async (req, res) => {
	const productId = req.params.id;
	const { soldPrice } = req.body;
	try {
		await SellBuy.findByIdAndUpdate(productId, { soldPrice }, { runValidators: true });
		res.status(200).json({ message: "Updated Successfully" });
	} catch (err) {
		res.status(400).json({ error: "sold price value cannot be zero or negative value" });
	}
});


app.delete("/sellProduct/:id", async (req, res) => {
	const productId = req.params.id;
	try {
		await SellBuy.findByIdAndDelete(productId);
		res.status(200).json({ message: "Deleted successfully" });
	} catch (err) {
		res.sendStatus(400);
	}
});


app.listen(3000, () => {
	console.log("MyStore is running on port 3000");
});