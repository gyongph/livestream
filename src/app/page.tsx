"use client";
import * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";

import { FaArrowRightToBracket } from "react-icons/fa6";

import { useViewTransition } from "use-view-transitions/react";
import { useRouter } from "next-nprogress-bar";

export default function Page() {
  const { startViewTransition } = useViewTransition();
  const router = useRouter();
  return (
    <div className="bg-gradient-to-b p-1 h-full flex flex-col from-slate-500 via-slate-50 to-slate-50 overflow-hidden rounded-md">
      <h1
        style={{
          viewTransitionName: "live-status",
        }}
        className="mx-auto w-fit font-medium text-2xl mt-12 mb-5 text-white"
      >
        LiveStream
      </h1>
      <CarouselDemo />
      <Button
        style={{
          viewTransitionName: "player",
        }}
        onClick={() => startViewTransition(() => router.push("/creator"))}
        size="lg"
        className="mt-auto vt-name-[player] mb-0 text-xl flex gap-3 data-[toggle=true]:hidden duration-500"
      >
        Start ur LiveStream <FaArrowRightToBracket />
      </Button>
    </div>
  );
}

function CarouselDemo() {
  const [api, setState] = React.useState<CarouselApi>();

  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 3000,
          pause: false,
        }),
      ]}
      className="mx-auto w-full overflow-visible"
      setApi={setState}
    >
      <CarouselPrevious />
      <CarouselNext />
      <CarouselContent className="overflow-visible">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1 transition-all">
              <Card className="">
                <CardContent className="flex aspect-[19/19] sm:aspect-[16/19] items-center justify-center p-6 w-full">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </Carousel>
  );
}
