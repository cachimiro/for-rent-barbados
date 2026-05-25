import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/data/properties";

interface Props {
  property: Property;
}

function formatBaths(n: number) {
  return n % 1 === 0 ? `${n}` : `${n}`;
}

export default function PropertyCard({ property }: Props) {
  const startingPrice = Math.min(...property.pricing.map((p) => p.pricePerNight));

  return (
    <Link
      href={`/accommodation/${property.slug}`}
      className="group block bg-white card-shadow overflow-hidden hover:-translate-y-1 transition-transform duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.coverImage}
          alt={property.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 bg-brand-primary text-white font-poppins text-xs uppercase tracking-label px-3 py-1">
          ${startingPrice}/night
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-roboto font-semibold text-brand-primary text-lg mb-1 leading-snug">
          {property.name}
        </h3>
        <p className="font-spinnaker text-body-muted text-sm mb-3">
          {property.location}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-lato text-body-subtle uppercase tracking-label">
          <span>{property.guests} guests</span>
          <span>{property.bedrooms} bedroom{property.bedrooms !== 1 ? "s" : ""}</span>
          <span>{property.beds} bed{property.beds !== 1 ? "s" : ""}</span>
          <span>{formatBaths(property.bathrooms)} bath{property.bathrooms !== 1 ? "s" : ""}</span>
        </div>
        <div className="mt-4 pt-4 border-t border-body-off">
          <span className="font-poppins text-xs uppercase tracking-label text-brand-primary group-hover:underline">
            Check Availability →
          </span>
        </div>
      </div>
    </Link>
  );
}
