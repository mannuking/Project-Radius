"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import DashboardLayout from "@/components/dashboard-layout"
import { Loader2, Save } from "lucide-react"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Smith" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john.smith@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="(555) 123-4567" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Change Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure your email notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: "New Invoice",
                  description: "Receive notifications when a new invoice is created",
                  enabled: true,
                },
                {
                  title: "Payment Received",
                  description: "Receive notifications when a payment is received",
                  enabled: true,
                },
                {
                  title: "Invoice Overdue",
                  description: "Receive notifications when an invoice becomes overdue",
                  enabled: true,
                },
                {
                  title: "Comment Added",
                  description: "Receive notifications when a comment is added to an invoice",
                  enabled: false,
                },
                {
                  title: "System Updates",
                  description: "Receive notifications about system updates and maintenance",
                  enabled: false,
                },
              ].map((notification, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">{notification.title}</div>
                    <div className="text-sm text-muted-foreground">{notification.description}</div>
                  </div>
                  <Switch defaultChecked={notification.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>In-App Notifications</CardTitle>
              <CardDescription>Configure your in-app notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: "Dashboard Alerts",
                  description: "Show alerts on the dashboard for important events",
                  enabled: true,
                },
                {
                  title: "Task Reminders",
                  description: "Show reminders for upcoming tasks and deadlines",
                  enabled: true,
                },
                {
                  title: "Collection Updates",
                  description: "Show updates on collection activities",
                  enabled: false,
                },
              ].map((notification, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">{notification.title}</div>
                    <div className="text-sm text-muted-foreground">{notification.description}</div>
                  </div>
                  <Switch defaultChecked={notification.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Roles</CardTitle>
              <CardDescription>Manage user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminRole">Admin Role Permissions</Label>
                <Textarea
                  id="adminRole"
                  defaultValue="Full access to all system features, including user management, system settings, and all financial data."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="managerRole">Manager Role Permissions</Label>
                <Textarea
                  id="managerRole"
                  defaultValue="Access to all financial data, reports, and ability to manage collectors and billers. Cannot modify system settings."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collectorRole">Collector Role Permissions</Label>
                <Textarea
                  id="collectorRole"
                  defaultValue="Access to assigned invoices, ability to update payment status, and add comments. Limited access to reports."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billerRole">Biller Role Permissions</Label>
                <Textarea
                  id="billerRole"
                  defaultValue="Ability to create and edit invoices, update customer information, and view basic reports."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Region Management</CardTitle>
              <CardDescription>Manage regions and assign collectors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="northRegion">North Region</Label>
                <Input id="northRegion" defaultValue="John Smith, Sarah Johnson" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="southRegion">South Region</Label>
                <Input id="southRegion" defaultValue="Mike Wilson, Emily Davis" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eastRegion">East Region</Label>
                <Input id="eastRegion" defaultValue="David Brown, Lisa Anderson" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="westRegion">West Region</Label>
                <Input id="westRegion" defaultValue="Robert Taylor, Jennifer White" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Customize system email templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceTemplate">Invoice Notification Template</Label>
                <Textarea
                  id="invoiceTemplate"
                  defaultValue="Dear {customer_name},\n\nA new invoice {invoice_number} has been created for your account in the amount of {invoice_amount}. The invoice is due on {due_date}.\n\nThank you for your business.\n\nRegards,\n{company_name}"
                  rows={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentTemplate">Payment Confirmation Template</Label>
                <Textarea
                  id="paymentTemplate"
                  defaultValue="Dear {customer_name},\n\nWe have received your payment of {payment_amount} for invoice {invoice_number}. Thank you for your prompt payment.\n\nRegards,\n{company_name}"
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
