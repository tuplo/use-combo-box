import {
	defaultFilterFn,
	getItemId,
	getActiveItemId,
	getArgs,
} from './helpers';
import type { UseComboBoxArgs } from './combhook.d';

describe('useComboBox: helpers', () => {
	describe('defaultFilterFn', () => {
		it.each([
			['with items', ['foo', 'bar', 'foobar'], ['foo', 'foobar']],
			['no items', undefined, []],
			['handles falsy item', ['foo', null, 'bar'], ['foo']],
		])('defaults filter: %s', async (_, items, expected) => {
			const filter = defaultFilterFn;
			const actual = await filter('foo', items);

			expect(actual).toStrictEqual(expected);
		});
	});

	describe('getItemId', () => {
		it.each([
			['default', undefined, 'id-option-{"id":"foobar","label":"label"}'],
			[
				'custom itemToString',
				(item: { label: string }) => item.label,
				'id-option-label',
			],
			[
				'no id',
				// @ts-expect-error item doesn't have foo property
				(item) => item.foo,
				'id-option-{"id":"foobar","label":"label"}',
			],
		])('getItemId: %s', (_, itemToString, expected) => {
			const args = { id: 'id', onSelectedItemChange: jest.fn(), itemToString };
			const actual = getItemId({ id: 'foobar', label: 'label' }, args);

			expect(actual).toBe(expected);
		});
	});

	describe('getActiveItemId', () => {
		it.each([
			['first item selected', 1, 'foobar-option-667'],
			['no item selected', -1, undefined],
			['bad index', 2, undefined],
		])('getActiveItemId: %s', (_, highlightedIndex, expected) => {
			const items = [{ id: 666 }, { id: 667 }];
			type ItemType = { id: number };
			const args: UseComboBoxArgs<ItemType> = {
				id: 'foobar',
				onSelectedItemChange: jest.fn(),
				itemToString: (item) => String(item.id),
			};
			const actual = getActiveItemId(highlightedIndex, items, args);

			expect(actual).toBe(expected);
		});
	});

	describe('getArgs', () => {
		type ItemType = { id: number } | undefined;
		const items = [{ id: 666 }, undefined, { id: 667 }];

		it.each([
			['default', 0, '{"id":666}'],
			['falsy item', 1, ''],
		])('itemToString: %s', (_, index, expected) => {
			const userArgs: UseComboBoxArgs<ItemType> = {
				id: 'foobar',
				onSelectedItemChange: jest.fn(),
				items,
			};
			const args = getArgs(userArgs);
			const actual = args.itemToString(items[index]);

			expect(actual).toBe(expected);
		});
	});
});
