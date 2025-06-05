"use client";

import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { SearchParams, SelectOption } from "@type/common.type";
import clsx from "clsx";
import { format, formatISO } from "date-fns";
import * as LucideIcons from "lucide-react";
import { useTranslations } from "next-intl";
import {
	ChangeEvent,
	ChangeEventHandler,
	KeyboardEvent,
	MouseEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { DateRange } from "react-day-picker";
import { Calendar, Icon } from "../atoms";

export type FilterType =
	| "text"
	| "select"
	| "multiple"
	| "date"
	| "number"
	| "range-number"
	| "address";

export interface FilterItemConfig {
	errorMessage?: {
		title: string;
		message: string;
	};
	icon: keyof typeof LucideIcons;
	keyStart?: string;
	keyEnd?: string;
	name: string;
	options?: SelectOption[];
	type: FilterType;
	validPattern?: RegExp;
	isLoading?: boolean;
	disabled?: boolean;
	format?: string;
	loadMore?: boolean;
	noTranslate?: boolean;
	onChange?: (value: number | string) => void;
	onDebounceFilter?: (param: SearchParams) => void;
}

export interface FilterProps {
	className?: string;
	filters: Record<string, FilterItemConfig>;
	param: Record<string, any>;
	onFilter: () => void;
	onParamChange: (value: Record<string, any>) => void;
}

/**
 * Render Search Input
 * @param open boolean
 * @param value FilterItemConfig
 */
const RenderFilterSelect = (
	param: Record<string, any>,
	value: FilterItemConfig,
	handleSingleFilterChange: (key: string, value: string) => ChangeEventHandler<HTMLInputElement>,
	handleMultiFIlterChange: (key: string, value: string) => ChangeEventHandler<HTMLInputElement>,
	key: string = "",
	open: boolean = false
) => {
	const t = useTranslations();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [searchParams, setSearchParams] = useState<SearchParams>({
		searchOffset: 0,
		limit: 0,
		key: "",
	});

	/**
	 * Handle debounce filter
	 * @param event ChangeEvent<HTMLInputElement>
	 */
	const handleDebounceFilter = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const target = event.target;
			const { value: dataSearch } = target;
			const newParams: SearchParams = {
				...searchParams,
				key: dataSearch,
				searchOffset: 0,
			};

			setSearchParams(newParams);
			value.onDebounceFilter && value.onDebounceFilter(newParams);
		},
		[value.onDebounceFilter]
	);

	/**
	 * Handle load more
	 */
	const handleLoadMore = useCallback(() => {
		const newParams: SearchParams = {
			...searchParams,
			searchOffset: searchParams.searchOffset + 10,
		};
		setSearchParams(newParams);
		value.onDebounceFilter && value.onDebounceFilter(newParams);
	}, [value.onDebounceFilter, searchParams]);

	// Update loading state
	useEffect(() => {
		if (!value.options) return;
		if (searchParams.searchOffset >= value.options?.length) {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [value.options, searchParams.searchOffset]);

	// Update loading state when open
	useEffect(() => {
		if (open && value.onDebounceFilter) {
			value.onDebounceFilter(searchParams);
			if (!value.options) return;
			if (searchParams.searchOffset >= value.options?.length) {
				setIsLoading(true);
			} else {
				setIsLoading(false);
			}
		}
	}, [open]);

	return (
		<>
			{/* Area: Search Input */}
			{value.onDebounceFilter && (
				<div className="relative px-3 pb-2">
					{/* Area: Input  */}
					<input
						id={key}
						name={key}
						key={key}
						type="text"
						autoComplete="off"
						placeholder="Search..."
						className="form-input h-8 w-full pr-9 text-base"
						onChange={handleDebounceFilter}
					/>

					{/* Icon end placement */}
					<div className="pointer-events-none absolute inset-0 left-auto ml-3 flex items-center">
						{value.isLoading ? (
							<div className="mr-2">
								<LucideIcons.Loader className="shrink-0 animate-spin" size={20} />
							</div>
						) : null}
					</div>
				</div>
			)}

			{/* Area: Filter select */}
			{value.type === "select" && value.options && (
				<ul className="scrollbar-thin max-h-60 overflow-auto">
					{value.options.length ? (
						value.options.map((option, optionIndex) => (
							<li key={`${option.value}-${optionIndex}`} className="px-3 py-1">
								<label className="flex items-center">
									<input
										type="radio"
										className="form-radio"
										name={key}
										checked={param[key] === option.value}
										onChange={handleSingleFilterChange(key, option.value)}
									/>
									<span className="ml-2 text-sm font-medium">
										{option.noTranslate ? option.label : t(option.label)}
									</span>
								</label>
							</li>
						))
					) : (
						<li className="mt-2 text-center text-sm">{t("filter_component.no_data")}</li>
					)}
				</ul>
			)}

			{/* Area: Filter Multi */}
			{value.type === "multiple" && value.options && (
				<ul className="scrollbar-thin max-h-60 overflow-auto">
					{value.options.length ? (
						value.options.map((option, optionIndex) => (
							<li key={`${option.value}-${optionIndex}`} className="px-3 py-1">
								<label className="flex items-center">
									<input
										type="checkbox"
										className="form-checkbox"
										checked={(param[key] || []).includes(option.value)}
										onChange={handleMultiFIlterChange(key, option.value)}
									/>
									<span className="ml-2 text-sm font-medium">
										{option.noTranslate ? option.label : t(option.label)}
									</span>
								</label>
							</li>
						))
					) : (
						<li className="mt-2 text-center text-sm">{t("filter_component.no_data")}</li>
					)}
				</ul>
			)}

			{/* Area: Load More Button */}
			{value.onDebounceFilter && (
				<div className="flex items-center justify-center">
					{value.loadMore &&
						(isLoading ? (
							<LucideIcons.Loader className="shrink-0 animate-spin" size={20} />
						) : (
							<button
								onClick={handleLoadMore}
								className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500"
							>
								{t("filter_component.load_more")}
							</button>
						))}
				</div>
			)}
		</>
	);
};

/**
 * Filter Component
 * @props FilterProps
 */
const Filter = ({ className, filters, param, onFilter, onParamChange }: FilterProps) => {
	const t = useTranslations();

	// Get selected option
	const getSelectedOptions = useMemo(
		() => (item: string, key: string) => {
			return filters[key].options?.find((option) => option.value === item);
		},
		[]
	);

	/**
	 * Get label
	 * @param key string
	 * @param type FilterType
	 */
	const getLabel = useMemo(
		() => (key: string, type: FilterType) => {
			let value = param[key];
			const keyStart = filters[key]?.keyStart ?? "";
			const keyEnd = filters[key]?.keyEnd ?? "";
			if (type === "date") {
				const startDate = param[keyStart] && format(new Date(param[keyStart]), "dd/MM/yyyy");
				const endDate = param[keyEnd] && format(new Date(param[keyEnd]), "dd/MM/yyyy");
				value = `${startDate}-${endDate}`;
			} else if (type === "range-number") {
				value = `${param[keyStart]}-${param[keyEnd]}`;
			} else if (type === "multiple") {
				let selectedList = (value || []).split(",") as string[];
				selectedList = selectedList.map((item) => {
					const selectedOption = getSelectedOptions(item, key);
					if (!selectedOption) return "";
					return selectedOption.noTranslate ? selectedOption.label : t(selectedOption.label);
				});
				value = selectedList.join(", ");
			} else if (type === "select") {
				const selectedOption = filters[key].options?.find((item) => item.value === value);
				if (selectedOption) {
					value = selectedOption.noTranslate ? selectedOption.label : t(selectedOption.label);
				} else {
					value = "";
				}
			}

			return value;
		},
		[param, getSelectedOptions]
	);

	/**
	 * Handle Input Filter change (Filter type `text` | `number` | `range-number`)
	 * @param key string
	 * @param event ChangeEvent
	 */
	const handleChangeFilter = useCallback(
		(key: string) => (event: ChangeEvent) => {
			const target = event.target as HTMLInputElement;
			if (!target) return;
			const value = target.value;
			const newParam = {
				...param,
				[key]: value,
			};
			onParamChange(newParam);
		},
		[param, onParamChange]
	);

	/**
	 * Handle Multi Filter change
	 * @param key string
	 * @param value string
	 * @param event ChangeEvent<HTMLInputElement>
	 */
	const handleMultiFilterChange = useCallback(
		(key: string, value: string) => (event: ChangeEvent<HTMLInputElement>) => {
			let newValue: string[] = [];
			const target = event.target;
			const listParam = param[key] ? param[key].split(",") : [];
			const addNewValue = [...listParam, value];
			const removeExistValue = listParam.filter((item: string) => item !== value);
			if (!target) return;
			newValue = target.checked ? addNewValue : removeExistValue;
			const newParam = {
				...param,
				[key]: newValue.join(","),
			};

			onParamChange(newParam);
		},
		[param, onParamChange]
	);

	/**
	 * Handle Single Filter change
	 * @param key string
	 * @param value string
	 * @param event ChangeEvent
	 */
	const handleSingleFilterChange = useCallback(
		(key: string, value: string) => (event: ChangeEvent) => {
			const target = event.target as HTMLInputElement;
			if (!target?.checked) return;
			const newParam = {
				...param,
				[key]: value,
			};
			onParamChange(newParam);
		},
		[param, onParamChange]
	);

	/**
	 * Handle Date Filter change
	 * @param key string
	 * @param date DateRange
	 */
	const handleDateFilterChange = useCallback(
		(key: string) => (data?: DateRange) => {
			if (!data) return;
			let newParam: Record<string, any>;
			if (!data.from || !data.to) {
				newParam = Object.entries(param).filter(([keyParam, _]) => keyParam !== key);
			} else {
				newParam = {
					...param,
					[`${filters[key].keyStart}`]: formatISO(data.from, { representation: "complete" }),
					[`${filters[key].keyEnd}`]: formatISO(new Date(data.to).setHours(23, 59, 59, 999), {
						representation: "complete",
					}),
				};
			}

			onParamChange(newParam);
		},
		[param, onParamChange]
	);

	/**
	 * Handle run Filter
	 * @param close void
	 */
	const handleFilterData = useCallback(
		(close: () => void) => () => {
			onFilter && onFilter();
			close();
		},
		[onFilter]
	);

	/**
	 * Handle clear data filter
	 * @param key string
	 * @param type FilterType
	 */
	const handleClearDataFilter = useCallback(
		(key: string, type: FilterType) => (event: MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation();
			let newParam = { ...param };

			if (type === "date" || type === "range-number") {
				const keyStart = filters[key]?.keyStart ?? "";
				const keyEnd = filters[key]?.keyEnd ?? "";
				newParam = {
					...newParam,
					[keyStart]: "",
					[keyEnd]: "",
				};
			} else {
				newParam = {
					...newParam,
					[key]: "",
				};
			}

			// Remove empty/null/undefined param
			newParam = Object.fromEntries(Object.entries(newParam).filter(([_key, value]) => value));
			onParamChange(newParam);
			onFilter && onFilter();
		},
		[param, onFilter, onParamChange]
	);

	/**
	 * Handle Keydown for run Filter
	 * @param close () => void
	 * @param event KeyboardEvent<HTMLInputElement>
	 */
	const handleKeydownFilter = useCallback(
		(close: () => void) => (event: KeyboardEvent<HTMLInputElement>) => {
			if (event.key === "Enter") {
				onFilter && onFilter();
				close();
			}
		},
		[onFilter]
	);

	return (
		<div className={clsx(className, "flex flex-wrap gap-2.5", {})}>
			{Object.entries(filters).map(([key, value], index) => (
				<div id={key} key={`${key}-${index}`} className="relative w-fit">
					<Popover className="relative inline-flex">
						<PopoverButton
							as="div"
							disabled={value.disabled}
							className="btn h-8 whitespace-nowrap rounded-md border border-gray-200 bg-white px-2 py-1 text-sm shadow hover:border-gray-300 hover:text-gray-800 hover:brightness-105 focus-visible:outline-0 active:scale-x-95 active:scale-y-95 active:brightness-90 disabled:bg-surface-300 dark:border-surface-400/30 dark:bg-surface-300/5 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-100"
						>
							<div className="flex items-center gap-1">
								<Icon size={14} name={value.icon} />
								{value.noTranslate ? value.name : t(value.name)}
							</div>

							<span className="text-sm italic text-primary-500">
								{param[key] ||
								param[`${filters[key].keyStart}`] ||
								param[`${filters[key].keyEnd}`] ? (
									<span className="inline-flex items-center gap-1">
										{getLabel(key, value.type) && (
											<>
												<span>: {getLabel(key, value.type)}</span>
												{!value.disabled && (
													<button onClick={handleClearDataFilter(key, value.type)}>
														<LucideIcons.CircleXIcon
															size={14}
															aria-label="Clear filter"
															stroke="white"
															className="fill-primary-500 dark:stroke-gray-700/60"
														/>
													</button>
												)}
											</>
										)}
									</span>
								) : (
									""
								)}
							</span>
						</PopoverButton>
						<Transition
							as="div"
							className="absolute left-0 right-auto top-full z-50 mt-1 min-w-[14rem] origin-top-right overflow-hidden rounded-lg border border-gray-200 bg-white pt-1.5 shadow-lg dark:border-surface-400/30 dark:bg-gray-800"
							enter="transition ease-out duration-200 transform"
							enterFrom="opacity-0 -translate-y-2"
							enterTo="opacity-100 translate-y-0"
							leave="transition ease-out duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<PopoverPanel>
								{({ open, close }) => (
									<>
										{/* Area: Filter Label */}
										<div className="px-3 pb-2 pt-1.5 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">
											{value.noTranslate ? value.name : t(value.name)}
										</div>

										{/* Search Input */}
										{RenderFilterSelect(
											param,
											value,
											handleSingleFilterChange,
											handleMultiFilterChange,
											key,
											open
										)}

										{/* Area: Type Filter Text */}
										{value.type === "text" && (
											<div className="flex justify-center px-3 py-2">
												<input
													type="text"
													disabled={value.disabled}
													className="form-input w-full"
													defaultValue={`${param[key] || ""}`}
													onChange={handleChangeFilter(key)}
													onKeyDown={handleKeydownFilter(close)}
												/>
											</div>
										)}

										{/* Area: Type Filter Number */}
										{value.type === "number" && (
											<div className="flex justify-center px-3 py-2">
												<input
													type="number"
													disabled={value.disabled}
													className="form-input w-full"
													defaultValue={Number(param[key] || 0)}
													onChange={handleChangeFilter(key)}
													onKeyDown={handleKeydownFilter(close)}
												/>
											</div>
										)}

										{/* Area: Type Filter Range Number */}
										{value.type === "range-number" && (
											<div className="flex items-center justify-center gap-2 px-3 py-2">
												<input
													type="number"
													name={value.keyStart}
													disabled={value.disabled}
													className="form-input w-32"
													defaultValue={Number(param[`${value.keyStart}`] || 0)}
													onChange={handleChangeFilter(`${value.keyStart}`)}
												/>

												<span>-</span>

												<input
													type="number"
													name={value.keyEnd}
													disabled={value.disabled}
													className="form-input w-32"
													defaultValue={Number(param[`${value.keyEnd}`] || 0)}
													onChange={handleChangeFilter(`${value.keyEnd}`)}
													onKeyDown={handleKeydownFilter(close)}
												/>
											</div>
										)}

										{value.type === "date" && value.keyStart && value.keyEnd && (
											<div className="">
												<Calendar
													mode="range"
													numberOfMonths={2}
													disabled={value.disabled}
													selected={{
														from: param[value.keyStart],
														to: param[value.keyEnd],
													}}
													footer={
														param[value.keyEnd] && param[value.keyStart]
															? `Selected: ${format(param[value.keyStart], "dd/MM/yyyy")}-${format(param[value.keyEnd], "dd/MM/yyyy")}`
															: "Please pick a date"
													}
													onSelect={handleDateFilterChange(key)}
												/>
											</div>
										)}

										<div className="border-t border-gray-200 bg-gray-50 px-3 py-2 dark:border-surface-400/30 dark:bg-gray-700/20">
											<ul className="flex items-center justify-between">
												<li>
													<button
														className="btn-xs min-w-20 text-nowrap border border-surface-700 bg-white px-3 text-surface-900 hover:brightness-105 active:scale-x-95 active:scale-y-95 active:brightness-90 dark:border-surface-400/30 dark:bg-surface-300/5 dark:text-white"
														onClick={handleClearDataFilter(key, value.type)}
													>
														{t("form.clear")}
													</button>
												</li>
												<li>
													<button
														type="button"
														className="btn-xs min-w-20 text-nowrap bg-secondary-500 px-3 text-white hover:brightness-105 active:scale-x-95 active:scale-y-95 active:brightness-90"
														onClick={handleFilterData(close)}
													>
														{t("form.apply")}
													</button>
												</li>
											</ul>
										</div>
									</>
								)}
							</PopoverPanel>
						</Transition>
					</Popover>
				</div>
			))}
		</div>
	);
};

export default Filter;
