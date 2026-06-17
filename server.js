require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const { MercadoPagoConfig, Payment } = require('mercadopago');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
  console.warn('AVISO: configure MERCADO_PAGO_ACCESS_TOKEN no arquivo .env');
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || ''
});

app.use(express.json());
app.use(express.static(__dirname));

function sanitizeItems(items = []) {
  return items
    .filter(item => item && Number(item.quantity) > 0 && Number(item.unit_price) > 0)
    .map(item => ({
      name: String(item.name || 'Produto VT GAMES').slice(0, 80),
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price)
    }));
}

app.post('/api/create-pix-payment', async (req, res) => {
  try {
    const { payer, items } = req.body;
    const cleanItems = sanitizeItems(items);

    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'Access Token do Mercado Pago não configurado.' });
    }

    if (!cleanItems.length) {
      return res.status(400).json({ error: 'Carrinho vazio ou inválido.' });
    }

    if (!payer || !payer.email) {
      return res.status(400).json({ error: 'Informe um e-mail válido.' });
    }

    const total = cleanItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
    const payment = new Payment(client);

    const result = await payment.create({
      body: {
        transaction_amount: Number(total.toFixed(2)),
        description: cleanItems.map(item => `${item.name} x${item.quantity}`).join(' | ').slice(0, 255),
        payment_method_id: 'pix',
        payer: {
          email: payer.email,
          first_name: payer.name || 'Cliente'
        }
      },
      requestOptions: {
        idempotencyKey: crypto.randomUUID()
      }
    });

    const tx = result.point_of_interaction?.transaction_data || {};

    res.json({
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      qr_code: tx.qr_code,
      qr_code_base64: tx.qr_code_base64,
      ticket_url: tx.ticket_url
    });
  } catch (error) {
    console.error('ERRO MP:', error);
    res.status(500).json({
      error: 'Erro ao gerar pagamento PIX no Mercado Pago.',
      detail: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`VT GAMES V10 + PIX rodando em http://localhost:${PORT}`);
});
