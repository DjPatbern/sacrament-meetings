"use client";
export function PrintButton() { return <button className="button button-primary no-print" type="button" onClick={() => window.print()}>Print program</button>; }
