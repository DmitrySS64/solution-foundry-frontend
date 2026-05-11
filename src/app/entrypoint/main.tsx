import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import {router} from "@app/routes";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";

import '@shared/i18n/config'
import '@app/styles/index.css'
import {ModalProvider} from "@widgets/modal/provider";
import {SidebarProvider} from "@widgets/sidebar/context";

const queryClient = new QueryClient()
const rootElement = document.getElementById('root')

if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)

    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools buttonPosition={'bottom-right'}/>
                <ModalProvider>
                    <SidebarProvider>
                        <RouterProvider router={router}/>
                    </SidebarProvider>
                </ModalProvider>
                <TanStackRouterDevtools router={router}/>
            </QueryClientProvider>
        </StrictMode>,
    )
}
