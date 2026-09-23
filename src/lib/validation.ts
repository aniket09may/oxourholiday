import { parsePhoneNumberFromString } from "libphonenumber-js";

export interface LeadInput {
  name: string;
  phone: string;
  destination: string;
}

export interface PackageInput {
  title: string;
  slug: string;
  price: number;
  regular_price: number | null;
  duration: string;
  image_url: string;
  highlights: string[];
  description: string;
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export function validateLeadInput(input: LeadInput) {
  const name = cleanText(input.name, 80);
  const destination = cleanText(input.destination, 120);
  const digits = String(input.phone ?? "").replace(/\D/g, "").slice(0, 15);
  const phone = parsePhoneNumberFromString(`+${digits}`);

  if (name.length < 2) {
    return { error: "Please enter your full name." } as const;
  }

  if (!phone?.isValid()) {
    return { error: "Please enter a valid WhatsApp number." } as const;
  }

  if (destination.length < 2) {
    return { error: "Please choose a destination." } as const;
  }

  return {
    data: {
      name,
      phone: phone.number.replace("+", ""),
      destination,
    },
  } as const;
}

function parsePrice(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? Math.round(value) : NaN;
  if (typeof value !== "string") return NaN;
  return Number.parseInt(value.replace(/[^0-9]/g, ""), 10);
}

export function validatePackageInput(input: Record<string, unknown>) {
  const title = cleanText(input.title, 120);
  const slug = cleanText(input.slug, 100).toLowerCase();
  const duration = cleanText(input.duration, 40);
  const description = cleanText(input.description, 3000);
  const price = parsePrice(input.price);
  const regularPrice = input.regular_price ? parsePrice(input.regular_price) : null;
  const highlights = (Array.isArray(input.highlights)
    ? input.highlights
    : typeof input.highlights === "string"
      ? input.highlights.split(",")
      : [])
    .map((highlight) => cleanText(highlight, 180))
    .filter(Boolean)
    .slice(0, 20);

  let imageUrl: URL;
  try {
    imageUrl = new URL(String(input.image_url ?? ""));
  } catch {
    return { error: "Please enter a valid image URL." } as const;
  }

  if (!title || !duration || !description || highlights.length === 0) {
    return { error: "Please complete all required package fields." } as const;
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: "Slug must contain lowercase letters, numbers, and hyphens only." } as const;
  }

  if (!Number.isInteger(price) || price <= 0 || price > 100_000_000) {
    return { error: "Please enter a valid package price." } as const;
  }

  if (regularPrice !== null && (!Number.isInteger(regularPrice) || regularPrice <= 0)) {
    return { error: "Please enter a valid regular price." } as const;
  }

  if (imageUrl.protocol !== "https:" && imageUrl.protocol !== "http:") {
    return { error: "Image URL must use HTTP or HTTPS." } as const;
  }

  return {
    data: {
      title,
      slug,
      price,
      regular_price: regularPrice,
      duration,
      image_url: imageUrl.toString(),
      highlights,
      description,
    } satisfies PackageInput,
  } as const;
}
