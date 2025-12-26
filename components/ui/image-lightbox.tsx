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
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <DialogContent
          className="max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-2rem)] lg:max-w-[calc(100vw-2rem)] max-h-[96vh] w-auto p-0 overflow-hidden border-0"
          showCloseButton={false}
        >
          <VisuallyHidden>
            <DialogTitle>{alt}</DialogTitle>
            <DialogDescription>Expanded view of screenshot</DialogDescription>
          </VisuallyHidden>

          {/* Custom close button positioned outside */}
          <Button
            onClick={() => setIsOpen(false)}
            className="absolute -top-12 right-0 h-10 w-10 rounded-full bg-background/95 hover:bg-background border border-border shadow-lg p-0 z-50"
            variant="ghost"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>

          <div className="relative w-full h-full flex items-center justify-center bg-black/5 p-2 rounded-lg">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="max-w-full max-h-[92vh] w-auto h-auto object-contain rounded-lg"
              unoptimized={unoptimized}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
