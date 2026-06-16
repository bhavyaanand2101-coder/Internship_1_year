"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Collection {
  id: number;
  name: string;
  description: string;
  image: string;
}

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/collections')
      .then((res) => res.json())
      .then((data) => {
        setCollections(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-3xl font-bold text-black text-center">
          Our Collections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <p className="col-span-3 text-center py-12 text-gray-500">
              Loading collections...
            </p>
          ) : (
            collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    width={800}
                    height={600}
                    className="object-cover w-full h-48"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-6">
                    <h3 className="mb-2 text-xl font-bold">{collection.name}</h3>
                    <p className="text-sm leading-relaxed">{collection.description}</p>
                  </div>
                  <div className="absolute top-0 left-0 right-0 bottom-0 opacity-0 group-hover:opacity-100 bg-black/30 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      Explore Collection
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}