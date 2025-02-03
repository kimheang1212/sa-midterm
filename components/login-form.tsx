import { GalleryVerticalEnd } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Telegram settings</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Telegram Settings</h1>
           
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Bot Token</Label>
              <Input
                id="bottoken"
                type="text"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Chat ID</Label>
              <Input
                id="chatid"
                type="text"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Save
            </Button>
          </div>
        
         
        </div>
      </form>
    
    </div>
  )
}
