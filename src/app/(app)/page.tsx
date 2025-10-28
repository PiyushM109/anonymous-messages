"use client";
import * as React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

const page = () => {
  return (
    <main className="flex flex-grow flex-col items-center justify-center px-4 md:px-24 py-12  text-foreground">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-2xl md;text-5xl font-bold">
          Get conversation started anonymously
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">
          Explore Anonymous Message - Your identity remains secret
        </p>
      </section>
      <Carousel
        plugins={[Autoplay({ delay: 2000 })]}
        className="w-full max-w-xs"
      >
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardHeader>{message.title}</CardHeader>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">
                      {message.content}
                    </span>
                  </CardContent>
                  <CardFooter>{message.received}</CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
};

export default page;
