import {CircleUser, Menu, Receipt} from "lucide-react";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
	DropdownMenu,
	DropdownMenuContent, DropdownMenuItem,
	DropdownMenuLabel, DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useAuth} from "@/components/AuthProvider.tsx";
import {useState} from "react";
import {DialogChangePassword} from "@/components/DialogChangePassword.tsx";

export default function Header() {
	const {isAuthenticated, logout, hasPayoutPermission} = useAuth();
	const [isDialogChangePasswordOpen, setIsDialogChangePasswordOpen] = useState(false)
	return (
		isAuthenticated() &&
    <header
        className="sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6 bg-gradient-to-r from-red-500 to-orange-500 bg-opacity-100 z-10">
        <nav
            className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 ">
            <a href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base text-white ">
                <Receipt className="w-6 h-6"/>
            </a>
            <a href="/dashboard"
               className={`transition-colors whitespace-nowrap text-white ${window.location.pathname === '/dashboard' ? 'text-stone-900' : ''}`}>
                Dashboard
            </a>
            <a href="/tracking"
               className={`transition-colors whitespace-nowrap text-white ${window.location.pathname === '/tracking' ? 'text-stone-900' : ''}`}>
                Tracking
            </a>
            <a href="/Dispute"
               className={`transition-colors whitespace-nowrap text-white ${window.location.pathname === '/dispute' ? 'text-stone-900' : ''}`}>
                Dispute
            </a>
            <a href="/paymentgate"
               className={`transition-colors whitespace-nowrap text-white ${window.location.pathname === '/paymentgate' ? 'text-stone-900Ï' : ''}`}>
                Payment Gate
            </a>
            <a href="/managerusers"
               className={`transition-colors whitespace-nowrap text-white ${window.location.pathname === '/managerusers' ? 'text-stone-900' : ''}`}>
                Manager Users
            </a>
			    {hasPayoutPermission() && <a href="/payout"
                                       className={`transition-colors whitespace-nowrap text-white ${window.location.pathname === '/payout' ? 'text-stone-900' : ''}`}>
              Payout
          </a>}
            <a href="/refund"
               className={`transition-colors whitespace-nowrap text-white ${window.location.pathname === '/refund' ? 'text-stone-900' : ''}`}>
                Refund
            </a>
            <a href="/report"
               className={`transition-colors whitespace-nowrap text-white ${window.location.pathname === '/report' ? 'text-stone-900' : ''}`}>
                Report
            </a>
        </nav>
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5"/>
							    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium">
                    <a href="#" className="flex items-center gap-2 text-lg font-semibold">
                        <Receipt className="w-6 h-6"/>
                        <span className="sr-only">Acme Inc</span>
                    </a>
                    <a href="/dashboard" className="text-muted-foreground hover:text-foreground">
                        Dashboard
                    </a>
                    <a href="/dispute/Dispute" className="text-muted-foreground hover:text-foreground">
                        Dispute
                    </a>
                    <a href="/paymentgate" className="text-muted-foreground hover:text-foreground">
                        Payment Gate
                    </a>
                    <a href="/managerusers" className="text-muted-foreground hover:text-foreground">
                        Manage Users
                    </a>
                </nav>
            </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <CircleUser className="h-5 w-5"/>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => {
											setIsDialogChangePasswordOpen(true)
										}}>Change Password</DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogChangePassword isDialogOpen={isDialogChangePasswordOpen}
                                  setIsDialogOpen={setIsDialogChangePasswordOpen}/>
        </div>
    </header>
	);
}
