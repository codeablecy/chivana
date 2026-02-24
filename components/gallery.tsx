"use client"

import { useState } from "react"
import Image from "next/image"

const tabs = ["Fotos", "Construccion"]

const photos = [
  { src: "/images/hero.jpg", alt: "Vista aerea de la urbanizacion" },
  { src: "/images/exterior.jpg", alt: "Exterior de la vivienda" },
  { src: "/images/living-room.jpg", alt: "Salon principal" },
  { src: "/images/kitchen.jpg", alt: "Cocina moderna" },
  { src: "/images/bedroom.jpg", alt: "Dormitorio principal" },
  { src: "/images/bathroom.jpg", alt: "Bano completo" },
]

const construction = [
  { src: "/images/construction.jpg", alt: "Avance de obras" },
  { src: "/images/hero.jpg", alt: "Vista general del proyecto" },
  { src: "/images/exterior.jpg", alt: "Fachada en construccion" },
]

export function Gallery() {
  const [activeTab, setActiveTab] = useState("Fotos")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const images = activeTab === "Fotos" ? photos : construction

  return (
    <section id="galeria" className="py-16 px-4 lg:py-24 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">
            Galeria
          </p>
          <h2 className="font-serif text-2xl font-bold text-foreground lg:text-4xl text-balance">
            Conoce el Proyecto
          </h2>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
          {images.map((image) => (
            <button
              key={image.src + image.alt}
              onClick={() => setSelectedImage(image.src)}
              className="relative aspect-[4/3] overflow-hidden rounded-xl group cursor-pointer"
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-label="Imagen ampliada"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-card text-3xl hover:text-card/80 transition-colors"
            aria-label="Cerrar"
          >
            &times;
          </button>
          <div className="relative w-full max-w-4xl aspect-[16/10]">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Imagen ampliada"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  )
}
