import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, type LucideIcon, SearchIcon, Trophy } from "lucide-react"
import { VersionSwitcher } from "./profile"

export function AppSidebar() {
	interface ItemT {
		title: string
		url: string
		icon: LucideIcon
	}
	const tree: Record<string, Array<ItemT>> = {
		Depot: [{ title: "Mein Depot", url: "/", icon: Home }],
		Aktien: [{ title: "Suche", url: "/search", icon: SearchIcon }],
		Wettbewerb: [{ title: "Leaderboard", url: "/leaderboard", icon: Trophy }],
	}
	return (
		<Sidebar className="bg-sidebar">
			<SidebarHeader>
				<VersionSwitcher
					versions={["Hauptdepot"]}
					defaultVersion="Hauptdepot"
				/>
			</SidebarHeader>
			<SidebarContent>
				{Object.entries(tree).map(([label, items]) => (
					<SidebarGroup key={label}>
						<SidebarGroupLabel>{label}</SidebarGroupLabel>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter>
				<VersionSwitcher versions={["Main"]} defaultVersion="Main" />
			</SidebarFooter>
		</Sidebar>
	)
}
