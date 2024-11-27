// import Image from "next/image";

import ChatInput from "./components/chat-input";

export default function Home() {
  return (
    <div className="main">
         <div className="h-[80vh] flex justify-center items-center">
          <div className="w-full mx-auto">
            <h1 className="text-3xl font-bold tracking-tighter">What type of playlist do you want today?</h1>
            <div className="mt-6">
              <ChatInput />
            </div>
          </div>
        </div>
    </div>
  );
}
