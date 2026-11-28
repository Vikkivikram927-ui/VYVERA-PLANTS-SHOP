import jwt from "jsonwebtoken";

// creating middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ errors: "Please authunticate valid token" })
    } else {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            req.user = data.user
            next();
        } catch (error) {
            res.status(401).send({ error: "please auhtunticate a valid token" })
        }
    }
}

export default fetchUser