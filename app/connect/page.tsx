// import Image from "next/image";
'use client';
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="main">
         <div className="h-[80vh] flex justify-center items-center">
          <div className="w-full mx-auto">
            <h1 className="text-3xl font-bold tracking-tighter">Connect with your music preferrences</h1>
            <div className="mt-6">
                <div className="mb-2"><Button className="bg-green-700 hover:bg-green-800" onClick={
                    () => {
                        router.push("/api/connect/spotify")
                    }
                }>Continue with Spotify</Button></div>
                <div className="mb-2"><Button className="bg-rose-600 hover:bg-rose-700">Continue with Apple Music</Button></div>
            </div>
          </div>
        </div>
    </div>
  );
}
