const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// A constant for the default borrowing period (e.g., 21 days)
const BORROWING_DAYS = 21; 

const transactionSchema = new Schema({
    // Fields to match the simple data types you're using
    bookId: { 
        type: String, 
        required: true 
    },
    
    userId: { 
        type: Number, 
        required: true 
    },
    
    issueDate: { 
        type: Date, 
        required: true, 
        default: Date.now 
    },
    
    returnDate: { 
        type: Date, 
        default: null 
    },

    // NEW FIELD: Store the due date directly in the database
    dueDate: {
        type: Date,
        required: true,
        // Calculate the due date 21 days after the issue date before saving
        default: () => new Date(Date.now() + BORROWING_DAYS * 24 * 60 * 60 * 1000)
    }
    
}, { 
    timestamps: true,
    // Configuration to include virtuals when converting to JSON (e.g., in Express response)
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// VIRTUAL PROPERTY 1: Calculates the display status
transactionSchema.virtual('status').get(function() {
    const today = new Date();
    
    if (this.returnDate) {
        return 'Returned';
    }
    
    if (this.dueDate && this.dueDate < today) {
        return 'Overdue';
    }
    
    return 'Borrowed';
});

// VIRTUAL PROPERTY 2: Calculates the due date for display (to match your EJS)
transactionSchema.virtual('dueDateDisplay').get(function() {
    // Check if dueDate exists and format it for the EJS view
    if (this.dueDate) {
        // Simple YYYY-MM-DD format (or whatever format you prefer)
        return this.dueDate.toISOString().split('T')[0];
    }
    return 'N/A';
});


const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;