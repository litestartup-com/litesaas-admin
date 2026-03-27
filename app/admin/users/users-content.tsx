"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Mail, Ban } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { fetchWithAuth } from "@/lib/fetch-with-auth"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: string
  customerId: string
  banReason: string | null
  banExpires: string | null
  avatar: string | null
  phone?: string
  address?: string
  lastLogin?: string
  subscription?: {
    plan: string
    status: string
    expiresAt: string | null
  }
  credits?: number
}

interface UsersResponse {
  users: User[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

const banSchema = z.object({
  reason: z.string().min(1, "Ban reason is required"),
  expiresAt: z.string().optional(),
  permanent: z.boolean().optional(),
})

type BanFormValues = z.infer<typeof banSchema>

type SortField = "name" | "email" | "role" | "createdAt" | "customerId" | "status" | "banReason" | "banExpires"
type SortOrder = "asc" | "desc"

export function UsersContent() {
  const { t } = useTranslation()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState<SortField>("createdAt")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userDetails, setUserDetails] = useState<User | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [banDialogOpen, setBanDialogOpen] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  })

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const {
    register: registerBan,
    handleSubmit: handleSubmitBan,
    formState: { errors: errorsBan },
    reset: resetBanForm,
    watch: watchBan,
  } = useForm<BanFormValues>({
    resolver: zodResolver(banSchema),
    defaultValues: {
      permanent: false,
    },
  })

  const isPermanent = watchBan("permanent")

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortBy,
        sortOrder,
      })
      if (debouncedSearch) {
        params.append("search", debouncedSearch)
      }

      const response = await fetchWithAuth(`/api/users?${params}`)
      const result: { success: boolean; data: UsersResponse } = await response.json()
      
      // Handle 401 - token expired (already handled in fetchWithAuth)
      if (response.status === 401) {
        return
      }

      if (result.success) {
        setUsers(result.data.users)
        setPagination(result.data.pagination)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page, pageSize, sortBy, sortOrder, debouncedSearch])

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const handleUserClick = async (user: User) => {
    setSelectedUser(user)
    setSheetOpen(true)
    try {
      const response = await fetchWithAuth(`/api/users/${user.id}`)
      if (response.status === 401) return
      const result = await response.json()
      if (result.success) {
        setUserDetails(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error)
    }
  }

  const handleBan = async (data: BanFormValues) => {
    if (!selectedUser) return

    try {
      const response = await fetchWithAuth(`/api/users/${selectedUser.id}/ban`, {
        method: "POST",
        body: JSON.stringify({
          reason: data.reason,
          expiresAt: data.permanent ? null : data.expiresAt,
        }),
      })
      if (response.status === 401) return

      const result = await response.json()
      if (result.success) {
        setBanDialogOpen(false)
        resetBanForm()
        fetchUsers()
        if (userDetails) {
          setUserDetails({ ...userDetails, ...result.data.user })
        }
      }
    } catch (error) {
      console.error("Failed to ban user:", error)
    }
  }

  const handleUnban = async () => {
    if (!selectedUser) return

    try {
      const response = await fetchWithAuth(`/api/users/${selectedUser.id}/unban`, {
        method: "POST",
      })
      if (response.status === 401) return

      const result = await response.json()
      if (result.success) {
        fetchUsers()
        if (userDetails) {
          setUserDetails({ ...userDetails, ...result.data.user })
        }
      }
    } catch (error) {
      console.error("Failed to unban user:", error)
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field) return <ArrowUpDown className="ml-1 h-3 w-3" />
    return sortOrder === "asc" ? (
      <ArrowUpDown className="ml-1 h-3 w-3 rotate-180" />
    ) : (
      <ArrowUpDown className="ml-1 h-3 w-3" />
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('users.title')}</h1>
        <p className="text-muted-foreground">{t('users.description')}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-sm">
            <Input
              placeholder={t('users.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                <div className="flex items-center">
                  {t('users.name')}
                  <SortIcon field="name" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
                <div className="flex items-center">
                  {t('users.email')}
                  <SortIcon field="email" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("role")}>
                <div className="flex items-center">
                  {t('users.role')}
                  <SortIcon field="role" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("createdAt")}>
                <div className="flex items-center">
                  {t('users.createdAt')}
                  <SortIcon field="createdAt" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("customerId")}>
                <div className="flex items-center">
                  {t('users.customerId')}
                  <SortIcon field="customerId" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                <div className="flex items-center">
                  {t('users.status')}
                  <SortIcon field="status" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("banReason")}>
                <div className="flex items-center">
                  {t('users.banReason')}
                  <SortIcon field="banReason" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("banExpires")}>
                <div className="flex items-center">
                  {t('users.banExpires')}
                  <SortIcon field="banExpires" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  {t('common.loading')}
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  {t('users.noUsersFound')}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <button
                        onClick={() => handleUserClick(user)}
                        className="text-indigo-600 hover:text-indigo-500 font-medium"
                      >
                        {user.name}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>{user.customerId || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full",
                          user.status === "Active" ? "bg-green-500" : "bg-red-500"
                        )}
                      />
                      {user.status}
                    </div>
                  </TableCell>
                  <TableCell>{user.banReason || "-"}</TableCell>
                  <TableCell>{user.banExpires || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t('users.rowsPerPage')}</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value: string) => {
              setPageSize(Number(value))
              setPage(1)
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {t('users.page')} {pagination.page} / {pagination.totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page + 1)}
              disabled={page >= pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(pagination.totalPages)}
              disabled={page >= pagination.totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* User Details Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t('users.userDetails')}</SheetTitle>
            <SheetDescription>{t('users.viewAndManage')}</SheetDescription>
          </SheetHeader>
          {userDetails && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {getInitials(userDetails.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{userDetails.name}</h3>
                  <p className="text-muted-foreground">{userDetails.email}</p>
                </div>
              </div>

              <hr className="border-t border-gray-300 my-4" />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">{t('users.role')}</Label>
                  <p className="font-medium">{userDetails.role}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('users.status')}</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        userDetails.status === "Active" ? "bg-green-500" : "bg-red-500"
                      )}
                    />
                    <p className="font-medium">{userDetails.status}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('users.customerId')}</Label>
                  <p className="font-medium">{userDetails.customerId || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('users.createdAt')}</Label>
                  <p className="font-medium">{userDetails.createdAt}</p>
                </div>
                {userDetails.phone && (
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{userDetails.phone}</p>
                  </div>
                )}
                {userDetails.lastLogin && (
                  <div>
                    <Label className="text-muted-foreground">Last Login</Label>
                    <p className="font-medium">
                      {new Date(userDetails.lastLogin).toLocaleString()}
                    </p>
                  </div>
                )}
                {userDetails.subscription && (
                  <>
                    <div>
                      <Label className="text-muted-foreground">Subscription Plan</Label>
                      <p className="font-medium">{userDetails.subscription.plan}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Subscription Status</Label>
                      <p className="font-medium">{userDetails.subscription.status}</p>
                    </div>
                  </>
                )}
                {userDetails.credits !== undefined && (
                  <div>
                    <Label className="text-muted-foreground">Credits</Label>
                    <p className="font-medium">{userDetails.credits.toLocaleString()}</p>
                  </div>
                )}
              </div>

              {userDetails.banReason && (
                <div className="border rounded-lg p-4 space-y-2">
                  <Label className="text-muted-foreground">Ban Information</Label>
                  <div>
                    <p className="font-medium">Reason: {userDetails.banReason}</p>
                    {userDetails.banExpires && (
                      <p className="text-sm text-muted-foreground">
                        Expires: {userDetails.banExpires}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <hr className="border-t border-gray-300 my-4" />
              <div className="flex gap-2">
                {userDetails.status === "Banned" ? (
                  <Button onClick={handleUnban} variant="outline">
                    {t('users.unbanUser')}
                  </Button>
                ) : (
                  <Button onClick={() => setBanDialogOpen(true)} variant="destructive">
                    <Ban className="mr-2 h-4 w-4" />
                    {t('users.banUser')}
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Ban User Dialog */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('users.banUser')}</DialogTitle>
            <DialogDescription>
              Ban {selectedUser?.name}. Provide a reason and expiration date.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitBan(handleBan)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">{t('users.banReasonLabel')} *</Label>
              <Input
                id="reason"
                placeholder={t('users.banReasonLabel')}
                {...registerBan("reason")}
                className={cn(errorsBan.reason && "border-destructive")}
              />
              {errorsBan.reason && (
                <p className="text-sm text-destructive">{errorsBan.reason.message}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="permanent"
                {...registerBan("permanent")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="permanent" className="cursor-pointer">
                {t('users.permanentBan')}
              </Label>
            </div>
            {!isPermanent && (
              <div className="space-y-2">
                <Label htmlFor="expiresAt">{t('users.banExpiresLabel')}</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  {...registerBan("expiresAt")}
                />
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setBanDialogOpen(false)
                  resetBanForm()
                }}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" variant="destructive">
                {t('users.banUser')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
