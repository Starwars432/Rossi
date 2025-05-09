import { defineStackbitConfig } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  ssgName: "custom",
  nodeVersion: "20",
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["content"],
      assetsConfig: {
        referenceType: "static",
        staticDir: "public",
        uploadDir: "uploads",
        publicPath: "/"
      },
      models: [
        {
          name: "Page",
          type: "page",
          urlPath: "/{slug}",
          filePath: "content/pages/{slug}.md",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "slug", type: "string", required: true },
            { name: "content", type: "markdown" },
            { name: "sections", type: "list", items: { type: "reference", models: ["Section"] } }
          ]
        },
        {
          name: "Section",
          type: "object",
          fields: [
            { name: "type", type: "string", required: true },
            { name: "title", type: "string" },
            { name: "content", type: "markdown" },
            { name: "image", type: "image" }
          ]
        }
      ]
    })
  ],
  presetSource: {
    type: "files",
    presetDirs: ["content"]
  },
  devCommand: "npm run dev",
  buildCommand: "npm run netlify-build",
  publishDir: "dist",
  siteMap: ({ documents }) =>
    documents
      .filter(doc => doc.modelName === "Page")
      .map(doc => ({
        stableId: doc.id,
        urlPath: `/${String(doc.fields?.slug || "")}`,
        document: doc,
        isHomePage: ["", "home"].includes(String(doc.fields?.slug || ""))
      }))
});