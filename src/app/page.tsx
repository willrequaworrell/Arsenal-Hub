import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

import DashboardCard from "@/components/ui/custom/dashboard-card";

import newsImg from "../../public/egNewsImg.jpg"
import arsLogo from "../../public/arsenal_logo.png"
import mcLogo from "../../public/mancity_logo.png"
import newLogo from "../../public/newcastle_logo.png"

export default function Home() {

  return (
    <div className="flex flex-1 gap-x-6 min-h-0 px-[5%] py-[2%]">
      <div className="flex flex-col flex-1 gap-y-6 min-h-0 w-[61.8%]">

        <div className="flex gap-x-6 h-[38.2%]">
          <DashboardCard
            title="Performance"
          >
            <div className="flex justify-between">
              <p className="text-4xl font-bold">3-1-1</p>
              <p className="text-4xl font-bold">D/W/W/W/L</p>
              
            </div>
          </DashboardCard>
          <DashboardCard
            title="Last Result"
          >
            <div className="flex flex-col">
              <div className="flex p-1 font-bold gap-x-2">
                <Image src={arsLogo} alt="Arsenal Logo Badge" className="size-6"/>
                <p className="flex-1">Arsenal</p>
                <p className="text-xl">1</p>
              </div>
              <div className="flex p-1 font-bold gap-x-2">
                <Image src={mcLogo} alt="Manchester City Logo Badge" className="size-6"/>
                <p className="flex-1">Machester City</p>
                <p className="text-xl">1</p>
              </div>

            </div>
          </DashboardCard>

          {/* <Card className="flex-1 h-full min-h-0 px-6">
            <CardTitle className="text-md font-bold">Last Result</CardTitle>
            <CardContent className="h-full rounded-xl p-0 min-h-0">

            </CardContent>
          </Card> */}
        </div>

        <div className="h-[70%]">
          <Card className="h-full min-h-0 px-6">
            <CardTitle className="text-md font-bold">News</CardTitle>
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
      <div className="flex flex-col gap-y-6 w-[30%]">
        <DashboardCard title="Upcoming">
            <div className="flex flex-col items-center p-1">
              <div className="flex justify-around w-full">
                <div className="flex flex-col items-center font-bold">
                  <Image src={arsLogo} alt="Arsenal Logo Badge" className="size-10"/>
                  <p>Arsenal</p>
                </div>
                <p className="text-4xl">vs.</p>
                <div className="flex flex-col items-center font-bold">
                  <Image src={newLogo} alt="Newcastle Logo Badge" className="size-10"/>
                  <p>Newcastle</p>
                </div>
              </div>
              <div className="text-center">
                <p>Sun Sep 28 - 16:30</p>
                <p>St. James Park</p>
              </div>
            </div>
        </DashboardCard>
        <Card className="flex-1 h-full min-h-0 px-6">
          <CardTitle className="text-md font-bold">Standings</CardTitle>
          <CardContent className="h-full rounded-xl p-0 min-h-0">

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
