"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
  const handleClick = () => toast.success("This button is clicked");
  return (
    <div className="p-4">
      <Button onClick={handleClick}>Click Me</Button>
    </div>
  );
}
