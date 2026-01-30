import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table2, ChartBar, MapPin } from "lucide-react";

type ViewType = "table" | "charts" | "map";

interface ResultsViewSwitcherProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const ResultsViewSwitcher = ({
  view,
  onViewChange,
}: ResultsViewSwitcherProps) => {
  return (
    <div className="flex justify-end mb-6">
      <Tabs
        value={view}
        onValueChange={(v) => onViewChange(v as ViewType)}
        className="w-auto"
      >
        <TabsList className="grid w-[300px] grid-cols-3 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Table2 className="w-4 h-4" />
            <span>Table</span>
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <ChartBar className="w-4 h-4" />
            <span>Chart</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Map</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
