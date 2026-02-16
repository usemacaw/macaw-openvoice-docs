import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = join(__dirname, "..", "content", "docs");
const PUBLIC_DIR = join(__dirname, "..", "public");
const BASE_URL = "https://docs.usemacaw.io/docs";

const PROJECT_DESCRIPTION =
  "Open-source voice runtime for real-time Speech-to-Text and Text-to-Speech with OpenAI-compatible API, streaming session control, and extensible execution architecture.";

interface DocEntry {
  id: string;
  file: string;
  url: string;
}

interface SidebarSection {
  label: string;
  items: DocEntry[];
}

function docEntry(id: string): DocEntry {
  const file = id === "intro" ? "index.mdx" : `${id}.mdx`;
  const url = id === "models/index" ? `${BASE_URL}/models` : id === "intro" ? BASE_URL : `${BASE_URL}/${id}`;
  return { id, file, url };
}

// Sidebar structure mirroring meta.json navigation
const sidebar: Array<DocEntry | SidebarSection> = [
  docEntry("intro"),
  {
    label: "Getting Started",
    items: [
      docEntry("getting-started/installation"),
      docEntry("getting-started/quickstart"),
      docEntry("getting-started/configuration"),
    ],
  },
  {
    label: "Supported Models",
    items: [
      docEntry("models/index"),
      docEntry("models/stt"),
      docEntry("models/tts"),
      docEntry("models/voice-cloning"),
      docEntry("models/vad-turn-detection"),
      docEntry("models/speaker-diarization"),
      docEntry("models/emotion-recognition"),
      docEntry("models/audio-codecs"),
      docEntry("models/forced-alignment"),
    ],
  },
  {
    label: "Guides",
    items: [
      docEntry("guides/batch-transcription"),
      docEntry("guides/streaming-stt"),
      docEntry("guides/full-duplex"),
      docEntry("guides/adding-engine"),
      docEntry("guides/cli"),
    ],
  },
  {
    label: "API Reference",
    items: [
      docEntry("api-reference/rest-api"),
      docEntry("api-reference/websocket-protocol"),
      docEntry("api-reference/grpc-internal"),
    ],
  },
  {
    label: "Architecture",
    items: [
      docEntry("architecture/overview"),
      docEntry("architecture/session-manager"),
      docEntry("architecture/vad-pipeline"),
      docEntry("architecture/scheduling"),
    ],
  },
  {
    label: "Community",
    items: [
      docEntry("community/contributing"),
      docEntry("community/changelog"),
      docEntry("community/roadmap"),
    ],
  },
];

function extractFrontmatter(content: string): { title: string; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { title: "", body: content };
  }

  const frontmatter = match[1];
  const body = match[2];

  const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
  const title = titleMatch ? titleMatch[1].replace(/^['"]|['"]$/g, "") : "";

  return { title, body };
}

function extractDescription(body: string): string {
  const lines = body.split("\n");
  let foundHeading = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("#")) {
      foundHeading = true;
      continue;
    }
    // Skip Callout tags, imports, and other non-paragraph content
    if (trimmed.startsWith("<Callout") || trimmed.startsWith("</Callout") || trimmed.startsWith("import ")) continue;
    if (foundHeading || !body.includes("# ")) {
      return trimmed
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .replace(/`(.*?)`/g, "$1");
    }
  }

  return "";
}

function cleanMarkdownBody(body: string): string {
  const lines = body.split("\n");
  const cleaned: string[] = [];
  let insideCallout = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Handle <Callout> opening tag
    const calloutMatch = trimmed.match(/^<Callout\s+type="(\w+)"(?:\s+title="([^"]*)")?>/);
    if (calloutMatch) {
      insideCallout = true;
      const type = calloutMatch[1];
      const title = calloutMatch[2];
      const label = title || type.charAt(0).toUpperCase() + type.slice(1);
      cleaned.push(`> **${label}**`);
      continue;
    }

    if (trimmed === "</Callout>") {
      insideCallout = false;
      cleaned.push("");
      continue;
    }

    if (insideCallout) {
      cleaned.push(`> ${line}`);
      continue;
    }

    // Skip import statements (MDX)
    if (trimmed.startsWith("import ") && trimmed.includes(" from ")) continue;

    cleaned.push(line);
  }

  return cleaned.join("\n").trim();
}

function readDoc(entry: DocEntry): { title: string; description: string; body: string } {
  const filePath = join(DOCS_DIR, entry.file);
  const content = readFileSync(filePath, "utf-8");
  const { title, body } = extractFrontmatter(content);
  const description = extractDescription(body);
  const cleanedBody = cleanMarkdownBody(body);

  return { title, description, body: cleanedBody };
}

function isSection(item: DocEntry | SidebarSection): item is SidebarSection {
  return "items" in item;
}

// --- Generate llms.txt (index) ---

function generateIndex(): string {
  const lines: string[] = [];

  lines.push("# Macaw OpenVoice");
  lines.push("");
  lines.push(`> ${PROJECT_DESCRIPTION}`);
  lines.push("");

  for (const item of sidebar) {
    if (isSection(item)) {
      lines.push(`## ${item.label}`);
      lines.push("");
      for (const entry of item.items) {
        const { title, description } = readDoc(entry);
        lines.push(`- [${title}](${entry.url}): ${description}`);
      }
      lines.push("");
    } else {
      const { title, description } = readDoc(item);
      lines.push(`- [${title}](${item.url}): ${description}`);
      lines.push("");
    }
  }

  return lines.join("\n").trimEnd() + "\n";
}

// --- Generate llms-full.txt (full content) ---

function generateFull(): string {
  const sections: string[] = [];

  sections.push(`# Macaw OpenVoice`);
  sections.push("");
  sections.push(`> ${PROJECT_DESCRIPTION}`);

  function getAllEntries(): DocEntry[] {
    const entries: DocEntry[] = [];
    for (const item of sidebar) {
      if (isSection(item)) {
        entries.push(...item.items);
      } else {
        entries.push(item);
      }
    }
    return entries;
  }

  for (const entry of getAllEntries()) {
    const { body } = readDoc(entry);
    sections.push("\n---\n");
    sections.push(body);
  }

  return sections.join("\n").trimEnd() + "\n";
}

// --- Main ---

const indexContent = generateIndex();
const fullContent = generateFull();

writeFileSync(join(PUBLIC_DIR, "llms.txt"), indexContent);
writeFileSync(join(PUBLIC_DIR, "llms-full.txt"), fullContent);

console.log(`Generated public/llms.txt (${indexContent.length} bytes)`);
console.log(`Generated public/llms-full.txt (${fullContent.length} bytes)`);
