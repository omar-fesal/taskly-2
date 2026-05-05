"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
						refetchOnWindowFocus: false,
						retry: 1,
					},
					mutations: {
						onError: (error: any) => {
							toast.error(
								error?.response?.data?.error?.message ||
									error?.data?.error?.message ||
									"Something went wrong; please try again later.",
							);
						},
						onSuccess: () => {
							toast.success("saved successfully");
						},
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
