import type {
	IFilterFn,
	IItem,
	IItemToStringFn,
	IUseComboBoxArgs,
} from "./use-combo-box.d";

export function slugify(str: string): string {
	return str
		.toLowerCase()
		.replaceAll(/[^\da-z]/g, "-")
		.replaceAll(/-+/g, "-")
		.replaceAll(/^-|-$/g, "");
}

export function defaultFilterFn<T extends IItem>(
	keyword: string,
	items: T[] = []
): T[] {
	const rg = new RegExp(keyword, "i");
	return items
		.filter((item) => item.label)
		.filter((item) => rg.test(item.label!));
}

export function getItemId<T>(item: T, args: IUseComboBoxArgs<T>) {
	const { id, itemToString } = args;
	let itemKey = "";
	if (itemToString) {
		itemKey = itemToString(item);
	}
	itemKey = slugify(itemKey || JSON.stringify(item));

	return `${id}-option-${itemKey}`;
}

export function getActiveItemId<T>(
	highlightedIndex: number,
	items: T[],
	args: IUseComboBoxArgs<T>
) {
	const activeItem = items[highlightedIndex];
	if (!activeItem) {
		return;
	}

	return getItemId(activeItem, args);
}

interface IGetArgsReturns<T>
	extends Omit<IUseComboBoxArgs<T>, "itemToString" | "items" | "filterFn"> {
	itemToString: IItemToStringFn<T>;
	items: T[];
	filterFn: IFilterFn<T>;
}

export function getArgs<T>(userArgs: IUseComboBoxArgs<T>): IGetArgsReturns<T> {
	// eslint-disable-next-line unicorn/consistent-function-scoping
	const defaultItemToString: IItemToStringFn<T> = (item) =>
		item ? JSON.stringify(item) : "";

	const {
		itemToString = defaultItemToString,
		items = [],
		filterFn = defaultFilterFn as IFilterFn<T>,
	} = userArgs;

	return { ...userArgs, filterFn, items, itemToString };
}
