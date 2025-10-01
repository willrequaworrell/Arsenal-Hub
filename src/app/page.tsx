import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

import DashboardCard from "@/components/ui/custom/dashboard-card";

import newsImg from "../../public/egNewsImg.jpg"
import arsLogo from "../../public/arsenal_logo.png"
import mcLogo from "../../public/mancity_logo.png"
import newLogo from "../../public/newcastle_logo.png"
import livLogo from "../../public/liverpool_logo.svg"
import totLogo from "../../public/tott_logo.png"


async function getStandings() {
  const absoluteUrl = new URL('/api/standings', process.env.NEXT_PUBLIC_BASE_URL).toString();
  
  const res = await fetch(absoluteUrl, { cache: "no-store" });
  if (!res.ok) throw new Error("failed to fetch standings");
  return res.json();
}

export default async function Home() {
  const standings = await getStandings();

  return (
    <div className="flex flex-1 gap-x-6  px-[5%] py-[2%]">
      <div className="flex flex-col flex-1 gap-y-6  w-[61.8%]">

        <div className="flex gap-x-6 h-[30%]">
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
                <Image src={arsLogo} alt="Arsenal Logo Badge" className="size-6" />
                <p className="flex-1">Arsenal</p>
                <p className="text-xl">1</p>
              </div>
              <div className="flex p-1 font-bold gap-x-2">
                <Image src={mcLogo} alt="Manchester City Logo Badge" className="size-6" />
                <p className="flex-1">Machester City</p>
                <p className="text-xl">1</p>
              </div>

            </div>
          </DashboardCard>

        </div>

        <div className="h-[70%] ">
          <DashboardCard title="News">
            <div className="relative w-full h-full">
              <Image
                src={newsImg}
                alt="Arsenal News Image"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />
            </div>
          </DashboardCard>
        </div>

      </div>
      <div className="flex flex-col gap-y-6 w-[38.2%]">
        <DashboardCard title="Upcoming Match">
          <div className="flex flex-col h-full">
            <div className="flex flex-col items-center flex-1 p-1">
              <div className="relative flex justify-between w-full px-8">
                <div className="flex flex-col items-center font-bold">
                  <Image src={arsLogo} alt="Arsenal Logo Badge" className="size-16" />
                  <p>Arsenal</p>
                </div>
                <p className="absolute left-1/2 -translate-x-1/2 bottom-0 -translate-y-1/3 text-4xl font-bold">vs.</p>
                <div className="flex flex-col items-center font-bold">
                  <Image src={newLogo} alt="Newcastle Logo Badge" className="size-16" />
                  <p>Newcastle</p>
                </div>
              </div>
              <div className="text-center text-sm text-slate-600">
                <p>Sun, Sep 28 // 11:30am</p>
                <p>St. James Park</p>
              </div>
            </div>
            <div className="flex justify-around">
              <div className="flex flex-col items-center font-bold">
                <p className="text-2xl">01</p>
                <p className="text-sm text-slate-600">Days</p>
              </div>
              <div className="flex flex-col items-center font-bold">
                <p className="text-2xl">20</p>
                <p className="text-sm text-slate-600">Hours</p>
              </div>
              <div className="flex flex-col items-center font-bold">
                <p className="text-2xl">24</p>
                <p className="text-sm text-slate-600">Mins</p>
              </div>
              <div className="flex flex-col items-center font-bold">
                <p className="text-2xl">08</p>
                <p className="text-sm text-slate-600">Secs</p>
              </div>
            </div>
          </div>
        </DashboardCard>
        <DashboardCard title="Standings">
          <div>
            <h2>Standings</h2>
            <ul>
              {standings.map((r: any) => (
                <li key={r.team.id}>
                  {r.rank}. {r.team.name} — {r.points} pts
                </li>
              ))}
            </ul>
          </div>
          {/* <Table>
            <TableBody>
              <TableRow className="flex">
                <TableCell>1</TableCell>
                <TableCell><Image src={livLogo} alt="Liverpool Logo Badge" className="size-6" /></TableCell>
                <TableCell className="flex-1">Liverpool</TableCell>
                <TableCell className="font-bold">11 PTS</TableCell>
              </TableRow>
              <TableRow className="flex">
                <TableCell>2</TableCell>
                <TableCell><Image src={arsLogo} alt="Arsenal Logo Badge" className="size-6" /></TableCell>
                <TableCell className="flex-1">Arsenal</TableCell>
                <TableCell className="font-bold">10 PTS</TableCell>
              </TableRow>
              <TableRow className="flex">
                <TableCell>3</TableCell>
                <TableCell><Image src={mcLogo} alt="Manchester City Logo Badge" className="size-6" /></TableCell>
                <TableCell className="flex-1">Manchester City</TableCell>
                <TableCell className="font-bold">10 PTS</TableCell>
              </TableRow>
              <TableRow className="flex">
                <TableCell>4</TableCell>
                <TableCell><Image src={newLogo} alt="Newcastle Logo Badge" className="size-6" /></TableCell>
                <TableCell className="flex-1">Newcastle</TableCell>
                <TableCell className="font-bold">9 PTS</TableCell>
              </TableRow>
              <TableRow className="flex">
                <TableCell>5</TableCell>
                <TableCell><Image src={totLogo} alt="Tottenham Logo Badge" className="size-6" /></TableCell>
                <TableCell className="flex-1">Tottenham</TableCell>
                <TableCell className="font-bold">7 PTS</TableCell>
              </TableRow>
            </TableBody>
          </Table> */}
        </DashboardCard>
      </div>
    </div>
  );
}
