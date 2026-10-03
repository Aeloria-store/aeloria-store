// AELORIA admin secret deployment

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (
  url.pathname === "/api/products" &&
  request.method === "GET"
) {
  try {

    const result =
      await env.DB.prepare(`
        SELECT
          products.*,
          categories.name AS category_name,
          categories.slug AS category_slug
        FROM products
        JOIN categories
          ON products.category_id = categories.id
        WHERE products.is_visible = 1
ORDER BY products.id ASC
      `).all();

    return Response.json({
      success: true,
      products: result.results
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
      url.pathname === "/api/admin/categories" &&
      request.method === "POST"
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
        const body =
          await request.json();

        const name =
          body.name.trim();

        if (!name) {
          return Response.json(
            {
              success: false,
              error: "Category name is required"
            },
            { status: 400 }
          );
        }

        const slug =
          name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        await env.DB.prepare(`
          INSERT INTO categories (
            name,
            slug,
            created_at
          )
          VALUES (?, ?, ?)
        `)
          .bind(
            name,
            slug,
            new Date().toISOString()
          )
          .run();

        return Response.json({
          success: true,
          message: "Category created successfully"
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
  url.pathname === "/api/admin/products" &&
  request.method === "DELETE"
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

    const body =
      await request.json();

    if (!body.id) {
      return Response.json(
        {
          success: false,
          error: "Product ID is required"
        },
        { status: 400 }
      );
    }

    await env.DB.prepare(`
      DELETE FROM products
      WHERE id = ?
    `)
      .bind(body.id)
      .run();

    return Response.json({
      success: true,
      message: "Product deleted successfully"
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
  url.pathname === "/api/admin/products" &&
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

    const product =
      await request.json();

    const now =
      new Date().toISOString();

    await env.DB.prepare(`
      UPDATE products
      SET
        name = ?,
        description = ?,
        price = ?,
        sale_price = ?,
        stock = ?,
        image_url = ?,
        size = ?,
        made_to_order = ?,
        customer_note_enabled = ?,
        is_bestseller = ?,
        is_new_arrival = ?,
        is_visible = ?,
        updated_at = ?
      WHERE id = ?
    `)
      .bind(
        product.name,
        product.description || "",
        product.price,
        product.salePrice || null,
        product.stock || 0,
        product.imageUrl || "",
        product.size || "",
        product.madeToOrder ? 1 : 0,
        product.customerNoteEnabled ? 1 : 0,
        product.isBestseller ? 1 : 0,
        product.isNewArrival ? 1 : 0,
        product.isVisible ? 1 : 0,
        now,
        product.id
      )
      .run();

    return Response.json({
      success: true,
      message: "Product updated successfully"
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
  url.pathname === "/api/admin/categories" &&
  request.method === "GET"
) {
  try {
    const result = await env.DB.prepare(`
      SELECT
        id,
        name,
        slug,
        created_at
      FROM categories
      ORDER BY id ASC
    `).all();

    return Response.json({
      success: true,
      categories: result.results
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
  url.pathname === "/api/admin/products" &&
  request.method === "POST"
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
    const product =
      await request.json();

    const now =
      new Date().toISOString();

    await env.DB.prepare(`
      INSERT INTO products (
        category_id,
        name,
        description,
        price,
        sale_price,
        stock,
        image_url,
        size,
        made_to_order,
        customer_note_enabled,
        is_bestseller,
        is_new_arrival,
        is_visible,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        product.categoryId,
        product.name,
        product.description || "",
        product.price,
        product.salePrice || null,
        product.stock || 0,
        product.imageUrl || "",
        product.size || "",
        product.madeToOrder ? 1 : 0,
        product.customerNoteEnabled ? 1 : 0,
        product.isBestseller ? 1 : 0,
        product.isNewArrival ? 1 : 0,
        product.isVisible === false ? 0 : 1,
        now,
        now
      )
      .run();

    return Response.json({
      success: true,
      message: "Product created successfully"
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
  url.pathname === "/api/admin/products" &&
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
      SELECT
        products.*,
        categories.name AS category_name,
        categories.slug AS category_slug
      FROM products
      JOIN categories
        ON products.category_id = categories.id
      ORDER BY products.id ASC
    `).all();

    return Response.json({
      success: true,
      products: result.results
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
  url.pathname === "/api/admin/test-secret"
) {
  return Response.json({
    secretConfigured:
      typeof env.ADMIN_PASSWORD === "string" &&
      env.ADMIN_PASSWORD.length > 0
  });
}
    if (
  url.pathname === "/api/orders" &&
  request.method === "POST"
) {
  try {

    const order =
      await request.json();

    const products =
      order.products || [];

    if (products.length === 0) {
      return Response.json(
        {
          success: false,
          error: "Order has no products"
        },
        { status: 400 }
      );
    }

    for (const item of products) {

      const quantity =
        Number(item.quantity || 1);

      const product =
        await env.DB.prepare(`
          SELECT
            id,
            stock,
            made_to_order
          FROM products
          WHERE id = ?
          LIMIT 1
        `)
          .bind(item.id)
          .first();

      if (!product) {
        return Response.json(
          {
            success: false,
            error: `Product ${item.id} not found`
          },
          { status: 400 }
        );
      }

      if (
        product.made_to_order !== 1 &&
        product.stock < quantity
      ) {
        return Response.json(
          {
            success: false,
            error: `Not enough stock for product ${item.id}`
          },
          { status: 400 }
        );
      }
    }

    for (const item of products) {

      const quantity =
        Number(item.quantity || 1);

      const product =
        await env.DB.prepare(`
          SELECT
            id,
            stock,
            made_to_order
          FROM products
          WHERE id = ?
          LIMIT 1
        `)
          .bind(item.id)
          .first();

      if (product.stock < quantity) {
  return Response.json(
    {
      success: false,
      error: `Not enough stock for product ${item.id}`
    },
    { status: 400 }
  );
}

      await env.DB.prepare(`
        UPDATE products
        SET
          stock = stock - ?,
          updated_at = ?
        WHERE id = ?
      `)
        .bind(
          quantity,
          new Date().toISOString(),
          item.id
        )
        .run();
    }

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
        tracking_link = ?,
        admin_notes = ?
      WHERE order_id = ?
    `)
      .bind(
        body.paymentStatus || "Pending Verification",
body.orderStatus || "Pending Payment",
body.courier || "",
body.trackingNumber || "",
body.trackingLink || "",
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
        tracking_link,
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
