import React from "react";
import Masonry from "react-masonry-css";
import { FeedItem } from "./FeedItem";
import { MilkTestResult } from "@/types/milk-test";

interface FeedGridProps {
  items: MilkTestResult[];
  isAuthenticated: boolean;
  className?: string;
}

const breakpointColumns = {
  default: 3,
  1023: 2,
  639: 1,
};

export const FeedGrid = ({ items, isAuthenticated, className }: FeedGridProps) => {
  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className={className || "flex -ml-4 w-auto"}
      columnClassName="pl-4 space-y-4"
    >
      {items.map((item) => (
        <FeedItem
          key={item.id}
          item={item}
          blurred={!isAuthenticated}
          disabled={!isAuthenticated}
        />
      ))}
    </Masonry>
  );
};
