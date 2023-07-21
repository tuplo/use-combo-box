import {
	defaultFilterFn,
	getActiveItemId,
	getArgs,
	getItemId,
	slugify,
} from "./helpers";
import type { IUseComboBoxArgs, IItem } from "./use-combo-box";

describe("useComboBox: helpers", () => {
	describe("defaultFilterFn", () => {
		it.each([
			["with items", ["foo", "bar", "foobar"], ["foo", "foobar"]],
			["no items", undefined, []],
			["handles falsy item", ["foo", null, "bar"], ["foo"]],
		])("defaults filter: %s", async (_, items, expected) => {
			const filter = defaultFilterFn;
			const labeled = items?.map((label) => ({ label })) as IItem[];
			const actual = await filter("foo", labeled);

			const labeledExpected = expected.map((label) => ({ label })) as IItem[];
			expect(actual).toStrictEqual(labeledExpected);
		});
	});

	describe("getItemId", () => {
		it.each([
			["default", undefined, "id-option-value-foobar-label-label"],
			[
				"custom itemToString",
				(item: { label: string }) => item.label,
				"id-option-label",
			],
			[
				"no id",
				// @ts-expect-error item doesn't have foo property
				(item) => item.foo,
				"id-option-value-foobar-label-label",
			],
		])("getItemId: %s", (_, itemToString, expected) => {
			const args = { id: "id", onSelectedItemChange: jest.fn(), itemToString };
			const actual = getItemId({ value: "foobar", label: "label" }, args);

			expect(actual).toBe(expected);
		});
	});

	describe("getActiveItemId", () => {
		it.each([
			["first item selected", 1, "foobar-option-667"],
			["no item selected", -1, undefined],
			["bad index", 2, undefined],
		])("getActiveItemId: %s", (_, highlightedIndex, expected) => {
			const items = [{ value: "666" }, { value: "667" }] as IItem[];
			const args: IUseComboBoxArgs<IItem> = {
				id: "foobar",
				onSelectedItemChange: jest.fn(),
				itemToString: (item) => String(item.value),
			};
			const actual = getActiveItemId(highlightedIndex, items, args);

			expect(actual).toBe(expected);
		});
	});

	describe("getArgs", () => {
		const items = [{ value: "666" }, undefined, { value: "667" }] as IItem[];

		it.each([
			["default", 0, '{"value":"666"}'],
			["falsy item", 1, ""],
		])("itemToString: %s", (_, index, expected) => {
			const userArgs: IUseComboBoxArgs<IItem> = {
				id: "foobar",
				onSelectedItemChange: jest.fn(),
				items,
			};
			const args = getArgs(userArgs);
			const actual = args.itemToString(items[index]);

			expect(actual).toBe(expected);
		});
	});

	describe("slugify", () => {
		it.each([
			["Hello World", "hello-world"],
			[
				'{"link":"/venue/arthouse-crouch-end","label":"ArtHouse Crouch End"}',
				"link-venue-arthouse-crouch-end-label-arthouse-crouch-end",
			],
		])("builds slug: %s", (str, expected) => {
			const actual = slugify(str);
			expect(actual).toStrictEqual(expected);
		});
	});
});
