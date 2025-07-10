
import React from "react";
import { DesktopResultsTable } from "./table/DesktopResultsTable";
import { MobileResultsCards } from "./table/MobileResultsCards";
import { BaseResultsProps } from "./table/types";

export const AggregatedResultsTable = (props: BaseResultsProps) => {
  return (
    <>
      <DesktopResultsTable {...props} />
      <MobileResultsCards {...props} />
    </>
  );
};
