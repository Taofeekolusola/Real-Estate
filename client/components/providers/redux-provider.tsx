// "use client"

// import type React from "react"

// import { Provider } from "react-redux"
// import { store } from "@/store"

// interface ReduxProviderProps {
//   children: React.ReactNode
// }

// export function ReduxProvider({ children }: ReduxProviderProps) {
//   return <Provider store={store}>{children}</Provider>
// }

"use client";

import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";

interface ReduxProviderProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps): JSX.Element {
  return <Provider store={store}>{children}</Provider>;
}