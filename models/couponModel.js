import mongoose from "mongoose";

const couponScheme = new mongoose.Schema({

    couponCode : {
        type : String,
        required : true
    },
    couponDiscount : {
        type : Number,
        required : true
    },
    isActive : {
        type : Boolean,
        default : true,
        required : false 
    }
},{
    timestamps : true
})


const Coupon = mongoose.model("Coupon", couponScheme) 

export default Coupon