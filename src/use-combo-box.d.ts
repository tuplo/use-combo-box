import type { ChangeEvent, KeyboardEvent, MouseEvent } from "react";

export interface IFilterFn<T> {
	(keyword: string, items: T[]): Promise<T[]> | T[];
}

export interface IGetComboBoxProps {
	(): IGetComboBoxPropsReturns;
}

export interface IGetComboBoxPropsReturns {
	role: "group";
}

export interface IGetInputProps {
	(): IGetInputPropsReturns;
}

export interface IGetInputPropsReturns {
	"aria-activedescendant"?: string;
	"aria-autocomplete": "list";
	"aria-controls"?: string;
	"aria-expanded": boolean;
	"aria-haspopup": "listbox";
	"aria-label"?: string;
	"aria-labelledby"?: string;
	autoComplete: "off";
	onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
	onKeyDown: (ev: KeyboardEvent<HTMLInputElement>) => void;
	placeholder?: string;
	role: "combobox";
	value?: string;
}

export interface IGetItemProps<T> {
	(args: IGetItemPropsArgs<T>): IGetItemPropsReturns;
}

export interface IGetItemPropsArgs<T> {
	index: number;
	item: T;
}

export interface IGetItemPropsReturns {
	"aria-selected": boolean;
	id: string;
	onClick: (event: MouseEvent) => void;
	role: "option";
	selected: boolean;
}

export interface IGetLabelProps {
	(): IGetLabelPropsReturns;
}

export interface IGetLabelPropsReturns {
	htmlFor: string;
	id: string;
}

export interface IGetMenuProps {
	(): IGetMenuPropsReturns;
}

export interface IGetMenuPropsReturns {
	"aria-label"?: string;
	"aria-labelledby"?: string;
	id: string;
	role: "listbox";
}

export interface IGetToggleButtonProps {
	(): IGetToggleButtonPropsReturns;
}

export interface IGetToggleButtonPropsReturns {
	"aria-controls"?: string;
	"aria-expanded": boolean;
	"aria-label"?: string;
	"aria-labelledby"?: string;
	id: string;
	tabIndex: number;
	type: "button";
}

export interface IItem {
	label?: string;
	value?: string;
}

export interface IItemToStringFn<T> {
	(item: T): string;
}

export interface IUseComboBoxArgs<T> {
	filterFn?: IFilterFn<T>;
	id: string;
	initialIsOpen?: boolean;
	items?: T[];
	itemToString?: IItemToStringFn<T>;
	label?: string;
	onInputValueChange?: (value?: string) => void;
	onSelectedItemChange: (item: T) => void;
	placeholder?: string;
	selectedValue?: string;
	selectedValues?: string[];
}

export interface IUseComboBoxReturns<T> {
	closeMenu: () => void;
	getComboBoxProps: IGetComboBoxProps;
	getInputProps: IGetInputProps;
	getItemProps: IGetItemProps<T>;
	getLabelProps: IGetLabelProps;
	getMenuProps: IGetMenuProps;
	getToggleButtonProps: IGetToggleButtonProps;
	highlightedIndex: number;
	isOpen: boolean;
	items: T[];
	setIsOpen: (isOpen: boolean) => void;
}
