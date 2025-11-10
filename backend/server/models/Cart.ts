import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  book: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  userId: string; // You can later replace this with real user auth
  items: ICartItem[];
}

const cartSchema = new Schema<ICart>(
  {
    userId: { type: String, required: true },
    items: [
      {
        book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ICart>('Cart', cartSchema);
