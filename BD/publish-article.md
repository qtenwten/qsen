Create and publish an article through the Worker API.

Steps:
1. Read `.local/article-publisher.env`.
2. Read `templates/article.template.json`.
3. Ask the user only for missing article content if truly necessary.
4. Generate:
   - slug
   - title
   - excerpt
   - content
   - seo_title
   - seo_description
5. Create article JSON using the template.
6. Send POST request to:
   ${ARTICLE_API_BASE_URL}/admin/articles
   with:
   Authorization: Bearer ${ARTICLE_ADMIN_TOKEN}
   Content-Type: application/json
7. If created as draft, publish it with:
   POST ${ARTICLE_API_BASE_URL}/admin/articles/{id}/publish
8. Verify:
   - GET ${ARTICLE_API_BASE_URL}/articles
   - GET ${ARTICLE_API_BASE_URL}/articles/{slug}
9. Report back with the slug and public article URL.