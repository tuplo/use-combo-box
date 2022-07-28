import type { MouseEvent, ChangeEvent, KeyboardEvent } from 'react';

export interface ItemType {
	id?: string;
	label?: string;
	[k: string]: unknown;
}

export type FilterFn<T> = (keyword: string, items?: T[]) => Promise<T[]>;

export type ItemToStringFn<T> = (item: T) => string;

export type GetLabelPropsReturns = {
	id: string;
	htmlFor: string;
};
export type GetLabelProps = () => GetLabelPropsReturns;

export type GetComboBoxPropsReturns = {
	'aria-expanded': boolean;
	'aria-haspopup': 'listbox';
	'aria-owns': string;
	role: 'combobox';
};
export type GetComboBoxProps = () => GetComboBoxPropsReturns;

export type GetToggleButtonPropsReturns = {
	id: string;
	tabIndex: number;
	type: 'button';
};
export type GetToggleButtonProps = () => GetToggleButtonPropsReturns;

export type GetInputPropsReturns = {
	'aria-activedescendant'?: string;
	'aria-autocomplete': 'list';
	'aria-controls': string;
	'aria-labelledby': string;
	autoComplete: 'off';
	onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
	onKeyDown: (ev: KeyboardEvent<HTMLInputElement>) => void;
	placeholder?: string;
	role: 'textbox';
	value?: string;
};
export type GetInputProps = () => GetInputPropsReturns;

export type GetMenuPropsReturns = {
	'aria-labelledby': string;
	id: string;
	role: 'listbox';
};
export type GetMenuProps = () => GetMenuPropsReturns;

export type GetItemPropsArgs<T> = { item: T; index: number };
export type GetItemPropsReturns = {
	'aria-selected': boolean;
	id: string;
	onClick: (event: MouseEvent) => void;
	role: 'option';
};
export type GetItemProps<T> = (
	args: GetItemPropsArgs<T>
) => GetItemPropsReturns;

export interface UseComboBoxArgs<T> {
	filterFn?: FilterFn<T>;
	id: string;
	items?: T[];
	itemToString?: ItemToStringFn<T>;
	onInputValueChange?: (value?: string) => void;
	onSelectedItemChange: (item: T) => void;
	placeholder?: string;
}
