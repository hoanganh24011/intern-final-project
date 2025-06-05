import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "../services/locale";

export default getRequestConfig(async () => {
	const locale = await getUserLocale();

	const common = await import(`./locales/${locale}/common.json`);

	return {
		locale,
		messages: {
			...common,
		},
	};
});
