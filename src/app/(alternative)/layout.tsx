import AppLayoutTemplate from "@/src/components/shared/templates/AppLayoutTemplate";

const AlternativeLayout = ({ children }: { children: React.ReactNode }) => {
	return <AppLayoutTemplate>{children}</AppLayoutTemplate>;
};

export default AlternativeLayout;
