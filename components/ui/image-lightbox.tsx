"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageLightboxProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  unoptimized?: boolean;
}

export function ImageLightbox({
  src,
  alt,
  width,
  height,
  className,
  unoptimized,
}: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={`cursor-pointer transition-opacity hover:opacity-90 ${className}`}
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        aria-label={`Click to expand: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
          unoptimized={unoptimized}
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-2rem)] lg:max-w-[calc(100vw-2rem)] max-h-[96vh] w-auto p-0 overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>{alt}</DialogTitle>
            <DialogDescription>Expanded view of screenshot</DialogDescription>
          </VisuallyHidden>
          <div className="relative w-full h-full flex items-center justify-center bg-black/5 p-2">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="max-w-full max-h-[92vh] w-auto h-auto object-contain"
              unoptimized={unoptimized}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
