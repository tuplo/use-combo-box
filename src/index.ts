/* eslint-disable unicorn/consistent-function-scoping */
import type { ChangeEvent, KeyboardEvent } from "react";
import { useEffect, useState } from "react";

import { getActiveItemId, getArgs, getItemId } from "./helpers";
import type {
	IGetComboBoxProps,
	IGetInputProps,
	IGetItemProps,
	IGetLabelProps,
	IGetMenuProps,
	IGetToggleButtonProps,
	IItem,
	IUseComboBoxArgs,
	IUseComboBoxReturns,
} from "./use-combo-box.d";

export type {
	IFilterFn,
	IGetComboBoxProps,
	IGetInputProps,
	IGetItemProps,
	IGetItemPropsReturns,
	IGetLabelProps,
	IGetMenuProps,
	IGetToggleButtonProps,
	IItem,
	IUseComboBoxArgs,
	IUseComboBoxReturns,
} from "./use-combo-box.d";

export function useComboBox<T extends IItem>(
	userArgs: IUseComboBoxArgs<T>
): IUseComboBoxReturns<T> {
	const args = getArgs(userArgs);
	const {
		filterFn,
		initialIsOpen = false,
		items: initialItems = [],
		label,
		onInputValueChange: customOnInputValueChange,
		onSelectedItemChange,
		placeholder,
		selectedValue,
		selectedValues,
	} = args;
	const [keyword, setKeyword] = useState<string>();
	const [filteredItems, setFilteredItems] = useState<T[]>();
	const [isOpen, setIsOpen] = useState<boolean>(initialIsOpen);
	const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

	const items = filteredItems || initialItems;

	useEffect(() => {
		if (!keyword) return;

		const r = filterFn(keyword, initialItems);
		if (r instanceof Promise) {
			r.then((fresh) => {
				setFilteredItems(fresh);
				setIsOpen(true);
			});
		} else {
			setFilteredItems(r);
			setIsOpen(true);
		}
	}, [keyword]);

	const closeMenu = () => {
		setIsOpen(false);
		setKeyword(undefined);
		setFilteredItems(initialItems);
		setHighlightedIndex(-1);

		if (customOnInputValueChange) {
			customOnInputValueChange();
		}
	};

	const onInputValueChange = (ev: ChangeEvent<HTMLInputElement>) => {
		const { value } = ev.target;
		setKeyword(value);

		if (!value) {
			closeMenu();
		}

		if (customOnInputValueChange) {
			customOnInputValueChange(value);
		}
	};

	const getLabelProps: IGetLabelProps = () => ({
		htmlFor: `${args.id}-combobox`,
		id: `${args.id}-label`,
	});

	const getComboBoxProps: IGetComboBoxProps = () => ({
		role: "group",
	});

	const getToggleButtonProps: IGetToggleButtonProps = () => ({
		"aria-controls": isOpen ? `${args.id}-menu` : undefined,
		"aria-expanded": isOpen,
		"aria-label": label,
		"aria-labelledby": label ? undefined : `${args.id}-label`,
		id: `${args.id}-toggle-button`,
		onClick: (event: MouseEvent) => {
			event.preventDefault();
			setIsOpen(!isOpen);
		},
		tabIndex: -1,
		type: "button",
	});

	const getInputProps: IGetInputProps = () => ({
		"aria-activedescendant": getActiveItemId(
			highlightedIndex,
			filteredItems || initialItems,
			args
		),
		"aria-autocomplete": "list",
		"aria-controls": isOpen ? `${args.id}-menu` : undefined,
		"aria-expanded": isOpen,
		"aria-haspopup": "listbox",
		"aria-label": label || placeholder,
		"aria-labelledby": label || placeholder ? undefined : `${args.id}-label`,
		autoComplete: "off",
		id: `${args.id}-combobox`,
		onChange: onInputValueChange,
		onKeyDown: (ev: KeyboardEvent<HTMLInputElement>) => {
			if (/ArrowDown|ArrowUp/.test(ev.key)) {
				ev.preventDefault();
				const delta = ev.key === "ArrowDown" ? 1 : -1;
				const newIndex = (highlightedIndex + delta) % items.length;
				setHighlightedIndex(newIndex);
			}

			if (ev.key === "Enter") {
				const selectedIndex = highlightedIndex === -1 ? 0 : highlightedIndex;
				onSelectedItemChange(items[selectedIndex]);
				closeMenu();
			}

			if (ev.key === "Escape") {
				closeMenu();
			}
		},
		placeholder,
		role: "combobox",
		value: keyword || "",
	});

	const getMenuProps: IGetMenuProps = () => ({
		"aria-label": label,
		"aria-labelledby": label ? undefined : `${args.id}-label`,
		id: `${args.id}-menu`,
		role: "listbox",
	});

	const getItemProps: IGetItemProps<T> = ({ index, item }) => {
		let selected = index === highlightedIndex;

		if (Array.isArray(selectedValues)) {
			selected = Boolean(item.value && selectedValues.includes(item.value));
		}

		if (selectedValue !== undefined) {
			selected = item.value === selectedValue;
		}

		return {
			"aria-selected": selected,
			id: getItemId(item, args),
			onClick: () => {
				onSelectedItemChange(item);
				closeMenu();
			},
			role: "option",
			selected,
		};
	};

	return {
		closeMenu,
		getComboBoxProps,
		getInputProps,
		getItemProps,
		getLabelProps,
		getMenuProps,
		getToggleButtonProps,
		highlightedIndex,
		isOpen,
		items,
		setIsOpen,
	};
}
