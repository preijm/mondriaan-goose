import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RatingSelect } from "./RatingSelect";

describe("RatingSelect", () => {
  it("renders the formatted rating", () => {
    render(<RatingSelect rating={7.5} setRating={vi.fn()} />);
    expect(screen.getByText("7.5")).toBeInTheDocument();
  });

  it("renders 0.0 for zero rating", () => {
    render(<RatingSelect rating={0} setRating={vi.fn()} />);
    expect(screen.getByText("0.0")).toBeInTheDocument();
  });

  it("shows input when badge is clicked", () => {
    render(<RatingSelect rating={8} setRating={vi.fn()} />);
    fireEvent.click(screen.getByText("8.0"));
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("updates rating on input blur", () => {
    const setRating = vi.fn();
    render(<RatingSelect rating={5} setRating={setRating} />);
    
    fireEvent.click(screen.getByText("5.0"));
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "7.3" } });
    fireEvent.blur(input);
    
    expect(setRating).toHaveBeenCalledWith(7.3);
  });

  it("clamps input to max 10", () => {
    const setRating = vi.fn();
    render(<RatingSelect rating={5} setRating={setRating} />);
    
    fireEvent.click(screen.getByText("5.0"));
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "15" } });
    fireEvent.blur(input);
    
    expect(setRating).toHaveBeenCalledWith(10);
  });

  it("sets rating to 0 on empty input blur", () => {
    const setRating = vi.fn();
    render(<RatingSelect rating={5} setRating={setRating} />);
    
    fireEvent.click(screen.getByText("5.0"));
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.blur(input);
    
    expect(setRating).toHaveBeenCalledWith(0);
  });

  it("renders the milk emoji slider thumb", () => {
    render(<RatingSelect rating={5} setRating={vi.fn()} />);
    expect(screen.getByText("🥛")).toBeInTheDocument();
  });
});
