import type { ChangeEvent, KeyboardEvent, MouseEvent } from "react";

export interface IItem {
	value?: string;
	label?: string;
}

export interface IFilterFn<T> {
	(keyword: string, items: T[]): Promise<T[]> | T[];
}

export interface IItemToStringFn<T> {
	(item: T): string;
}

export interface IGetLabelPropsReturns {
	id: string;
	htmlFor: string;
}

export interface IGetLabelProps {
	(): IGetLabelPropsReturns;
}
export interface IGetComboBoxPropsReturns {
	role: "group";
}
export interface IGetComboBoxProps {
	(): IGetComboBoxPropsReturns;
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
export interface IGetToggleButtonProps {
	(): IGetToggleButtonPropsReturns;
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
export interface IGetInputProps {
	(): IGetInputPropsReturns;
}

export interface IGetMenuPropsReturns {
	"aria-label"?: string;
	"aria-labelledby"?: string;
	id: string;
	role: "listbox";
}

export interface IGetMenuProps {
	(): IGetMenuPropsReturns;
}

export interface IGetItemPropsArgs<T> {
	item: T;
	index: number;
}
export interface IGetItemPropsReturns {
	"aria-selected": boolean;
	id: string;
	onClick: (event: MouseEvent) => void;
	role: "option";
	selected: boolean;
}
export interface IGetItemProps<T> {
	(args: IGetItemPropsArgs<T>): IGetItemPropsReturns;
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
	selectedValues?: string[];
	selectedValue?: string;
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
