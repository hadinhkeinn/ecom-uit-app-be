const mongoose = require("mongoose");


const categorySchema = mongoose.Schema(
    {
        title: {
            type: String,
            require: true,
            unique: true,
            index: true,
        }
    },
    {
        timestamps: true
    }
)

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
