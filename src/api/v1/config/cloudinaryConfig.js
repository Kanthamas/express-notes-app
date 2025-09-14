import { v2 as cloundinary } from "cloudinary";

export const couldinaryConfig = () => {
	cloundinary.config({
		cloud_name: process.env.CLOUDINARY_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
		secure: true,
	});
};
