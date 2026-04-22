export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const origin = request.headers.get("Origin");

    if (request.method === "OPTIONS") {
      return handleOptions(origin);
    }

    try {
      if (pathname.startsWith("/admin/")) {
        const authHeader = request.headers.get("authorization") || "";
        const expected = `Bearer ${env.ADMIN_TOKEN}`;

        if (authHeader !== expected) {
          return withCors(json({ error: "Unauthorized" }, 401), origin);
        }
      }

      if (request.method === "GET" && pathname === "/articles") {
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);
        const offset = parseInt(url.searchParams.get("offset") || "0");

        const countResult = await env.DB.prepare(
          `SELECT COUNT(*) as total FROM articles WHERE status = 'published'`
        ).first();

        const articles = await env.DB.prepare(`
          SELECT
            id,
            language,
            translation_key,
            tool_slug,
            slug,
            title,
            excerpt,
            author,
            cover_image,
            seo_title,
            seo_description,
            published_at
          FROM articles
          WHERE status = 'published'
          ORDER BY datetime(published_at) DESC, id DESC
          LIMIT ?
          OFFSET ?
        `).bind(limit, offset).all();

        const headers = new Headers({
          "content-type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
          "X-Total-Count": String(countResult?.total || 0),
        });

        return new Response(JSON.stringify({
          articles: articles.results || [],
          total: countResult?.total || 0,
          limit,
          offset,
        }), { headers: withCorsHeaders(headers, origin) });
      }

      if (request.method === "GET" && pathname.startsWith("/articles/")) {
        const slug = pathname.replace("/articles/", "").trim();

        if (!slug) {
          return withCors(json({ error: "Slug is required" }, 400), origin);
        }

        const article = await env.DB.prepare(`
          SELECT
            id,
            language,
            translation_key,
            tool_slug,
            slug,
            title,
            excerpt,
            content,
            status,
            author,
            cover_image,
            seo_title,
            seo_description,
            published_at,
            updated_at
          FROM articles
          WHERE slug = ? AND status = 'published'
          LIMIT 1
        `)
          .bind(slug)
          .first();

        if (!article) {
          return withCors(json({ error: "Статья не найдена" }, 404), origin);
        }

        return new Response(JSON.stringify(article), {
          headers: withCorsHeaders(new Headers({
            "content-type": "application/json; charset=utf-8",
            "Cache-Control": "public, max-age=120, stale-while-revalidate=600",
          }), origin),
        });
      }

      if (request.method === "POST" && pathname === "/admin/articles") {
        let body;
        try {
          body = await request.json();
        } catch {
          return withCors(json({ error: "Невалидный JSON" }, 400), origin);
        }

        const language = body.language?.trim();
        const translation_key = body.translation_key?.trim();
        const tool_slug = body.tool_slug?.trim() || null;
        const slug = body.slug?.trim();
        const title = body.title?.trim();
        const excerpt = body.excerpt?.trim() || "";
        const content = body.content?.trim() || "";
        const status = body.status === "published" ? "published" : "draft";
        const author = body.author?.trim() || "";
        const cover_image = body.cover_image?.trim() || null;
        const seo_title = body.seo_title?.trim() || "";
        const seo_description = body.seo_description?.trim() || "";

        if (language !== "ru" && language !== "en") {
          return withCors(json({ error: "language must be ru or en" }, 400), origin);
        }
        if (!translation_key) {
          return withCors(json({ error: "translation_key required" }, 400), origin);
        }
        if (!slug || !title || !content) {
          return withCors(json({ error: "Required: slug, title, content" }, 400), origin);
        }

        const result = await env.DB.prepare(`
          INSERT INTO articles (
            language, translation_key, tool_slug, slug, title, excerpt, content,
            status, cover_image, author, seo_title, seo_description, published_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          language, translation_key, tool_slug, slug, title, excerpt, content,
          status, cover_image, author, seo_title, seo_description,
          status === "published" ? new Date().toISOString() : null
        ).run();

        return withCors(json({
          success: true,
          message: "Статья создана",
          article_id: result.meta?.last_row_id ?? null
        }), origin);
      }

      if (
        request.method === "PATCH" &&
        /^\/admin\/articles\/\d+$/.test(pathname)
      ) {
        let body;
        try {
          body = await request.json();
        } catch {
          return withCors(json({ error: "Невалидный JSON" }, 400), origin);
        }

        const id = pathname.split("/")[3];

        const normalizedLanguage =
          body.language === "ru" || body.language === "en" ? body.language
          : body.language === undefined ? undefined
          : null;

        if (normalizedLanguage === null) {
          return withCors(json({ error: "language must be ru or en" }, 400), origin);
        }

        const normalizedTranslationKey =
          body.translation_key === undefined
            ? undefined
            : String(body.translation_key || "").trim();

        if (body.translation_key !== undefined && !normalizedTranslationKey) {
          return withCors(json({ error: "translation_key cannot be empty" }, 400), origin);
        }

        const normalizedToolSlug =
          body.tool_slug === undefined
            ? undefined
            : String(body.tool_slug || "").trim() || null;

        const allowedFields = {
          language: normalizedLanguage,
          translation_key: normalizedTranslationKey,
          tool_slug: normalizedToolSlug,
          slug: body.slug?.trim(),
          title: body.title?.trim(),
          excerpt: body.excerpt?.trim(),
          content: body.content?.trim(),
          status: body.status === "published" || body.status === "draft" ? body.status : undefined,
          author: body.author?.trim(),
          cover_image: body.cover_image === null ? null : body.cover_image?.trim(),
          seo_title: body.seo_title?.trim(),
          seo_description: body.seo_description?.trim(),
        };

        const updates = [];
        const values = [];

        for (const [key, value] of Object.entries(allowedFields)) {
          if (value !== undefined) {
            updates.push(`${key} = ?`);
            values.push(value);
          }
        }

        if (allowedFields.status === "published") {
          updates.push(`published_at = COALESCE(published_at, ?)`);
          values.push(new Date().toISOString());
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);

        if (updates.length === 1) {
          return withCors(json({ error: "Нет полей для обновления" }, 400), origin);
        }

        values.push(id);

        const result = await env.DB.prepare(`
          UPDATE articles SET ${updates.join(", ")} WHERE id = ?
        `).bind(...values).run();

        if (!result.meta?.changes) {
          return withCors(json({ error: "Статья не найдена" }, 404), origin);
        }

        const article = await env.DB.prepare(`
          SELECT id, language, translation_key, tool_slug, slug, title,
                 excerpt, content, status, author, cover_image,
                 seo_title, seo_description, published_at, updated_at
          FROM articles WHERE id = ? LIMIT 1
        `).bind(id).first();

        return withCors(json({ success: true, message: "Статья обновлена", article }), origin);
      }

      if (
        request.method === "POST" &&
        /^\/admin\/articles\/\d+\/publish$/.test(pathname)
      ) {
        const id = pathname.split("/")[3];

        const result = await env.DB.prepare(`
          UPDATE articles
          SET status = 'published',
              published_at = COALESCE(published_at, ?),
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).bind(new Date().toISOString(), id).run();

        return withCors(json({
          success: true,
          message: "Статья опубликована",
          changes: result.meta?.changes ?? 0
        }), origin);
      }

      return withCors(json({ error: "Not found" }, 404), origin);
    } catch (error) {
      return withCors(json({ error: "Internal server error", details: String(error) }, 500), origin);
    }
  },
};

const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000", "http://localhost:3001", "http://localhost:3003",
  "http://localhost:3005", "http://localhost:5173",
  "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:3003",
  "http://127.0.0.1:3005", "http://127.0.0.1:5173",
  "https://qsen.ru", "https://www.qsen.ru",
]);

function isAllowedOrigin(origin) {
  return typeof origin === "string" && ALLOWED_ORIGINS.has(origin);
}

function withCorsHeaders(headers, origin) {
  if (isAllowedOrigin(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    const vary = headers.get("Vary");
    if (!vary) {
      headers.set("Vary", "Origin");
    } else if (!vary.split(",").map(s => s.trim()).includes("Origin")) {
      headers.set("Vary", `${vary}, Origin`);
    }
  }
  return headers;
}

function withCors(response, origin) {
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: withCorsHeaders(new Headers(response.headers), origin),
  });
}

function handleOptions(origin) {
  if (!isAllowedOrigin(origin)) {
    return new Response(null, { status: 403 });
  }
  const headers = new Headers({
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Vary": "Origin",
  });
  return new Response(null, { status: 204, headers });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}