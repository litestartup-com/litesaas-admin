import { redirect } from "next/navigation"

export default function Home() {
  // Check if user is authenticated (in real app, check token)
  // For now, redirect to login
  redirect("/login")
}
