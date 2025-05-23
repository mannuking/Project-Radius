"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Bell,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  Search,
  Settings,
  Users,
  X,
  DollarSign,
  ClipboardList,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Define UserRole type since we're removing the import
type UserRole = "Admin" | "Manager" | "Collector" | "Biller";

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  // Determine user role from pathname
  const getUserRole = (): UserRole => {
    if (pathname.includes("/admin")) return "Admin"
    if (pathname.includes("/manager")) return "Manager"
    if (pathname.includes("/collector")) return "Collector"
    if (pathname.includes("/biller")) return "Biller"
    return "Admin" // Default to Admin
  }
  
  const userRole = getUserRole()
  
  // Mock user data based on role
  const userData = {
    firstName: userRole,
    lastName: "User",
    role: userRole,
    email: `${userRole.toLowerCase()}@example.com`
  }
  
  // Handle logout
  const handleLogout = () => {
    router.push("/login")
  }

  // Define routes based on user role
  const getRoutesForRole = (role?: UserRole) => {
    // Routes available to all users
    const commonRoutes = [
      {
        name: "Dashboard",
        path: role ? `/dashboard/${role.toLowerCase()}` : "/dashboard",
        icon: <Home className="h-5 w-5" />,
      },
    ]

    // Role-specific routes
    const roleRoutes = {
      Admin: [
        {
          name: "Invoices",
          path: "/invoices",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          name: "Reports",
          path: "/reports",
          icon: <BarChart3 className="h-5 w-5" />,
        },
        {
          name: "Users",
          path: "/users",
          icon: <Users className="h-5 w-5" />,
        },
        {
          name: "Settings",
          path: "/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ],
      Manager: [
        {
          name: "Invoices",
          path: "/invoices",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          name: "Reports",
          path: "/reports",
          icon: <BarChart3 className="h-5 w-5" />,
        },
        {
          name: "Users",
          path: "/users",
          icon: <Users className="h-5 w-5" />,
        },
      ],
      Collector: [
        {
          name: "Worklist",
          path: "/invoices",
          icon: <ClipboardList className="h-5 w-5" />,
        },
        {
          name: "Payment Records",
          path: "/reports",
          icon: <DollarSign className="h-5 w-5" />,
        },
      ],
      Biller: [
        {
          name: "Invoices",
          path: "/invoices",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          name: "Customers",
          path: "/users",
          icon: <Users className="h-5 w-5" />,
        },
      ]
    }

    // Common routes for all users plus role-specific routes
    return [
      ...commonRoutes,
      ...(role && roleRoutes[role] ? roleRoutes[role] : []),
      // Only add Settings for roles that don't already have it
      ...(role && roleRoutes[role] && !roleRoutes[role].some(route => route.path === "/settings") ? [{
        name: "Settings",
        path: "/settings",
        icon: <Settings className="h-5 w-5" />,
      }] : [])
    ]
  }
  
  // Get routes based on the user's role
  const routes = getRoutesForRole(userData?.role as UserRole)
  
  // Get name initials for avatar fallback
  const getInitials = () => {
    if (!userData) return "U"
    return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase()
  }

  // No need for authentication checks or redirects since we're bypassing authentication

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-white px-4 shadow-sm md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <div className="flex items-center gap-2 pb-4 pt-2">
              <CreditCard className="h-5 w-5 text-highradius-600" />
              <span className="text-lg font-bold text-highradius-800">AR Manager</span>
            </div>
            <nav className="grid gap-2 text-lg font-medium">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-highradius-50 hover:text-highradius-700",
                    pathname === route.path ? "bg-highradius-50 text-highradius-700" : "text-gray-600",
                  )}
                >
                  {route.icon}
                  {route.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-highradius-600" />
          <span className="text-lg font-bold text-highradius-800">AR Manager</span>
        </div>
        <div className="flex-1">
          {isSearchOpen ? (
            <div className="relative ml-auto flex w-full max-w-sm items-center md:ml-0">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded-md border border-input bg-background pl-8 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highradius-300 focus-visible:ring-offset-2"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 h-full rounded-l-none"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="icon" className="ml-auto md:hidden" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          )}
        </div>
        <div className="hidden md:flex">
          <Button variant="outline" size="icon" className="mr-2" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-highradius-600"></span>
        </Button>
        <Button variant="outline" size="icon">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Help</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback className="bg-highradius-100 text-highradius-700">{getInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userData.firstName} {userData.lastName}</p>
                <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
                <div className="flex items-center">
                  <span className="mr-2 font-medium">{userData.firstName} {userData.lastName}</span>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">{userData.role}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-white md:block">
          <div className="flex flex-col h-full">
            <nav className="grid gap-1 p-4 text-sm font-medium">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-highradius-50 hover:text-highradius-700 transition-colors",
                    pathname === route.path ? "bg-highradius-50 text-highradius-700 font-semibold" : "text-gray-600",
                  )}
                >
                  {route.icon}
                  {route.name}
                </Link>
              ))}
            </nav>
            <div className="mt-auto p-4 border-t">
              <div className="rounded-lg bg-highradius-50 p-4">
                <h4 className="text-sm font-medium text-highradius-800 mb-2">Need Help?</h4>
                <p className="text-xs text-gray-600 mb-3">Contact our support team for assistance with your account.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-highradius-600 border-highradius-200 hover:bg-highradius-100"
                >
                  <HelpCircle className="mr-2 h-3 w-3" />
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6 max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
