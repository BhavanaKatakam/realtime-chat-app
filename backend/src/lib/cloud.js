import {v2 as cloud} from "cloudinary"
import {config} from "dotenv"

config();
cloud.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export default cloud;