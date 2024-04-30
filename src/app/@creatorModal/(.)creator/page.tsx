"use client";
import { useRouter } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import CreatorPage from "@/modules/livestream/pages/creator.page";
export default function Page() {
  const dialogRef = useRef<ElementRef<"dialog">>(null);
  const router = useRouter();
  const [show, setShow] = useState(true);
  return (
    <Transition
      unmount
      as={"div"}
      appear={true}
      show={show}
      className={
        "w-full h-full bg-black duration-500 transition-all absolute top-0 "
      }
      enter="transition-all duration-500"
      enterFrom="translate-x-full scale-75 delay-500"
      enterTo="translate-x-0 scale-100"
      leave="transition-all duration-500"
      leaveFrom="translate-x-0 scale-100"
      leaveTo="translate-x-full scale-75"
    >
      <CreatorPage
        searchParams={{ debugMode: false }}
        onEnded={() => {
          setShow(false);
          setTimeout(() => {
            // dialogRef.current?.close();
            router.back();
          }, 1000);
        }}
      />
    </Transition>
  );
}
