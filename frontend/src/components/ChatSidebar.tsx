"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const CustomSheet = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSheet = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSheet}
          className="fixed top-4 left-4 z-50"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <SheetContent
          side="left"
          className="backdrop-blur-none"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>My Chats</SheetTitle>
            <SheetDescription>
              These are all your previous chats. To see them just click on them
              and that chat will be opened.
            </SheetDescription>
          </SheetHeader>

          <div className="p-4">
            {[...Array(10)].map((_, index) => (
              <Button
                className="w-full cursor-pointer text-left justify-start"
                variant={"ghost"}
              >
                Psycholoy {index+1}: Humans of 21st
              </Button>
            ))}
          </div>

          <SheetFooter>
            <Button onClick={toggleSheet}>Close</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CustomSheet;
