"use client";

import { cn } from "@/src/lib/utils";
import { apiGetTemplates } from "@api/templates";
import { InputSearch, TextArea } from "@components/shared/atoms";
import { Button, InputForm, Pagination, SelectForm } from "@components/shared/molecules";
import ConfirmModal from "@components/shared/molecules/ConfirmModal";
import { DefaultPageLayout } from "@components/shared/templates";
import { Dialog } from "@headlessui/react";
import { Brand } from "@type/api/brand.type";
import { Template } from "@type/api/template.type";
import { ColumnType, TableColumn } from "@type/component/table.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
    AlignJustify,
    ChevronDown,
    RefreshCw,
    SlidersHorizontal,
    SquarePen,
    Timer,
    Trash2,
    X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { JSX, useCallback, useEffect, useRef, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

/**
 * Get API domain and path from environment variables
 */
const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "";

/**
 * Fetch brands from API
 * @returns Promise<Brand[]>
 */
const fetchBrands = async (): Promise<Brand[]> => {
    const res = await fetch(`${API_DOMAIN}/brands`, {
        headers: { "ngrok-skip-browser-warning": "true" },
    });
    const data = await res.json();
    return data.data || [];
};

/**
 * Fetch templates by brand id
 * @param brandId string
 * @returns Promise<Template[]>
 */
const fetchTemplatesByBrand = async (brandId: string): Promise<Template[]> => {
    const res = await fetch(`${API_DOMAIN}/templates?brand_id=${brandId}`);
    const data = await res.json();
    return data.data || [];
};

/**
 * Fetch all templates
 * @returns Promise<Template[]>
 */
const fetchAllTemplatesApi = async (): Promise<Template[]> => {
    const res = await fetch(`${API_DOMAIN}/templates`);
    const data = await res.json();
    return data.data || [];
};

/**
 * Templates Page
 * @returns JSX.Element
 */
const TemplatesPage = () => {
    const t = useTranslations();

    const TEMPLATES_BREADCRUMBS = [
        { key: "templates", label: "templates_page.title", href: "/templates-demo" },
    ];

    const [brands, setBrands] = useState<Brand[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [search, setSearch] = useState("");
    const [showDatePopup, setShowDatePopup] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const datePopupRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [showOtherActions, setShowOtherActions] = useState(false);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);
    const otherActionsRef = useRef<HTMLDivElement>(null);
    const selectAllRef = useRef<HTMLInputElement>(null);
    const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addBrandId, setAddBrandId] = useState("");
    const [addName, setAddName] = useState("");
    const [addContent, setAddContent] = useState("");
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState<{ brand?: string; name?: string; content?: string }>({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [editBrandId, setEditBrandId] = useState("");
    const [editName, setEditName] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editError, setEditError] = useState<{ brand?: string; name?: string; content?: string }>(
        {}
    );
    const [editId, setEditId] = useState<string | null>(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [notify, setNotify] = useState<{
        open: boolean;
        message: string;
        type: "success" | "error";
    }>({
        open: false,
        message: "",
        type: "success",
    });

    /**
     * Fetch all templates and brands from API
     */
    const fetchAllTemplates = useCallback(async () => {
        setLoading(true);
        const brandsData = await fetchBrands();
        setBrands(brandsData);

        const response = await apiGetTemplates({});
        const allTemplates = (response?.data || []).map((tpl: any) => ({
            ...tpl,
            brandId: tpl.brandId ?? tpl.brand_id,
        }));

        const templatesWithBrand = allTemplates.map((tpl) => {
            const brand = brandsData.find((b) => b.id === tpl.brandId);
            return {
                ...tpl,
                brandId: tpl.brandId,
                brandName: brand ? brand.name : "",
            };
        });

        setTemplates(templatesWithBrand);
        setLoading(false);
    }, []);

    /**
     * Handle click outside for date popup
	 * @param showDatePopup boolean
	 * @returns void
     */
    useEffect(() => {
        if (!showDatePopup) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (datePopupRef.current && !datePopupRef.current.contains(event.target as Node)) {
                setShowDatePopup(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDatePopup]);

    /**
     * Handle click outside for other actions popup
     */
    useEffect(() => {
        if (!showOtherActions) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (otherActionsRef.current && !otherActionsRef.current.contains(event.target as Node)) {
                setShowOtherActions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showOtherActions]);

    /**
     * Set indeterminate state for select all checkbox
     */
    useEffect(() => {
        if (!selectAllRef.current) return;
        if (selectedTemplateIds.length > 0 && selectedTemplateIds.length < templates.length) {
            selectAllRef.current.indeterminate = true;
        } else {
            selectAllRef.current.indeterminate = false;
        }
    }, [selectedTemplateIds, templates.length]);

    /**
     * Handle select all templates
     * @param checked boolean
     */
    const handleSelectAll = useCallback(
        (checked: boolean) => {
            setSelectAll(checked);
            if (checked) {
                setSelectedTemplateIds(templates.map((tpl) => tpl.id));
            } else {
                setSelectedTemplateIds([]);
            }
        },
        [templates]
    );

    /**
     * Handle select single template
     * @param templateId string
     */
    const handleSelectTemplate = useCallback((templateId: string) => {
        setSelectedTemplateIds((prev) =>
            prev.includes(templateId) ? prev.filter((id) => id !== templateId) : [...prev, templateId]
        );
    }, []);

    /**
     * Filter templates by search
     */
    const filteredTemplates = templates.filter(
        (tpl) =>
            tpl.name.toLowerCase().includes(search.toLowerCase()) ||
            tpl.content.toLowerCase().includes(search.toLowerCase())
    );

    /**
     * Format date to yyyy-MM-dd (local)
     * @param date Date
     * @returns string
     */
    function formatDateOnly(date: Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    /**
     * Filter templates by date range
     */
    const filteredByDateTemplates = filteredTemplates.filter((tpl) => {
        const matchSearch =
            tpl.name.toLowerCase().includes(search.toLowerCase()) ||
            tpl.content.toLowerCase().includes(search.toLowerCase());
        const createdAtRaw = tpl.createdAt || tpl.created_at;
        const createdAt = createdAtRaw ? new Date(createdAtRaw) : null;
        if (!dateRange?.from) return matchSearch;
        if (!createdAt) return matchSearch;

        if (dateRange.from && !dateRange.to) {
            return matchSearch && formatDateOnly(createdAt) === formatDateOnly(dateRange.from);
        }
        if (dateRange.from && dateRange.to) {
            return (
                matchSearch &&
                formatDateOnly(createdAt) >= formatDateOnly(dateRange.from) &&
                formatDateOnly(createdAt) <= formatDateOnly(dateRange.to)
            );
        }
        return matchSearch;
    });

    const dateLabel =
        dateRange?.from && dateRange?.to
            ? `${format(dateRange.from, "dd/MM/yyyy")}-${format(dateRange.to, "dd/MM/yyyy")}`
            : dateRange?.from
                ? format(dateRange.from, "dd/MM/yyyy")
                : "";

    const paginatedTemplates = filteredByDateTemplates.slice((page - 1) * pageSize, page * pageSize);

    /**
     * Handle edit button click
     * @param template Template
     */
    const handleEdit = useCallback((template: Template) => {
        setEditId(template.id);
        setEditBrandId(template.brandId || "");
        setEditName(template.name);
        setEditContent(template.content);
        setEditError({});
        setShowEditModal(true);
    }, []);

    /**
     * Handle cancel edit
     */
    const handleCancelEdit = useCallback(() => {
        setEditId(null);
        setEditName("");
        setEditContent("");
    }, []);

    /**
     * Handle save edit
	 * @param editId string | null
	 * @param editBrandId string
	 * @param editName string
	 * @param editContent string
     * @returns Promise<void>
     */
    const handleSaveEdit = useCallback(async () => {
        if (!editId) return;
        const errors: { brand?: string; name?: string; content?: string } = {};
        if (!editBrandId) errors.brand = t("templates_page.brand_required");
        if (!editName.trim()) errors.name = t("templates_page.name_required");
        if (!editContent.trim()) errors.content = t("templates_page.content_required");
        setEditError(errors);
        if (Object.keys(errors).length > 0) return;

        const params = extractParamsFromContent(editContent);

        setLoading(true);
        try {
            await fetch(`${API_DOMAIN}/templates/${editId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    brand_id: editBrandId,
                    name: editName,
                    content: editContent,
                    params,
                }),
            });
            setNotify({
                open: true,
                message: t("templates_page.edit_success"),
                type: "success",
            });
        } catch {
            setNotify({
                open: true,
                message: t("templates_page.edit_error"),
                type: "error",
            });
        }
        setLoading(false);
        setShowEditModal(false);
        setEditId(null);
        setEditBrandId("");
        setEditName("");
        setEditContent("");
        setEditError({});
        await fetchAllTemplates();
    }, [editId, editBrandId, editName, editContent, fetchAllTemplates, t]);

    /**
     * Handle delete template (DELETE API)
	 * @param id string
	 * @param showConfirmDelete boolean
     * @returns Promise<void>
     */
    const handleDelete = useCallback(
        async (id: string) => {
            if (!window.confirm(t("templates_page.delete_confirmation"))) return;
            setLoading(true);
            await fetch(`${API_DOMAIN}/templates/${id}`, {
                method: "DELETE",
            });
            await fetchAllTemplates();
            setLoading(false);
        },
        [fetchAllTemplates, t]
    );

    /**
     * Handle open delete modal
	 * @param id string
     */
    const handleOpenDelete = useCallback((id: string) => {
        setDeleteId(id);
        setShowConfirmDelete(true);
    }, []);

    /**
     * Handle confirm delete
     * @returns Promise<void>
     */
    const handleConfirmDelete = useCallback(async () => {
        if (!deleteId) return;
        setShowConfirmDelete(false);
        setLoading(true);
        try {
            await fetch(`${API_DOMAIN}/templates/${deleteId}`, {
                method: "DELETE",
            });
            await fetchAllTemplates();
            setNotify({
                open: true,
                message: t("templates_page.delete_success"),
                type: "success",
            });
        } catch {
            setNotify({
                open: true,
                message: t("templates_page.delete_error"),
                type: "error",
            });
        }
        setDeleteId(null);
        setLoading(false);
    }, [deleteId, fetchAllTemplates, t]);

    /**
     * Table columns for templates
     */
    const TEMPLATE_COLUMNS: TableColumn<Template>[] = [
        {
            key: "checkbox",
            label: "",
            dataType: ColumnType.CUSTOM,
            headerClass: "w-10 text-center",
            cellClass: "text-center",
            isHidden: false,
        },
        {
            key: "index",
            label: "STT",
            dataType: ColumnType.CUSTOM,
            headerClass: "w-12 text-center",
            cellClass: "text-center",
            isHidden: false,
        },
        {
            key: "name",
            label: t("templates_page.name").toUpperCase(),
            dataType: ColumnType.TEXT,
            headerClass: "text-left",
            cellClass: "text-left",
            isHidden: false,
        },
        {
            key: "content",
            label: t("templates_page.description").toUpperCase(),
            dataType: ColumnType.TEXT,
            headerClass: "text-left",
            cellClass: "text-left",
            isHidden: false,
        },
        {
            key: "actions",
            label: "",
            dataType: ColumnType.CUSTOM,
            headerClass: "w-8 text-center",
            cellClass: "text-center",
            isHidden: false,
        },
    ];

    /**
     * Render action column for table
     * @param template Template
     * @returns JSX.Element
     */
    const renderActionColumn = (template: Template) => {
        return (
            <div className="flex justify-center">
                <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
                    onClick={() => setOpenRowMenu(openRowMenu === template.id ? null : template.id)}
                >
                    <AlignJustify size={15} />
                </button>
                {/* Area: Dropdown menu */}
                {openRowMenu === template.id && (
                    <div className="absolute right-0 z-10 mt-10 w-40 rounded-xl border border-gray-200 bg-white px-2 py-2 shadow-md">
                        <button
                            type="button"
                            className="flex w-full items-center gap-2 rounded px-3 py-2 text-blue-600 hover:bg-gray-100"
                            onClick={() => {
                                handleEdit(template);
                                setOpenRowMenu(null);
                            }}
                        >
                            <SquarePen size={15} />
                            <span className="font-medium">Sửa</span>
                        </button>
                        <button
                            type="button"
                            className="flex w-full items-center gap-2 rounded px-3 py-2 text-red-600 hover:bg-gray-100"
                            onClick={() => {
                                handleOpenDelete(template.id);
                                setOpenRowMenu(null);
                            }}
                        >
                            <Trash2 size={15} />
                            <span className="font-medium">Xóa</span>
                        </button>
                    </div>
                )}
            </div>
        );
    };

    /**
     * Render table rows
     * @returns JSX.Element[]
     */
    const renderRows = () => {
        let rows: JSX.Element[] = [];
        let idx = (page - 1) * pageSize + 1;
        for (const template of paginatedTemplates) {
            const isChecked = selectedTemplateIds.includes(template.id);
            rows.push(
                <tr
                    key={template.id}
                    className={`border-b last:border-b-0 ${isChecked ? "bg-blue-200" : ""} transition hover:bg-blue-50`}
                >
                    <td className="px-2 py-2 text-center">
                        <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 cursor-pointer rounded border-gray-300 transition checked:border-primary-500 checked:bg-primary-600"
                            checked={isChecked}
                            onChange={() => handleSelectTemplate(template.id)}
                        />
                    </td>
                    <td className="px-2 py-2 text-center">{idx++}</td>
                    <td className="px-2 py-2">{template.name}</td>
                    <td className="px-2 py-2">{template.content}</td>
                    <td className="relative px-2 py-2 text-center">{renderActionColumn(template)}</td>
                </tr>
            );
        }
        return rows;
    };

    /**
     * Render skeleton rows for loading state
     * @returns JSX.Element[]
     */
    const renderSkeletonRows = () => {
        const skeletonRows = [];
        for (let i = 0; i < 10; i++) {
            skeletonRows.push(
                <tr key={i} className="animate-pulse">
                    <td className="px-2 py-2 text-center">
                        <div className="mx-auto h-5 w-5 rounded bg-gray-100" />
                    </td>
                    <td className="px-2 py-2 text-center">
                        <div className="mx-auto h-5 w-8 rounded bg-gray-100" />
                    </td>
                    <td className="px-2 py-2">
                        <div className="h-5 w-full rounded bg-gray-100" />
                    </td>
                    <td className="px-2 py-2">
                        <div className="h-5 w-full rounded bg-gray-100" />
                    </td>
                </tr>
            );
        }
        return skeletonRows;
    };

    /**
     * Handle sync data
     * @returns Promise<void>
     */
    const handleSyncData = async () => {
        setSyncing(true);
        await fetchAllTemplates();
        setSyncing(false);
        setShowOtherActions(false);
    };

    /**
     * Extract parameters from template content
     * @param content string
     * @return string[]
     */
    function extractParamsFromContent(content: string): string[] {
        const matches = content.match(/{{(.*?)}}/g);
        if (!matches) return [];
        // Remove {{ and }}, trim spaces, remove duplicates
        return Array.from(new Set(matches.map((m) => m.replace(/{{|}}/g, "").trim())));
    }

    /**
     * Handle add new template
	 * @param addBrandId string
	 * @param addName string
	 * @param addContent string
     * @returns Promise<void>
     */
    const handleAddTemplate = async () => {
        const errors: { brand?: string; name?: string; content?: string } = {};
        if (!addBrandId) errors.brand = t("templates_page.brand_required");
        if (!addName.trim()) errors.name = t("templates_page.name_required");
        if (!addContent.trim()) errors.content = t("templates_page.content_required");
        setAddError(errors);

        if (Object.keys(errors).length > 0) return;

        const params = extractParamsFromContent(addContent);

        setAddLoading(true);
        try {
            await fetch(`${API_DOMAIN}/templates`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    brand_id: addBrandId,
                    name: addName,
                    content: addContent,
                    params,
                }),
            });
            setNotify({
                open: true,
                message: t("templates_page.create_success"),
                type: "success",
            });
        } catch {
            setNotify({
                open: true,
                message: t("templates_page.create_error"),
                type: "error",
            });
        }
        setAddLoading(false);
        setShowAddModal(false);
        setAddBrandId("");
        setAddName("");
        setAddContent("");
        setAddError({});
        await fetchAllTemplates();
    };

    /**
     * Notification component at top right
	 * @param open boolean
	 * @param type "success" | "error"
	 * @param message string
	 * @param onClose () => void
     */
    function TopRightNotification({
        open,
        type = "success",
        message,
        onClose,
        duration = 3000,
    }: {
        open: boolean;
        type?: "success" | "error";
        message: string;
        onClose: () => void;
        duration?: number;
    }) {
        useEffect(() => {
            if (!open) return;
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }, [open, duration, onClose]);

        if (!open) return null;

        return (
            <div className="flex min-w-[340px] max-w-[420px] items-center rounded-xl border border-gray-100 bg-white px-6 py-4 shadow-lg">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                    <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="flex-1 pr-4 text-base text-gray-700">{message}</div>
                <button
                    className="ml-2 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                    aria-label="Đóng"
                >
                    <X size={20} />
                </button>
            </div>
        );
    }

    /**
	 * Fetch all templates and brands on mount
	 */
    useEffect(() => {
        fetchAllTemplates();
    }, [fetchAllTemplates]);

    return (
        <>
            <DefaultPageLayout breadcrumbs={TEMPLATES_BREADCRUMBS}>
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <div className="px-1/2 py-1/2 flex items-center rounded-lg border border-gray-200 bg-white">
                                <InputSearch
                                    placeholder="templates_page.search_placeholder"
                                    className="border-0 bg-transparent px-1 py-0 text-sm focus:outline-none focus:ring-0"
                                    value={search}
                                    onChange={setSearch}
                                />
                            </div>
                            <button
                                type="button"
                                className="flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-none transition hover:bg-gray-50 hover:shadow-md active:bg-gray-100"
                                onClick={() => setShowDatePopup((v) => !v)}
                            >
                                <Timer size={15} />
                                <span>
                                    {t("templates_page.created_date")}
                                    {dateLabel && <span className="ml-2 text-primary-600">{dateLabel}</span>}
                                </span>
                            </button>
                            {showDatePopup && (
                                <div
                                    ref={datePopupRef}
                                    className="absolute left-0 top-28 z-50 min-w-[420px] max-w-full rounded-xl border border-gray-200 bg-white shadow-lg"
                                >
                                    <span className="mt-10 border-b px-6 py-4 text-xs font-semibold text-gray-500">
                                        {t("templates_page.created_date").toUpperCase()}
                                    </span>
                                    <div className="px-6 pb-2 pt-4">
                                        <DayPicker
                                            mode="range"
                                            selected={dateRange}
                                            onSelect={setDateRange}
                                            numberOfMonths={2}
                                            locale={vi}
                                            captionLayout="dropdown"
                                            showOutsideDays
                                            className="!bg-white"
                                            classNames={{
                                                months: "flex flex-col gap-3 sm:flex-row space-y-4 sm:space-y-0",
                                                month_caption: "flex justify-start pt-1 pb-3 relative items-center",
                                                caption_label: "text-base font-medium",
                                                nav: "hidden",
                                                //nav: "absolute flex items-center justify-between gap-1 inset-x-3 top-3",
                                                // button_previous:
                                                // 	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none size-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-50",
                                                // button_next:
                                                // 	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none size-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-50",
                                                month_grid: "w-full border-collapse space-y-1",
                                                weekdays: "flex",
                                                weekday:
                                                    "text-gray-400 dark:text-gray-500 font-medium rounded-md w-8 text-[0.8rem]",
                                                week: "flex w-full mt-2",
                                                day: "h-8 w-8 mx-[0.5px] text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-green-500/50 [&:has([aria-selected])]:bg-primary-500 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                                day_button:
                                                    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-primary-500 hover:text-white h-8 w-8 p-0 aria-selected:opacity-100",
                                                range_start: "rounded-l-lg",
                                                range_end: "day-range-end rounded-r-lg",
                                                selected:
                                                    "bg-primary-500 text-white hover:bg-primary-500 hover:text-white focus:bg-primary-500 focus:text-white",
                                                today:
                                                    "bg-primary-300 rounded-md hover:bg-primary-400 hover:text-white focus:bg-primary-400 focus:text-white",
                                                outside:
                                                    "day-outside text-gray-400 dark:text-gray-500 aria-selected:bg-primary-500/50 aria-selected:text-gray-400 dark:text-gray-500",
                                                disabled: "text-gray-400 dark:text-gray-500 opacity-50",
                                                range_middle: "aria-selected:bg-primary-500/70 aria-selected:text-white",
                                                hidden: "invisible",
                                                footer: "text-xs font-semibold italic",
                                            }}
                                            footer={
                                                <div className="pt-2 text-xs text-gray-500">
                                                    {dateRange?.from && dateRange?.to ? (
                                                        // `Đã chọn: ${format(dateRange.from, "dd/MM/yyyy")}-${format(dateRange.to, "dd/MM/yyyy")}`
                                                        `${t("templates_page.selected")}: ${format(dateRange.from, "dd/MM/yyyy")}-${format(dateRange.to, "dd/MM/yyyy")}`
                                                    ) : dateRange?.from ? (
                                                        // `Đã chọn: ${format(dateRange.from, "dd/MM/yyyy")}`
                                                        t("templates_page.selected")
                                                    ) : (
                                                        <span className="italic text-gray-400">
                                                            {t("templates_page.select_date")}
                                                        </span>
                                                    )}
                                                </div>
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-3">
                                        <Button
                                            size="2xs"
                                            className="border border-gray-400 bg-white !text-gray-700 hover:bg-gray-100 hover:shadow-md"
                                            onClick={() => {
                                                setDateRange(undefined);
                                                setShowDatePopup(false);
                                            }}
                                        >
                                            {t("templates_page.clear")}
                                        </Button>
                                        <Button size="2xs" variant="secondary" onClick={() => setShowDatePopup(false)}>
                                            {t("templates_page.apply")}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <span className="mt-1 text-sm">
                            <span className="font-semibold text-primary-600">{selectedTemplateIds.length}</span>{" "}
                            {t("templates_page.selected_template", { number: selectedTemplateIds.length })}
                        </span>
                    </div>
                    <div className="relative flex gap-2">
                        <Button size="xs" variant="secondary" onClick={() => setShowAddModal(true)}>
                            {t("templates_page.add_new_template")}
                        </Button>
                        <div ref={otherActionsRef} className="relative">
                            <Button
                                size="xs"
                                className="flex min-w-[140px] items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-1 py-2 !text-gray-600 shadow-none transition hover:bg-gray-100 hover:shadow-md active:bg-gray-100"
                                onClick={() => setShowOtherActions((v) => !v)}
                            >
                                {t("templates_page.other_action")}
                                <ChevronDown
                                    strokeWidth={3}
                                    size={20}
                                    className={`transform text-gray-400 transition-transform duration-300 ${showOtherActions ? "rotate-180" : ""}`}
                                />
                            </Button>
                            {showOtherActions && (
                                <div className="animate-fade-in absolute right-0 mt-2 w-max rounded-xl border border-gray-200 bg-white px-2 py-2 shadow-sm">
                                    <Button
                                        size="sm"
                                        disabled={syncing || loading}
                                        onClick={handleSyncData}
                                        className={cn(
                                            "flex w-full items-center justify-start gap-2 rounded-md bg-transparent px-3 py-2 font-medium transition",
                                            syncing || loading
                                                ? "cursor-not-allowed bg-blue-500 text-blue-700"
                                                : "!text-gray-700 hover:bg-blue-100 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700"
                                        )}
                                    >
                                        <RefreshCw className={cn("h-4 w-4", (syncing || loading) && "animate-spin")} />
                                        {t("templates_page.sync_data")}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="w-10 px-2 py-2 text-center hover:bg-gray-200">
                                    <input
                                        ref={selectAllRef}
                                        type="checkbox"
                                        className={`form-checkbox h-4 w-4 cursor-pointer rounded border-gray-200 transition checked:border-primary-500 checked:bg-primary-600 indeterminate:border-violet-500 indeterminate:bg-violet-500`}
                                        checked={
                                            selectedTemplateIds.length === templates.length && templates.length > 0
                                        }
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    />
                                </th>
                                <th className="w-12 px-2 py-2 text-center hover:bg-gray-200">STT</th>
                                <th className="px-2 py-2 text-left hover:bg-gray-200">
                                    {t("templates_page.name").toUpperCase()}
                                </th>
                                <th className="px-2 py-2 text-left hover:bg-gray-200">
                                    {t("templates_page.description").toUpperCase()}
                                </th>
                                <th className="w-8 cursor-pointer px-4 py-2 text-center hover:bg-gray-200">
                                    <SlidersHorizontal size={18} />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading || syncing ? renderSkeletonRows() : renderRows()}
                            {!loading && !syncing && paginatedTemplates.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-400">
                                        {t("templates_page.no_results")}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4">
                    <Pagination
                        currentPage={page}
                        pageSize={pageSize}
                        totalItem={filteredByDateTemplates.length}
                        setPage={setPage}
                        setPageSize={setPageSize}
                    />
                </div>

                <Dialog
                    open={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    className="fixed inset-0 z-50"
                >
                    <div className="flex min-h-screen items-center justify-center bg-black/20">
                        <Dialog.Panel className="h-fit w-full max-w-screen-md rounded-xl bg-white p-6 shadow-lg">
                            <Dialog.Title className="mb-4 text-lg font-semibold">
                                {t("templates_page.add_new_template")}
                            </Dialog.Title>
                            <div className="mb-4">
                                <SelectForm
                                    label={t("brands_page.title")}
                                    value={addBrandId}
                                    onChange={(e) => setAddBrandId(e.target.value)}
                                    options={[
                                        {
                                            value: "",
                                            label: t("select.placeholder", {
                                                data: t("brands_page.title").toLowerCase(),
                                            }),
                                            noTranslate: true,
                                        },
                                        ...brands.map((b) => ({
                                            value: b.id,
                                            label: b.name,
                                            noTranslate: true,
                                        })),
                                    ]}
                                    errorMessage={addError.brand}
                                />
                            </div>
                            <div className="mb-4">
                                <InputForm
                                    label={t("templates_page.name")}
                                    value={addName}
                                    onChange={(e) => setAddName(e.target.value)}
                                    placeholder={t("templates_page.name_placeholder")}
                                    errorMessage={addError.name}
                                />
                            </div>
                            <div className="mb-6">
                                <TextArea
                                    label={t("templates_page.description")}
                                    value={addContent}
                                    onChange={(e) => setAddContent(e.target.value)}
                                    placeholder={t("templates_page.description_placeholder")}
                                    rows={3}
                                    errorMessage={addError.content}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    className="border border-gray-300 bg-white !text-gray-700 hover:bg-gray-100 hover:shadow-md"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setAddError({});
                                    }}
                                    disabled={addLoading}
                                >
                                    {t("templates_page.cancel")}
                                </Button>
                                <Button variant="secondary" onClick={handleAddTemplate} disabled={addLoading}>
                                    {addLoading ? t("templates_page.save_loading") : t("templates_page.save")}
                                </Button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>

                <Dialog
                    open={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    className="fixed inset-0 z-50"
                >
                    <div className="flex min-h-screen items-center justify-center bg-black/20">
                        <Dialog.Panel className="h-fit w-full max-w-screen-md rounded-xl bg-white p-6 shadow-lg">
                            <Dialog.Title className="mb-4 text-lg font-semibold">
                                {t("templates_page.edit")}
                            </Dialog.Title>
                            <div className="mb-4">
                                <SelectForm
                                    label={t("brands_page.title")}
                                    value={editBrandId}
                                    onChange={(e) => setEditBrandId(e.target.value)}
                                    options={[
                                        {
                                            value: "",
                                            label: t("select.placeholder", {
                                                data: t("brands_page.title").toLowerCase(),
                                            }),
                                            noTranslate: true,
                                        },
                                        ...brands.map((b) => ({
                                            value: b.id,
                                            label: b.name,
                                            noTranslate: true,
                                        })),
                                    ]}
                                    errorMessage={editError.brand}
                                />
                            </div>
                            <div className="mb-4">
                                <InputForm
                                    label={t("templates_page.name")}
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder={t("templates_page.name_placeholder")}
                                    errorMessage={editError.name}
                                />
                            </div>
                            <div className="mb-6">
                                <TextArea
                                    label={t("templates_page.description")}
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    placeholder={t("templates_page.description_placeholder")}
                                    rows={3}
                                    errorMessage={editError.content}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    className="border border-gray-300 bg-white !text-gray-700 hover:bg-gray-100 hover:shadow-md"
                                    onClick={() => setShowEditModal(false)}
                                    disabled={loading}
                                >
                                    {t("templates_page.cancel")}
                                </Button>
                                <Button variant="secondary" onClick={handleSaveEdit} disabled={loading}>
                                    {loading ? t("templates_page.save_loading") : t("templates_page.save")}
                                </Button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>

                <ConfirmModal
                    isOpen={showConfirmDelete}
                    setIsOpen={setShowConfirmDelete}
                    title={t("templates_page.delete")}
                    confirmLabel={t("templates_page.delete")}
                    cancelLabel={t("templates_page.cancel")}
                    state="warning"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowConfirmDelete(false)}
                >
                    <div>{t("templates_page.delete_confirmation")}</div>
                </ConfirmModal>

                <div className="fixed right-8 top-8 z-[9999]">
                    <TopRightNotification
                        open={notify.open}
                        type={notify.type}
                        message={notify.message}
                        onClose={() => setNotify((prev) => ({ ...prev, open: false }))}
                        duration={3000}
                    />
                </div>
            </DefaultPageLayout>
        </>
    );
};

export default TemplatesPage;
