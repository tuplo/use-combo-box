import type { FilterFn, ItemToStringFn, UseComboBoxArgs } from './combhook.d';

export const defaultFilterFn: FilterFn<unknown> = async (
	keyword,
	items = []
) => {
	const rg = new RegExp(keyword, 'i');
	// eslint-disable-next-line dot-notation
	return items.filter((item) => item && rg.test(String(item)));
};

export function getItemId<T>(item: T, args: UseComboBoxArgs<T>) {
	const { id, itemToString } = args;
	let itemKey = '';
	if (itemToString) {
		itemKey = itemToString(item);
	}
	itemKey = itemKey || JSON.stringify(item);
	return `${id}-option-${itemKey}`;
}

export function getActiveItemId<T>(
	highlightedIndex: number,
	items: T[],
	args: UseComboBoxArgs<T>
) {
	const activeItem = items[highlightedIndex];
	if (!activeItem) return undefined;
	return getItemId<T>(activeItem, args);
}

interface GetArgsReturns<T>
	extends Omit<UseComboBoxArgs<T>, 'itemToString' | 'items' | 'filterFn'> {
	itemToString: ItemToStringFn<T>;
	items: T[];
	filterFn: FilterFn<T>;
}

export function getArgs<T>(userArgs: UseComboBoxArgs<T>): GetArgsReturns<T> {
	const defaultItemToString: ItemToStringFn<T> = (item) =>
		item ? JSON.stringify(item) : '';

	const {
		itemToString = defaultItemToString,
		items = [],
		filterFn = defaultFilterFn as FilterFn<T>,
	} = userArgs;

	return { ...userArgs, filterFn, items, itemToString };
}
