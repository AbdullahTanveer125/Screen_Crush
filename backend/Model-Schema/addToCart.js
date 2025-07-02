const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user', // Reference to the user model
		required: true,
	},
	movie: {
		adult: { type: Boolean },
		backdrop_path: { type: String },
		genre_ids: [{ type: Number }],
		id: { type: Number }, // TMDB movie ID
		original_language: { type: String },
		original_title: { type: String },
		overview: { type: String },
		popularity: { type: Number },
		poster_path: { type: String },
		release_date: { type: String },
		title: { type: String },
		video: { type: Boolean },
		vote_average: { type: Number },
		vote_count: { type: Number },
	},
	addedAt: {
		type: Date,
		default: Date.now,
	},
});

// const CartModel = mongoose.model('cart', cartItemSchema);

// export default CartModel;

// export default User;
module.exports = mongoose.model('cart', cartItemSchema);