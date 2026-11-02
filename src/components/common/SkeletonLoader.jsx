import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-brand-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden animate-pulse h-full flex flex-col">
    <div className="aspect-[4/3] bg-neutral-100 w-full"></div>
    <div className="p-5 space-y-3 flex-grow">
      <div className="h-6 bg-neutral-100 rounded-md w-3/4"></div>
      <div className="h-4 bg-neutral-100 rounded-md w-full"></div>
      <div className="h-4 bg-neutral-100 rounded-md w-1/2"></div>
      <div className="h-10 bg-neutral-100 rounded-xl w-full mt-auto pt-4"></div>
    </div>
  </div>
);

export const SkeletonCategory = () => (
  <div className="flex flex-col items-center gap-4 animate-pulse shrink-0 w-32">
    <div className="w-24 h-24 rounded-full bg-neutral-100 border border-neutral-200"></div>
    <div className="h-4 bg-neutral-100 rounded-md w-16"></div>
  </div>
);
