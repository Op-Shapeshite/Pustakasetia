"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {

  // Drag Selection Logic - Use Refs for mutable state during drag to prevent closure staleness/re-renders interrupting
  const isDraggingRef = React.useRef(false);
  const dragStartRef = React.useRef<Date | undefined>(undefined);
  // Ref to block the 'click' selection if a drag occurred, preventing conflict/reset
  const shouldIgnoreSelectRef = React.useRef(false);

  const handleDayMouseDown = (day: Date, activeModifiers: any, e: React.MouseEvent) => {
    // Only allow left click
    if (e.button !== 0) return;

    if (props.mode === 'range') {
      isDraggingRef.current = true;
      dragStartRef.current = day;
      e.preventDefault(); // Prevent text selection/native drag
    }

    // Pass through if parent provided handler
    if ((props as any).onDayMouseDown) {
      (props as any).onDayMouseDown(day, activeModifiers, e);
    }
  };

  const handleDayMouseEnter = (day: Date, activeModifiers: any, e: React.MouseEvent) => {
    if (isDraggingRef.current && dragStartRef.current && props.mode === 'range' && props.onSelect) {
      // We are dragging!
      shouldIgnoreSelectRef.current = true;

      const start = dragStartRef.current;
      const range = day < start
        ? { from: day, to: start }
        : { from: start, to: day };

      // Update parent state dynamically (as dragging)
      (props.onSelect as any)(range, day, activeModifiers, e);
    }
    // Pass through
    if ((props as any).onDayMouseEnter) {
      (props as any).onDayMouseEnter(day, activeModifiers, e);
    }
  };

  const handleGlobalMouseUp = React.useCallback(() => {
    isDraggingRef.current = false;
    dragStartRef.current = undefined;

    // If we blocked select, keep it blocked briefly to swallow the subsequent 'click' event
    if (shouldIgnoreSelectRef.current) {
      setTimeout(() => {
        shouldIgnoreSelectRef.current = false;
      }, 100);
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [handleGlobalMouseUp]);

  // Intercept onSelect to block it if we just finished dragging and fix single-click behavior
  const handleOnSelect: any = (range: any, selectedDay: Date, modifiers: any, e: any) => {
    if (shouldIgnoreSelectRef.current && props.mode === 'range') {
      // Prevent the 'click' from overriding our drag selection
      return;
    }

    if ((props as any).onSelect && props.mode === 'range') {
      // Fix: If clicking the same date as the current 'from' date, keep it as single day
      // Don't set 'to' to the same date
      if (range?.from && range?.to &&
        range.from.getTime() === range.to.getTime()) {
        // Same date clicked - keep as single day selection (from only, no to)
        (props as any).onSelect({ from: range.from, to: undefined }, selectedDay, modifiers, e);
        return;
      }

      (props as any).onSelect(range, selectedDay, modifiers, e);
    } else if ((props as any).onSelect) {
      (props as any).onSelect(range, selectedDay, modifiers, e);
    }
  };

  const { onSelect, mode, onDayMouseDown, onDayMouseEnter, ...otherProps } = props as any;

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 select-none", className)} // Added select-none
      mode={mode}
      onSelect={handleOnSelect}
      onDayMouseDown={handleDayMouseDown}
      onDayMouseEnter={handleDayMouseEnter}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#fff9e6] [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100",
        ),
        day_range_start:
          "day-range-start aria-selected:bg-[#ffcc00] aria-selected:text-white",
        day_range_end:
          "day-range-end aria-selected:bg-[#ffcc00] aria-selected:text-white",
        day_selected:
          "bg-[#ffcc00] text-white hover:bg-[#ffcc00] hover:text-white focus:bg-[#ffcc00] focus:text-white",
        day_today: "bg-gray-100 text-gray-900",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-gray-500 opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-[#fff9e6] aria-selected:text-gray-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...otherProps}
    />
  );
}

export { Calendar };
