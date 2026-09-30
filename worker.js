// AELORIA admin secret deployment

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
if (
  url.pathname === "/api/admin/test-secret"
) {
  return Response.json({
    secretConfigured:
      typeof env.ADMIN_PASSWORD === "string" &&
      env.ADMIN_PASSWORD.length > 0
  });
}
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
if (
  url.pathname === "/api/admin/orders" &&
  request.method === "GET"
) {
  const auth =
    request.headers.get("Authorization");

  if (
    auth !== `Bearer ${env.ADMIN_PASSWORD}`
  ) {
    return Response.json(
      {
        success: false,
        error: "Unauthorized"
      },
      { status: 401 }
    );
  }

  try {
    const result = await env.DB.prepare(`
      SELECT *
      FROM orders
      ORDER BY created_at DESC
    `).all();

    return Response.json({
      success: true,
      orders: result.results
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
    if (
  url.pathname === "/api/admin/orders" &&
  request.method === "PATCH"
) {
  const auth =
    request.headers.get("Authorization");

  if (
    auth !== `Bearer ${env.ADMIN_PASSWORD}`
  ) {
    return Response.json(
      {
        success: false,
        error: "Unauthorized"
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    await env.DB.prepare(`
      UPDATE orders
      SET
        payment_status = ?,
        order_status = ?,
        courier = ?,
        tracking_number = ?,
        admin_notes = ?
      WHERE order_id = ?
    `)
      .bind(
        body.paymentStatus || "Pending Verification",
        body.orderStatus || "Pending Payment",
        body.courier || "",
        body.trackingNumber || "",
        body.adminNotes || "",
        body.orderId
      )
      .run();

    return Response.json({
      success: true,
      orderId: body.orderId
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
    if (
  url.pathname === "/api/orders" &&
  request.method === "GET"
) {
  const orderId = url.searchParams.get("orderId");

  if (!orderId) {
    return Response.json(
      {
        success: false,
        error: "Order ID is required"
      },
      { status: 400 }
    );
  }

  try {
    const result = await env.DB.prepare(`
      SELECT
        order_id,
        created_at,
        customer_json,
        products_json,
        subtotal,
        shipping,
        total,
        payment_status,
        order_status,
        courier,
        tracking_number,
        admin_notes
      FROM orders
      WHERE order_id = ?
      LIMIT 1
    `)
      .bind(orderId)
      .first();

    if (!result) {
      return Response.json(
        {
          success: false,
          error: "Order not found"
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      order: result
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
