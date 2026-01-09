"use client";

import { TriangleAlertIcon } from "lucide-react";
import { Button } from "./ui/button";

export function DeleteMessages() {
  return (
    <Button size="icon-sm" variant="outline" className="bg-white">
      <TriangleAlertIcon className="text-red-500" />
    </Button>
  );
}
