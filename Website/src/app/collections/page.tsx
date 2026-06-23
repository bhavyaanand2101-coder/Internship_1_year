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
    <div className="min-h-[calc(100vh-4rem)] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-black dark:text-white">
      <div className="mb-12 text-center">
        <h1 className="text-2xl font-light uppercase tracking-widest text-black dark:text-white">
          Our Collections
        </h1>
        <p className="text-[10px] text-gray-450 dark:text-zinc-400 mt-2 uppercase tracking-widest">
          Curated Seasonal Aesthetics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
        {loading ? (
          <p className="col-span-3 text-center py-24 text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-zinc-500 animate-pulse">
            Loading collections...
          </p>
        ) : (
          collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
              className="group flex flex-col"
            >
              <div className="relative overflow-hidden aspect-[4/3] bg-zinc-100 dark:bg-zinc-900">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  width={800}
                  height={600}
                  className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="pt-4 flex flex-col items-start">
                <h3 className="text-xs font-bold uppercase tracking-widest text-black dark:text-white mb-2">
                  {collection.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                  {collection.description}
                </p>
                <span className="text-[10px] font-semibold tracking-widest uppercase text-black dark:text-white border-b border-black dark:border-white pb-0.5 mt-4 hover:opacity-75 transition-opacity duration-200">
                  Explore Collection
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}