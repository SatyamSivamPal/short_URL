import express from "express"
import connectToMongoDB from "./connect.js"
import urlRoute from "./routes/url.js";
import URL from "./models/url.js";

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
    console.log("Mongodb connected")
);

app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        }
    );
    if (entry && entry.redirectURL) {
        const website = entry.redirectURL;
        console.log(website);

        res.redirect(website);
    } else {

        res.status(404).send('URL not found');
    }
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
