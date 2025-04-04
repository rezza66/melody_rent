import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, ref: "User", required: true 
  }, 
  instrument: { 
    type: mongoose.Schema.Types.ObjectId, ref: "Instrument", required: true 
  }, 
  quantity: { 
    type: Number, required: true, min: 1, default: 1 
  }, 
  startDate: { 
    type: Date, required: true 
  }, 
  endDate: { 
    type: Date, required: true 
  }, 
  status: { 
    type: String, enum: ["ongoing", "returned", "overdue"], default: "ongoing" 
  }, 
  totalRentalFee: { 
    type: Number, required: true 
  },
  createdAt: { 
    type: Date, default: Date.now 
  }
});

const Loan = mongoose.model("Loan", loanSchema);
export default Loan;
