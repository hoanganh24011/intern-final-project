"use client";

import Sidebar, { SidebarMenu } from "@/src/components/shared/organisms/Sidebar";

export interface AppLayoutTemplateProps {
	children: React.ReactNode;
}

/**
 * App Layout Template Component
 * @Props AppLayoutTemplateProps
 */
const AppLayoutTemplate = ({ children }: AppLayoutTemplateProps) => {
	const menu: SidebarMenu[] = [
		{
			groupName: "sidebar.dashboard",
			groups: [
				{
					icon: "CircleGauge",
					id: "dashboard",
					groupId: "dashboard",
					label: "sidebar.dashboard",
					href: "/dashboard",
				},
				{
					icon: "ChartNoAxesColumn",
					id: "statistics",
					groupId: "statistics",
					label: "sidebar.statistics",
					href: "/report",
				},
			],
		},
		{
			groupName: "sidebar.operation",
			groups: [
				{
					icon: "UserRound",
					id: "customers",
					groupId: "customers",
					label: "sidebar.customers",
					href: "/lead",
				},
				{
					icon: "SendHorizontal",
					id: "send_manual",
					groupId: "send_manual",
					label: "sidebar.send_manual",
					href: "/manual",
				},
				{
					icon: "Rocket",
					id: "campaign",
					groupId: "campaign",
					label: "sidebar.campaigns",
					href: "/campaign",
				},
			],
		},
		{
			groupName: "sidebar.history",
			groups: [
				{
					icon: "ChartNoAxesColumnIncreasing",
					id: "sending_history",
					groupId: "sending_history",
					label: "sidebar.sending_history",
					href: "/sending-history",
				},
				{
					icon: "FileDown",
					id: "export_management",
					groupId: "export_management",
					label: "sidebar.export_management",
					href: "/export-management",
				},
				{
					icon: "SquareUserRound",
					id: "user_history",
					groupId: "user_history",
					label: "sidebar.user_history",
				},
			],
		},
		{
			groupName: "sidebar.more",
			groups: [
				{
					icon: "Settings",
					id: "setting",
					groupId: "setting",
					label: "sidebar.setting",
					subGroups: [
						{
							id: "service-configuration",
							groupId: "setting",
							label: "sidebar.service_configuration",
							href: "/setting/service-configuration",
						},
						{
							id: "script",
							groupId: "setting",
							label: "sidebar.script",
						},
						{
							id: "brand_template",
							groupId: "setting",
							label: "sidebar.brand_template",
							href: "/template-brandname",
						},
					],
				},
			],
		},
	];

	return (
		<div className="flex h-[100vh] overflow-hidden">
			{/* Sidebar */}
			<Sidebar variant="v2" menu={menu} />

			{/* Content area */}
			<div className="relative flex h-full w-full flex-col overflow-hidden">
				<main className="h-full grow [&>*:first-child]:scroll-mt-16">
					<div className="relative h-full w-full animate-[app-template-animate_300ms_ease-in-out] pl-1 lg:pl-2">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
};

export default AppLayoutTemplate;
