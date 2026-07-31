const Course = require("../Models/Course");

const getSitemap = async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || "https://stackadda.me";

    // Static paths
    const staticPaths = [
      "",
      "/about",
      "/contact",
      "/channels",
      "/courses",
      "/shorts",
      "/login",
      "/register"
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static paths
    staticPaths.forEach((path) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${path}</loc>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>${path === "" ? "1.0" : "0.8"}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Add dynamic courses
    const courses = await Course.find({ status: "published" }).select("slug updatedAt");
    courses.forEach((course) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/course/${course.slug}</loc>\n`;
      xml += `    <lastmod>${course.updatedAt.toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += '</urlset>';

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
};

const getRobotsTxt = (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || "https://stackadda.me";
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header("Content-Type", "text/plain");
  res.send(robotsTxt);
};

module.exports = {
  getSitemap,
  getRobotsTxt,
};
