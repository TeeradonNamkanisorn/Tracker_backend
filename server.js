require("dotenv").config();
const express = require("express");
const cors = require("cors");
const invalidAddressMiddleware = require("./middlewares/invalidAddressMiddleware");
const app = express();
const PORT = process.env.PORT || 8000;
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const authenticator = require("./middlewares/authenticator");
const recordRouter = require("./routes/recordRoute");
const { sequelize } = require("./models");
const errorHandlerMiddleware = require("./middlewares/errorHandlerMiddleware");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/user", authenticator, userRouter);
app.use("/record", authenticator, recordRouter);

app.use(invalidAddressMiddleware);
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  // sequelize.sync({ alter: true }); //alternative to migration
  console.log("listening on http://localhost:" + PORT);
});
