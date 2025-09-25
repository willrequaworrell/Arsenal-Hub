import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import Image from "next/image";

import newsImg from "../../public/egNewsImg.jpg"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function Home() {
  return (
    <div className="flex flex-1 gap-x-6 min-h-0 px-[5%] py-[2%]">
      <div className="flex flex-col flex-1 gap-y-6 min-h-0 w-[61.8%]">

        <div className="flex gap-x-6 h-[38.2%]">
          <Card className="flex-1 h-full min-h-0 px-6">
            <CardTitle className="text-xl font-bold">Current Record</CardTitle>
            <CardContent className="h-full rounded-xl p-0 min-h-0">

            </CardContent>
          </Card>
          <Card className="flex-1 h-full min-h-0 px-6">
            <CardTitle className="text-xl font-bold">Last Result</CardTitle>
            <CardContent className="h-full rounded-xl p-0 min-h-0">

            </CardContent>
          </Card>
        </div>

        <div className="h-[61.8%]">
          <Card className="h-full min-h-0 px-6">
            <CardTitle className="text-xl font-bold">News</CardTitle>
            <CardContent className="h-full min-h-0 p-0 rounded-xl overflow-hidden">
              <Carousel className="relative h-full w-full">
                <CarouselContent className="h-full min-h-0">
                  <CarouselItem className="pl-0">
                    {/* Aspect-ratio wrapper provides explicit height */}
                    <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
                      <Image
                        src={newsImg}
                        alt="Arsenal News Image"
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 60vw"
                        priority
                      />
                    </div>
                  </CarouselItem>

                  <CarouselItem className="pl-0">
                    <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
                      <Image
                        src={newsImg}
                        alt="Arsenal News Image"
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 60vw"
                      />
                    </div>
                  </CarouselItem>

                  <CarouselItem className="pl-0">
                    <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
                      <Image
                        src={newsImg}
                        alt="Arsenal News Image"
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 60vw"
                      />
                    </div>
                  </CarouselItem>
                </CarouselContent>

                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white border-none hover:bg-black/70" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white border-none hover:bg-black/70" />
              </Carousel>
            </CardContent>
          </Card>

        </div>

      </div>
      <div className="flex flex-col gap-y-6 w-[38.2%]">
        <Card className="flex-1 h-full min-h-0 px-6">
          <CardTitle className="text-xl font-bold">Upcoming Match</CardTitle>
          <CardContent className="h-full rounded-xl p-0 min-h-0">

          </CardContent>
        </Card>
        <Card className="flex-1 h-full min-h-0 px-6">
          <CardTitle className="text-xl font-bold">Standings</CardTitle>
          <CardContent className="h-full rounded-xl p-0 min-h-0">

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
