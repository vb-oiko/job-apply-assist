import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { NoMatch } from "./components/NoMatch";
import { trpc } from "./utils/trpc";
import { PositionCreate } from "./views/PositionCreate";
import { PositionEdit } from "./views/PositionEdit";
import { Positions } from "./views/Positions";
import { PromptCreate } from "./views/PromptCreate";
import { Prompts } from "./views/Prompts";

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:2022",
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Positions />} />
            <Route path="positions" element={<Positions />} />
            <Route path="positions/create" element={<PositionCreate />} />
            <Route path="positions/:id" element={<PositionEdit />} />
            <Route path="prompts" element={<Prompts />} />
            <Route path="prompts/create" element={<PromptCreate />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
