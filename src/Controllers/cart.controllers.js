const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const TicketRepository = require('../repositories/ticket.repository');

async function purchaseCart(req, res) {
    const cartId = req.params.cid;

    try {
        // Encontrar el carrito en la base de datos
        const cart = await Cart.findById(cartId).populate('items.product');

        if (!cart) {
            return res.status(404).json({ message: 'El carrito no existe' });
        }

        // Verificar el stock de los productos antes de finalizar la compra
        const productsToUpdate = [];
        const productsNotPurchased = [];

        for (const item of cart.items) {
            const product = item.product;
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                productsToUpdate.push(product);
            } else {
                productsNotPurchased.push(product._id);
            }
        }

        // Actualizar el stock de los productos comprados
        await Promise.all(productsToUpdate.map(product => product.save()));

        // Crear un ticket con los datos de la compra
        const ticketData = {
            code: generateUniqueTicketCode(), // Generar un código único para el ticket
            amount: calculateTotalAmount(cart.items), // Calcular el total de la compra
            purchaser: req.user.email // Correo del usuario asociado al carrito
        };

        const ticketRepository = new TicketRepository();
        const ticket = await ticketRepository.createTicket(ticketData);

        // Actualizar el carrito del usuario con los productos que no pudieron ser comprados
        cart.items = cart.items.filter(item => !productsNotPurchased.includes(item.product._id));
        await cart.save();

        return res.status(200).json({ message: 'Compra realizada con éxito', ticket });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al procesar la compra' });
    }
}

function generateUniqueTicketCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

function calculateTotalAmount(items) {
    let total = 0;
    for (const item of items) {
        total += item.product.price * item.quantity;
    }
    return total;
}

module.exports = {
    purchaseCart
};
