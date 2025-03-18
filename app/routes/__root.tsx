import {
  HeadContent,
  Link,
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
  useRouteContext,
} from "@tanstack/react-router";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/tanstack-start";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Meta, Scripts, createServerFn } from "@tanstack/start";
import { QueryClient } from "@tanstack/react-query";
import * as React from "react";
import { getAuth } from "@clerk/tanstack-start/server";
import { getWebRequest } from "vinxi/http";
import { DefaultCatchBoundary } from "@/shared/ui/DefaultCatchBoundary";
import { NotFound } from "@/shared/ui/NotFound";
import appCss from "../app.css?url";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { HeroUIProvider } from "@heroui/system";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Button } from "@heroui/button";
import { ThemeProvider, useTheme } from "@/shared/theme";
import { ThemeSwitcher } from "@/features/theme-switch";
import { ruRU } from "@clerk/localizations";

const fetchClerkAuth = createServerFn({ method: "GET" }).handler(async () => {
  const auth = await getAuth(getWebRequest());
  const token = await auth.getToken({ template: "convex" });

  return {
    userId: auth.userId,
    token,
  };
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexClient: ConvexReactClient;
  convexQueryClient: ConvexQueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  beforeLoad: async (ctx) => {
    const auth = await fetchClerkAuth();
    const { userId, token } = auth;

    // During SSR only (the only time serverHttpClient exists),
    // set the Clerk auth token to make HTTP queries with.
    if (token) {
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
    }

    return {
      userId,
      token,
    };
  },
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  const context = useRouteContext({ from: Route.id });
  return (
    <ClerkProvider
      localization={ruRU}
      appearance={{
        layout: {
          socialButtonsVariant: "iconButton",
          termsPageUrl: "https://clerk.com/terms",
        },
      }}
    >
      <ConvexProviderWithClerk client={context.convexClient} useAuth={useAuth}>
        <RootDocument>
          <HeroUIProvider>
            <Outlet />
          </HeroUIProvider>
        </RootDocument>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="p-2 ml-auto flex gap-2 text-lg">
            <Link
              to="/"
              activeProps={{
                className: "font-bold",
              }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>{" "}
            <Link
              to="/convexposts"
              activeProps={{
                className: "font-bold",
              }}
            >
              Posts
            </Link>
            <Link
              to="/profile/$"
              activeProps={{
                className: "font-bold",
              }}
            >
              Profile
            </Link>
            <div className="ml-auto flex gap-2">
              <ThemeSwitcher />
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton
                  mode="modal"
                  children={<Button>Sign in</Button>}
                />
              </SignedOut>
            </div>
          </div>
          <hr />
          {children}

          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  );
}
