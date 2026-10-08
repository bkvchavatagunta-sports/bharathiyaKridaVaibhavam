"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useEffect } from "react";

export default function PrintButton() {
  return (
    <Button 
      size="lg" 
      className="h-14 px-8 text-lg font-black shadow-lg bg-blue-600 hover:bg-blue-700" 
      onClick={() => window.print()}
    >
      <Download className="w-5 h-5 mr-2" /> Download as PDF / Print
    </Button>
  );
}
