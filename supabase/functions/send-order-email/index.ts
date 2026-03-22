import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface OrderItem {
  product_name: string;
  size: string;
  quantity: number;
  price: number;
  product_image?: string;
}

interface OrderEmailPayload {
  to_email?: string;
  customer_name: string;
  customer_phone: string;
  customer_instagram: string;
  order_number: string;
  order_date: string;
  items: OrderItem[];
  total: number;
  payment_method: string;
  payment_label: string;
}

const ADMIN_EMAIL = "ale2577151@maricopa.edu";

const paymentInstructions: Record<string, string> = {
  efectivo: "💵 Pago en efectivo al momento de la entrega.",
  yappy: "📱 Realiza tu pago por Yappy al número que te indicaremos por WhatsApp/Instagram.",
  transferencia: "🏦 Realiza tu transferencia bancaria. Te enviaremos los datos por WhatsApp/Instagram.",
};

const buildItemsHtml = (items: OrderItem[]) =>
  items.map((item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0e6d3;">
        <div style="font-weight: 600; color: #1a1a1a;">${item.product_name}</div>
        <div style="font-size: 13px; color: #8a7968; margin-top: 2px;">Talla: ${item.size} · Cantidad: ${item.quantity}</div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0e6d3; text-align: right; font-weight: 600; color: #1a1a1a;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>`).join("");

// Email para el ADMIN (notificación de nuevo pedido)
const buildAdminEmail = (payload: OrderEmailPayload) => {
  const { customer_name, customer_phone, customer_instagram, order_number, order_date, items, total, payment_method, payment_label } = payload;
  const itemsHtml = buildItemsHtml(items);
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="text-align:center;padding:30px 20px;background:linear-gradient(135deg,#c9a96e,#b8860b);border-radius:16px 16px 0 0;">
      <h1 style="margin:0;font-size:28px;font-weight:700;color:#fff;letter-spacing:4px;">HEMERZA</h1>
      <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.85);letter-spacing:2px;">NUEVO PEDIDO RECIBIDO</p>
    </div>
    <div style="background:#fff;padding:30px;border-radius:0 0 16px 16px;box-shadow:0 4px 20px rgba(0,0,0,0.06);">
      
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px 20px;margin-bottom:24px;text-align:center;">
        <p style="margin:0;font-size:16px;font-weight:700;color:#15803d;">🎉 Nuevo pedido: ${order_number}</p>
        <p style="margin:4px 0 0;font-size:13px;color:#166534;">${order_date}</p>
      </div>

      <p style="font-size:12px;font-weight:700;color:#8a7968;letter-spacing:2px;margin:0 0 10px;text-transform:uppercase;">Datos del cliente</p>
      <div style="background:#fdf8f0;border:1px solid #f0e6d3;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="font-size:13px;color:#8a7968;padding:4px 0;">Nombre</td><td style="font-size:13px;color:#1a1a1a;font-weight:600;text-align:right;">${customer_name}</td></tr>
          <tr><td style="font-size:13px;color:#8a7968;padding:4px 0;">Teléfono</td><td style="font-size:13px;color:#1a1a1a;font-weight:600;text-align:right;">${customer_phone}</td></tr>
          <tr><td style="font-size:13px;color:#8a7968;padding:4px 0;">Instagram</td><td style="font-size:13px;color:#1a1a1a;font-weight:600;text-align:right;">@${customer_instagram}</td></tr>
          <tr><td style="font-size:13px;color:#8a7968;padding:4px 0;">Método de pago</td><td style="font-size:13px;color:#1a1a1a;font-weight:600;text-align:right;">${payment_label}</td></tr>
        </table>
      </div>

      <p style="font-size:12px;font-weight:700;color:#8a7968;letter-spacing:2px;margin:0 0 10px;text-transform:uppercase;">Productos</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">${itemsHtml}</table>

      <div style="background:linear-gradient(135deg,#c9a96e,#b8860b);border-radius:12px;padding:16px 20px;text-align:center;margin-bottom:24px;">
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.8);letter-spacing:1px;">TOTAL DEL PEDIDO</p>
        <p style="margin:6px 0 0;font-size:26px;font-weight:700;color:#fff;">$${total.toFixed(2)} USD</p>
      </div>

      <div style="text-align:center;">
        <a href="https://hemerza.lovable.app/admin" style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:12px 28px;border-radius:25px;font-size:13px;font-weight:600;letter-spacing:1px;">
          Ver en el Panel Admin →
        </a>
      </div>
    </div>
    <div style="text-align:center;padding:20px;">
      <p style="margin:0;font-size:11px;color:#a09080;">© ${new Date().getFullYear()} HEMERZA · Panamá</p>
    </div>
  </div>
</body>
</html>`;
};

// Email de confirmación para el CLIENTE
const buildClientEmail = (payload: OrderEmailPayload) => {
  const { customer_name, order_number, order_date, items, total, payment_method, payment_label } = payload;
  const itemsHtml = buildItemsHtml(items);
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="text-align:center;padding:40px 20px 30px;background:linear-gradient(135deg,#c9a96e,#b8860b);border-radius:16px 16px 0 0;">
      <h1 style="margin:0;font-size:32px;font-weight:700;color:#fff;letter-spacing:4px;">HEMERZA</h1>
      <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.85);letter-spacing:2px;">SWIMWEAR & ACTIVEWEAR</p>
    </div>
    <div style="background:#fff;padding:35px 30px;border-radius:0 0 16px 16px;box-shadow:0 4px 20px rgba(0,0,0,0.06);">
      <p style="font-size:18px;color:#1a1a1a;margin:0 0 5px;">¡Hola, <strong>${customer_name}</strong>! 👋</p>
      <p style="font-size:15px;color:#6b5b4e;margin:0 0 25px;line-height:1.6;">Tu pedido fue recibido exitosamente. Aquí tienes el resumen:</p>

      <div style="background:#fdf8f0;border:1px solid #f0e6d3;border-radius:12px;padding:18px 20px;margin-bottom:25px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="font-size:13px;color:#8a7968;padding:4px 0;">Pedido No.</td><td style="font-size:13px;color:#1a1a1a;font-weight:600;text-align:right;">${order_number}</td></tr>
          <tr><td style="font-size:13px;color:#8a7968;padding:4px 0;">Fecha</td><td style="font-size:13px;color:#1a1a1a;font-weight:600;text-align:right;">${order_date}</td></tr>
          <tr><td style="font-size:13px;color:#8a7968;padding:4px 0;">Estado</td>
            <td style="text-align:right;padding:4px 0;"><span style="background:#fff3cd;color:#856404;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;">⏳ PENDIENTE DE PAGO</span></td>
          </tr>
        </table>
      </div>

      <p style="font-size:11px;font-weight:700;color:#8a7968;letter-spacing:2px;margin:0 0 12px;text-transform:uppercase;">Productos</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">${itemsHtml}</table>

      <div style="background:linear-gradient(135deg,#c9a96e,#b8860b);border-radius:12px;padding:18px 20px;text-align:center;margin-bottom:25px;">
        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.8);letter-spacing:1px;">TOTAL A PAGAR</p>
        <p style="margin:6px 0 0;font-size:28px;font-weight:700;color:#fff;">$${total.toFixed(2)} USD</p>
      </div>

      <div style="background:#fff8ee;border-left:4px solid #c9a96e;border-radius:0 12px 12px 0;padding:18px 20px;margin-bottom:25px;">
        <p style="margin:0 0 5px;font-size:13px;font-weight:700;color:#1a1a1a;">Método de pago: ${payment_label}</p>
        <p style="margin:0;font-size:13px;color:#6b5b4e;line-height:1.5;">${paymentInstructions[payment_method] || "Te contactaremos con los detalles de pago."}</p>
      </div>

      <div style="text-align:center;margin-bottom:25px;">
        <p style="font-size:14px;color:#6b5b4e;margin:0 0 15px;line-height:1.5;">Contáctanos para coordinar tu pago y entrega.</p>
        <a href="https://www.instagram.com/hemerza" style="display:inline-block;background:linear-gradient(135deg,#c9a96e,#b8860b);color:#fff;text-decoration:none;padding:12px 30px;border-radius:25px;font-size:14px;font-weight:600;letter-spacing:1px;">
          Contáctanos en Instagram
        </a>
      </div>

      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:14px 18px;text-align:center;">
        <p style="margin:0;font-size:13px;color:#991b1b;line-height:1.5;">
          ⚠️ <strong>Tu pedido está pendiente de pago.</strong><br>
          Realiza el pago lo antes posible para confirmar tu pedido.
        </p>
      </div>
    </div>
    <div style="text-align:center;padding:25px 20px;">
      <p style="margin:0;font-size:12px;color:#a09080;">© ${new Date().getFullYear()} HEMERZA · Panamá</p>
      <p style="margin:8px 0 0;font-size:11px;color:#c0b0a0;">Este correo fue enviado porque realizaste un pedido en Hemerza.</p>
    </div>
  </div>
</body>
</html>`;
};

async function sendEmail(resendKey: string, to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Hemerza <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Resend error [${res.status}]: ${JSON.stringify(data)}`);
  }
  return data;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const payload: OrderEmailPayload = await req.json();
    const results: { admin?: unknown; client?: unknown } = {};

    // 1. Siempre notifica al admin
    try {
      const adminHtml = buildAdminEmail(payload);
      results.admin = await sendEmail(
        RESEND_API_KEY,
        ADMIN_EMAIL,
        `🛍️ Nuevo pedido ${payload.order_number} — ${payload.customer_name}`,
        adminHtml
      );
    } catch (err) {
      console.error("Admin email failed:", err);
    }

    // 2. Envía confirmación al cliente si tiene email
    if (payload.to_email) {
      try {
        const clientHtml = buildClientEmail(payload);
        results.client = await sendEmail(
          RESEND_API_KEY,
          payload.to_email,
          `✨ Pedido ${payload.order_number} recibido — HEMERZA`,
          clientHtml
        );
      } catch (err) {
        console.error("Client email failed:", err);
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in send-order-email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
