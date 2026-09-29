export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/orders" && request.method === "POST") {
      try {
        const order = await request.json();

        await env.DB.prepare(`
          INSERT INTO orders (
            order_id,
            created_at,
            customer_json,
            products_json,
            subtotal,
            shipping,
            total,
            transaction_id,
            payment_status,
            order_status,
            courier,
            tracking_number,
            admin_notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
          .bind(
            order.orderId,
            order.createdAt,
            JSON.stringify(order.customer),
            JSON.stringify(order.products),
            order.subtotal,
            order.shipping,
            order.total,
            order.transactionId || "",
            order.paymentStatus || "Pending Verification",
            order.orderStatus || "Pending Payment",
            "",
            "",
            ""
          )
          .run();

        return Response.json({
          success: true,
          orderId: order.orderId
        });
      } catch (error) {
        return Response.json(
          {
            success: false,
            error: error.message
          },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
