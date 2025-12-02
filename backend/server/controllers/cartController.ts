import type { Request, Response } from 'express';
import prisma from '../prisma.js';

const USER_ID = 'demo-user'; // for simplicity

// Get cart
export const getCart = async (_req: Request, res: Response) => {
  const cart = await prisma.cart.findFirst({
    where: { userId: USER_ID },
    include: {
      items: {
        include: {
          book: true,
        },
      },
    },
  });
  if (!cart) return res.json({ items: [] });
  res.json(cart);
};

// Add item
export const addToCart = async (req: Request, res: Response) => {
  const { bookId, quantity = 1 } = req.body;
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) return res.status(404).json({ error: 'Book not found' });

  let cart = await prisma.cart.findFirst({
    where: { userId: USER_ID },
    include: { items: true },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: USER_ID,
        items: {
          create: {
            bookId,
            quantity,
          },
        },
      },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
    });
  } else {
    const existingItem = cart.items.find((i) => i.bookId === bookId);
    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          bookId,
          quantity,
        },
      });
    }
    cart = await prisma.cart.findFirst({
      where: { userId: USER_ID },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
    });
  }

  res.json(cart);
};

// Remove item
export const removeFromCart = async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const cart = await prisma.cart.findFirst({
    where: { userId: USER_ID },
    include: { items: true },
  });
  if (!cart) return res.status(404).json({ error: 'Cart not found' });

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
      bookId,
    },
  });

  const updatedCart = await prisma.cart.findFirst({
    where: { userId: USER_ID },
    include: {
      items: {
        include: {
          book: true,
        },
      },
    },
  });
  res.json(updatedCart);
};

// Clear cart
export const clearCart = async (_req: Request, res: Response) => {
  let cart = await prisma.cart.findFirst({
    where: { userId: USER_ID },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: USER_ID,
      },
    });
  } else {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  const updatedCart = await prisma.cart.findFirst({
    where: { userId: USER_ID },
    include: {
      items: {
        include: {
          book: true,
        },
      },
    },
  });
  res.json(updatedCart);
};

export const updateCartItemController = async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await prisma.cart.findFirst({
      where: { userId: USER_ID },
      include: { items: true },
    });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const item = cart.items.find((i) => i.bookId === bookId);
    if (!item) return res.status(404).json({ error: 'Item not found in cart' });

    // Remove item if quantity <= 0
    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    } else {
      // Check stock
      const book = await prisma.book.findUnique({ where: { id: bookId } });
      if (!book) return res.status(404).json({ error: 'Book not found' });

      const available = book.stock ?? Infinity;
      if (available < quantity) {
        return res.status(400).json({ error: 'Not enough stock' });
      }

      await prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity },
      });
    }

    const updatedCart = await prisma.cart.findFirst({
      where: { userId: USER_ID },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
    });
    res.json(updatedCart);
  } catch (err) {
    console.error('Error updating cart item:', err);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};
