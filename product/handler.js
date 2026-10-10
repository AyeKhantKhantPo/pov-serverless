const REVIEW_VERSIONS = ["/review-v1", "/review-v2", "/review-v3"];

const getServiceUrl = (envKey, fallback = "") => {
  const value = process.env[envKey] || fallback;
  return value ? value.replace(/\/$/, "") : "";
};

const buildReviewUrls = () => {
  const configuredBase = getServiceUrl("REVIEW_SERVICE_URL");

  if (!configuredBase) {
    return [];
  }

  const base = configuredBase.endsWith("/review-v1") || configuredBase.endsWith("/review-v2") || configuredBase.endsWith("/review-v3")
    ? configuredBase.replace(/\/review-v[123]$/, "")
    : configuredBase;

  return REVIEW_VERSIONS.map((version) => `${base}${version}`);
};

const parseBody = async (response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return { raw: text };
  }
};

const callService = async (url) => {
  if (!url) {
    return { error: "Service URL is not configured." };
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      statusCode: response.status,
      body: await parseBody(response),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: {
        error: `Failed to call service: ${url}`,
        details: error.message,
      },
    };
  }
};

const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\"/g, "&quot;")
  .replace(/'/g, "&#039;");

const renderProductPage = (data) => {
  const reviewLabel = data.reviewEndpoint ? data.reviewEndpoint.split("/").pop() : "review";
  const reviewMessage = data.review && data.review.message ? data.review.message : "No review available";
  const ratingMessage = data.rating && data.rating.message ? data.rating.message : "No rating available";
  const detailMessage = data.detail && data.detail.message ? data.detail.message : "No detail available";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Product Page</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        background: #f5f5f5;
        color: #1f2937;
      }
      .container {
        max-width: 980px;
        margin: 40px auto;
        padding: 0 20px 40px;
      }
      .header {
        margin-bottom: 24px;
      }
      h1 {
        margin: 0 0 12px;
        font-size: 3rem;
        line-height: 1.1;
        letter-spacing: -0.04em;
      }
      .summary {
        font-size: 1.2rem;
        line-height: 1.6;
        color: #4b5563;
        margin: 0 0 20px;
        max-width: 800px;
      }
      .section {
        margin-top: 28px;
      }
      .section h2 {
        margin: 0 0 14px;
        font-size: 2rem;
      }
      .card {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 18px 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        text-align: left;
        padding: 12px 10px;
        border-bottom: 1px solid #e5e7eb;
      }
      th {
        font-size: 0.82rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: #6b7280;
      }
      .reviews {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }
      .review-item {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 16px 18px;
      }
      .stars {
        font-size: 1.4rem;
        letter-spacing: 0.08em;
        margin-bottom: 12px;
      }
      .quote {
        font-size: 1.1rem;
        line-height: 1.5;
        margin: 0 0 12px;
      }
      .small {
        color: #6b7280;
        font-size: 0.9rem;
      }
      @media (max-width: 700px) {
        .reviews {
          grid-template-columns: 1fr;
        }
        h1 {
          font-size: 2.3rem;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>The Comedy of Errors</h1>
        <p class="summary">
          Wikipedia Summary: The Comedy of Errors is one of William Shakespeare's early plays. It is his shortest and one of his most farcical comedies.
        </p>
      </div>

      <div class="section">
        <h2>Book Details</h2>
        <div class="card">
          <table>
            <thead>
              <tr>
                <th>ISBN-10</th>
                <th>Publisher</th>
                <th>Pages</th>
                <th>Type</th>
                <th>Language</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1234567890</td>
                <td>PublisherA</td>
                <td>200</td>
                <td>paperback</td>
                <td>English</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="section">
        <h2>Book Reviews</h2>
        <div class="reviews">
          <div class="review-item">
            <div class="stars">★★★★★</div>
            <p class="quote">"${escapeHtml(reviewMessage)}"</p>
            <div class="small">Review service: ${escapeHtml(reviewLabel)}</div>
          </div>

          <div class="review-item">
            <div class="stars">★★★★☆</div>
            <p class="quote">"${escapeHtml(ratingMessage)}"</p>
            <div class="small">Rating service: ${escapeHtml(ratingMessage)}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Service Output</h2>
        <div class="card">
          <div class="small"><strong>Review:</strong> ${escapeHtml(reviewMessage)}</div>
          <div class="small"><strong>Rating:</strong> ${escapeHtml(ratingMessage)}</div>
          <div class="small"><strong>Detail:</strong> ${escapeHtml(detailMessage)}</div>
        </div>
      </div>
    </div>
  </body>
</html>`;
};

exports.hello = async (event) => {
  const reviewUrls = buildReviewUrls();
  const ratingUrl = getServiceUrl("RATING_SERVICE_URL");
  const detailUrl = getServiceUrl("DETAIL_SERVICE_URL");

  if (!reviewUrls.length || !ratingUrl || !detailUrl) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
      body: `<!DOCTYPE html><html><body style="font-family:Arial;padding:40px;">Product aggregate service is configured. Set REVIEW_SERVICE_URL, RATING_SERVICE_URL, and DETAIL_SERVICE_URL before invoking this lambda.</body></html>`,
    };
  }

  const selectedReviewUrl = reviewUrls[Math.floor(Math.random() * reviewUrls.length)];

  const reviewResponse = await callService(selectedReviewUrl);
  const ratingResponse = await callService(ratingUrl);
  const detailResponse = await callService(detailUrl);

  const pageData = {
    review: reviewResponse.body,
    rating: ratingResponse.body,
    detail: detailResponse.body,
    reviewEndpoint: selectedReviewUrl,
    ratingEndpoint: ratingUrl,
    detailEndpoint: detailUrl,
  };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
    body: renderProductPage(pageData),
  };
};
