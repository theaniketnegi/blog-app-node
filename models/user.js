const mongoose = require("mongoose");
const {createHma, randomBytes, createHmac} = require("crypto");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default_avatar.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
    const user = this;
    if(!user.isModified('password'))
        return;
    
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256' ,salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
    next();
});

userSchema.static("matchPasswords", async function (email, password){
    const user = await this.findOne({email});
    if(!user)   throw new Error("User not found!");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvided = createHmac('sha256', salt).update(password).digest("hex");
    if(hashedPassword!==userProvided)
        throw new Error("Incorrect password");

    return {...user._doc, password:undefined, salt: undefined};
})
const User = mongoose.model("user", userSchema);

module.exports = User;
