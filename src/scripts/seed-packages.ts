/**
 * Database Seeding Script for Packages
 * Run this to populate your Supabase database with sample tour packages
 * 
 * Usage: npx tsx src/scripts/seed-packages.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables");
  console.log("Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const samplePackages = [
  {
    title: "Thailand Paradise: Phuket & Bangkok",
    slug: "thailand-phuket-bangkok",
    description: "Experience the best of Thailand with pristine beaches in Phuket and vibrant city life in Bangkok. Includes island hopping, temple tours, and authentic Thai cuisine.",
    duration: "6 Days / 5 Nights",
    price: 45999,
    image_url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1920&q=80",
    highlights: [
      "Phi Phi Island day cruise with snorkeling",
      "Bangkok Grand Palace & Wat Pho temple tour",
      "Phuket beach resort stay with sea view",
      "Floating market & traditional Thai massage",
      "Airport transfers & inter-city transport"
    ],
    is_active: true
  },
  {
    title: "Magical Bali: Ubud & Seminyak",
    slug: "bali-ubud-seminyak",
    description: "Discover the enchanting island of Bali with cultural experiences in Ubud and beach relaxation in Seminyak. Perfect blend of nature, culture, and luxury.",
    duration: "5 Days / 4 Nights",
    price: 38999,
    image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80",
    highlights: [
      "Tegalalang Rice Terraces & Ubud Monkey Forest",
      "Tanah Lot sunset temple visit",
      "Traditional Balinese spa & massage",
      "Seminyak beach clubs & shopping",
      "Private villa accommodation with pool"
    ],
    is_active: true
  },
  {
    title: "Vietnam Explorer: Da Nang & Ha Long Bay",
    slug: "vietnam-danang-halong",
    description: "Explore the breathtaking landscapes of Vietnam from the beautiful beaches of Da Nang to the mystical waters of Ha Long Bay with luxury cruise experience.",
    duration: "7 Days / 6 Nights",
    price: 52999,
    image_url: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&q=80",
    highlights: [
      "Ha Long Bay overnight cruise with kayaking",
      "Marble Mountains & Golden Bridge tour",
      "Hoi An Ancient Town UNESCO heritage site",
      "Vietnamese cooking class experience",
      "Deluxe hotel & cruise cabin accommodation"
    ],
    is_active: true
  },
  {
    title: "Singapore Splendor: City & Sentosa",
    slug: "singapore-city-sentosa",
    description: "Immerse yourself in the modern marvels of Singapore with Marina Bay attractions and family-friendly fun at Sentosa Island's world-class theme parks.",
    duration: "4 Days / 3 Nights",
    price: 42999,
    image_url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1920&q=80",
    highlights: [
      "Universal Studios Singapore full day pass",
      "Gardens by the Bay & Supertree Grove",
      "Marina Bay Sands SkyPark observation deck",
      "Sentosa island cable car & beach activities",
      "Clarke Quay night cruise & dining"
    ],
    is_active: true
  },
  {
    title: "Malaysia Highlights: KL & Genting",
    slug: "malaysia-kuala-lumpur-genting",
    description: "Experience the cultural diversity and modern attractions of Malaysia with Kuala Lumpur city exploration and thrilling entertainment at Genting Highlands.",
    duration: "5 Days / 4 Nights",
    price: 35999,
    image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1920&q=80",
    highlights: [
      "Petronas Twin Towers & KL Tower visit",
      "Batu Caves & Chinatown heritage walk",
      "Genting Highlands casino & theme parks",
      "Sunway Lagoon water park experience",
      "Shopping at Bukit Bintang & KLCC"
    ],
    is_active: true
  },
  {
    title: "Grand Southeast Asia: 5 Country Tour",
    slug: "grand-southeast-asia-tour",
    description: "The ultimate Southeast Asian adventure covering Thailand, Malaysia, Singapore, Vietnam, and Bali. Perfect for travelers wanting to explore multiple destinations in one trip.",
    duration: "15 Days / 14 Nights",
    price: 125999,
    image_url: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1920&q=80",
    highlights: [
      "5 countries in one incredible journey",
      "Bangkok, Kuala Lumpur, Singapore, Hanoi, Bali",
      "Mix of culture, beaches, cities & nature",
      "All inter-country flights included",
      "Handpicked 4-star hotels throughout",
      "Comprehensive sightseeing & experiences"
    ],
    is_active: true
  }
];

async function seedPackages() {
  console.log("🌱 Starting database seeding...\n");

  try {
    // First, check if packages already exist
    const { data: existing, error: checkError } = await supabase
      .from("packages")
      .select("id, title");

    if (checkError) {
      throw new Error(`Failed to check existing packages: ${checkError.message}`);
    }

    if (existing && existing.length > 0) {
      console.log(`⚠️  Found ${existing.length} existing packages:`);
      existing.forEach((pkg) => console.log(`   - ${pkg.title}`));
      console.log("\n❓ Do you want to continue? This will add more packages.");
      console.log("   Press Ctrl+C to cancel or modify the script to delete existing data first.\n");
    }

    // Insert sample packages
    const { data, error } = await supabase
      .from("packages")
      .insert(samplePackages)
      .select();

    if (error) {
      throw new Error(`Failed to insert packages: ${error.message}`);
    }

    console.log(`✅ Successfully seeded ${data?.length || 0} packages!\n`);
    
    if (data) {
      console.log("📦 Created packages:");
      data.forEach((pkg) => {
        console.log(`   ✓ ${pkg.title} (${pkg.slug})`);
      });
    }

    console.log("\n🎉 Seeding complete! Visit your homepage to see the packages.");
    
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }
}

// Run the seeding function
seedPackages();
