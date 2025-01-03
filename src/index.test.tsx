/* eslint-disable unicorn/consistent-function-scoping */
import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import _pick from "lodash.pick";

import { useComboBox } from ".";
import type { IFilterFn, IItem, IUseComboBoxArgs } from "./use-combo-box.d";

const defaultProps: IUseComboBoxArgs<IItem> = {
	id: "foobar",
	initialIsOpen: true,
	items: [
		{ label: "Alice", value: "item-1" },
		{ label: "Bob", value: "item-2" },
		{ label: "Charlie", value: "item-3" },
		{ label: "Alice Doe", value: "item-4" },
	],
	itemToString: (item) => item?.value?.toString() || "",
	onSelectedItemChange: vi.fn(),
};

describe("useComboBox", () => {
	const user = userEvent.setup();

	it("renders", () => {
		const { container } = render(<Component {...defaultProps} />);

		expect(container).toMatchSnapshot();
		expect(screen.getByText("Alice Doe")).toBeInTheDocument();
	});

	describe("initialItems", () => {
		it("handles a list of initial items", () => {
			const items = [{ label: "buzz", value: "foobar" }];
			render(<Component {...defaultProps} items={items} />);

			expect(screen.getByRole("listbox")).toBeInTheDocument();
			expect(screen.queryAllByRole("option")).toHaveLength(1);
		});

		it("handles an empty list of initial items", () => {
			const items: IItem[] = [];
			render(<Component {...defaultProps} items={items} />);

			expect(screen.getByRole("listbox")).toBeInTheDocument();
			expect(screen.queryAllByRole("option")).toHaveLength(0);
		});

		it("handles an undefined list of initial items", () => {
			const items: IItem[] | undefined = undefined;
			render(<Component {...defaultProps} items={items} />);

			expect(screen.getByRole("listbox")).toBeInTheDocument();
			expect(screen.queryAllByRole("option")).toHaveLength(0);
		});

		it("handles an update to the list of items", async () => {
			const items = [{ label: "buzz", value: "foobar" }];
			const { rerender } = render(
				<Component {...defaultProps} items={items} />
			);
			expect(screen.getByText("buzz")).toBeInTheDocument();

			const newItems = [{ label: "quz", value: "bazz" }];
			rerender(<Component {...defaultProps} items={newItems} />);
			expect(screen.getByText("quz")).toBeInTheDocument();
		});
	});

	describe("placeholder", () => {
		it("takes provided placeholder", () => {
			render(<Component {...defaultProps} placeholder="foobar" />);

			expect(screen.getByPlaceholderText("foobar")).toBeInTheDocument();
		});
	});

	describe("itemToString", () => {
		it("uses a default itemToString", () => {
			render(<Component {...defaultProps} itemToString={undefined} />);

			const [firstOption] = screen.queryAllByRole("option");
			expect(firstOption).toHaveAttribute(
				"id",
				"foobar-option-label-alice-value-item-1"
			);
		});
	});

	describe("filterFn", () => {
		it("filters out an item per keyword typed by user", async () => {
			render(<Component {...defaultProps} />);
			await user.type(screen.getByRole("combobox"), "Alice");

			expect(screen.queryAllByRole("option")).toHaveLength(2);
		});

		it("uses a custom function to filter items", async () => {
			const customFilter: IFilterFn<IItem> = async () => [
				{ label: "David", value: "item-5" },
				{ label: "Edna", value: "item-6" },
				{ label: "Fay", value: "item-6" },
			];
			render(<Component {...defaultProps} filterFn={customFilter} />);
			await user.type(screen.getByRole("combobox"), "Alice");

			expect(screen.queryAllByRole("option")).toHaveLength(3);
			expect(screen.getByText("Edna")).toBeInTheDocument();
		});
	});

	describe("onInputValueChange", () => {
		it("calls handler if provided when user types", async () => {
			const onInputValueChangeSpy = vi.fn();
			render(
				<Component
					{...defaultProps}
					onInputValueChange={onInputValueChangeSpy}
				/>
			);

			await act(async () => {
				await user.type(screen.getByRole("combobox"), "Alice");
			});

			expect(onInputValueChangeSpy).toHaveBeenCalledTimes(5);
			expect(onInputValueChangeSpy).toHaveBeenCalledWith("Alice");
		});

		it("resets combo-box when user deletes the keyword", async () => {
			render(<Component {...defaultProps} />);

			await act(async () => {
				await user.type(screen.getByRole("combobox"), "Al");
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			for await (const i of [1, 2]) {
				await act(async () => {
					await user.type(screen.getByRole("combobox"), "{Backspace}");
				});
			}

			expect(screen.getByRole("combobox")).toHaveValue("");
			expect(screen.queryAllByRole("option")).toHaveLength(0);
		});
	});

	describe("label", () => {
		it("button uses propped label instead of aria-labelledby", () => {
			render(<Component {...defaultProps} label="foobar" />);

			const input = screen.getByRole("button");
			expect(input).toHaveAttribute("aria-label", "foobar");
			expect(input).not.toHaveAttribute("aria-labelledby");
		});

		it("menu uses propped label instead of aria-labelledby", () => {
			render(<Component {...defaultProps} label="foobar" />);

			const input = screen.getByRole("listbox");
			expect(input).toHaveAttribute("aria-label", "foobar");
			expect(input).not.toHaveAttribute("aria-labelledby");
		});
	});

	describe("selectedValue", () => {
		it.each([
			["no value", undefined, []],
			["empty string", "", []],
			["single", "item-3", ["Charlie"]],
		])("selected value: %s", (_, selectedValue, expected) => {
			const props: IUseComboBoxArgs<IItem> = {
				...structuredClone(
					_pick(defaultProps, ["id", "initialIsOpen", "items"])
				),
				itemToString: (item) => item?.value?.toString() || "",
				onSelectedItemChange: vi.fn(),
			};
			props.selectedValue = selectedValue;
			const { container } = render(<Component {...props} />);

			const selected = container.querySelectorAll('[aria-selected="true"]');
			// eslint-disable-next-line unicorn/prefer-spread
			const labels = Array.from(selected).map((el) => el.textContent);
			expect(selected).toHaveLength(expected.length);
			expect(labels).toStrictEqual(expected);
		});

		it("doesn't select anything if no selectedValue and no item.value", () => {
			const props: IUseComboBoxArgs<IItem> = {
				...structuredClone(
					_pick(defaultProps, ["id", "initialIsOpen", "items"])
				),
				itemToString: (item) => item?.value?.toString() || "",
				onSelectedItemChange: vi.fn(),
			};
			props.items = [
				{ label: "Alice", value: undefined },
				{ label: "Bob", value: "item-2" },
			];
			const { container } = render(<Component {...props} />);

			const expected: string[] = [];
			const selected = container.querySelectorAll('[aria-selected="true"]');
			// eslint-disable-next-line unicorn/prefer-spread
			const labels = Array.from(selected).map((el) => el.textContent);
			expect(selected).toHaveLength(expected.length);
			expect(labels).toStrictEqual(expected);
		});
	});

	describe("selectedValues", () => {
		it("accepts a list of selected items", () => {
			const selectedValues = ["item-1", "item-3"];
			render(<Component {...defaultProps} selectedValues={selectedValues} />);

			const selected = screen.queryAllByRole("option", { selected: true });
			expect(selected).toHaveLength(2);
		});
	});

	describe("initialIsOpen", () => {
		it("opens the menu when initialIsOpen is true", () => {
			render(<Component {...defaultProps} initialIsOpen />);
			expect(screen.getByRole("listbox")).toBeInTheDocument();
		});

		it("keeps the menu closed when initialIsOpen is false", () => {
			render(<Component {...defaultProps} initialIsOpen />);
			const options = screen.queryAllByRole("option");
			expect(options).toHaveLength(4);
		});
	});

	describe("onSelectedItemChange", () => {
		it("calls handler when user picks an item (by clicking)", async () => {
			const onSelectedItemChangeSpy = vi.fn();
			render(
				<Component
					{...defaultProps}
					onSelectedItemChange={onSelectedItemChangeSpy}
				/>
			);

			const [first] = screen.queryAllByRole("option");
			await user.click(first);

			const expected = { label: "Alice", value: "item-1" };
			expect(onSelectedItemChangeSpy).toHaveBeenCalledTimes(1);
			expect(onSelectedItemChangeSpy).toHaveBeenCalledWith(expected);
		});

		it("closes the menu when user clicks an option", async () => {
			const onSelectedItemChangeSpy = vi.fn();
			render(
				<Component
					{...defaultProps}
					onSelectedItemChange={onSelectedItemChangeSpy}
				/>
			);

			const [first] = screen.queryAllByRole("option");
			await user.click(first);

			const options = screen.queryAllByRole("option");
			expect(options).toHaveLength(0);
		});

		it("calls handler when user picks an item (by pressing enter)", async () => {
			const onSelectedItemChangeSpy = vi.fn();
			render(
				<Component
					{...defaultProps}
					onSelectedItemChange={onSelectedItemChangeSpy}
				/>
			);

			await act(async () => {
				await user.type(screen.getByRole("combobox"), "Alice{enter}");
			});

			const expected = { label: "Alice", value: "item-1" };
			expect(onSelectedItemChangeSpy).toHaveBeenCalledTimes(1);
			expect(onSelectedItemChangeSpy).toHaveBeenCalledWith(expected);
		});

		it("calls handler when user picks an item (by pressing down and enter)", async () => {
			const onSelectedItemChangeSpy = vi.fn();
			render(
				<Component
					{...defaultProps}
					onSelectedItemChange={onSelectedItemChangeSpy}
				/>
			);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			for await (const i of [1, 2]) {
				await act(async () => {
					await user.type(screen.getByRole("combobox"), "{ArrowDown}");
				});
			}
			await act(async () => {
				await user.type(screen.getByRole("combobox"), "{Enter}");
			});

			const expected = { label: "Bob", value: "item-2" };
			expect(onSelectedItemChangeSpy).toHaveBeenCalledTimes(1);
			expect(onSelectedItemChangeSpy).toHaveBeenCalledWith(expected);
		});
	});

	describe("keyboard", () => {
		it("uses up/down arrows to select item", async () => {
			render(<Component {...defaultProps} />);
			const options = screen.queryAllByRole("option");

			for await (const i of [1, 2, 3, 4]) {
				await act(async () => {
					await user.type(screen.getByRole("combobox"), "{ArrowDown}");
				});
				expect(options[i - 1]).toHaveAttribute("aria-selected", "true");
			}

			for await (const i of [3, 2, 1]) {
				await act(async () => {
					await user.type(screen.getByRole("combobox"), "{ArrowUp}");
				});
				expect(options[i - 1]).toHaveAttribute("aria-selected", "true");
			}
		});

		it("wraps when gets to end of list", async () => {
			render(<Component {...defaultProps} />);
			const options = screen.queryAllByRole("option");
			for await (const i of [1, 2, 3, 4]) {
				await act(async () => {
					await user.type(screen.getByRole("combobox"), "{ArrowDown}");
				});
				expect(options[i - 1]).toHaveAttribute("aria-selected", "true");
			}

			await act(async () => {
				await user.type(screen.getByRole("combobox"), "{ArrowDown}");
			});
			expect(options[0]).toHaveAttribute("aria-selected", "true");
		});

		it("resets combo box when user clicks Escape", async () => {
			const onInputValueChangeSpy = vi.fn();
			render(
				<Component
					{...defaultProps}
					onInputValueChange={onInputValueChangeSpy}
				/>
			);
			await act(async () => {
				await user.type(screen.getByRole("combobox"), "Alice{Escape}");
			});

			const options = screen.queryAllByRole("option");
			expect(options).toHaveLength(0);
			const input = screen.getByRole("combobox");
			expect(input).toHaveValue("");
			expect(input).not.toHaveAttribute("aria-activedescendant");
			expect(onInputValueChangeSpy).toHaveBeenLastCalledWith();
		});
	});

	describe("aria", () => {
		it("label", () => {
			render(<Component {...defaultProps} />);

			const label = screen.getByText("Choose");
			expect(label).toHaveAttribute("id", "foobar-label");
			expect(label).toHaveAttribute("for", "foobar-combobox");
		});

		describe("input", () => {
			it("default props", () => {
				render(<Component {...defaultProps} />);

				const input = screen.getByRole("combobox");
				expect(input).toHaveAttribute("id", "foobar-combobox");
				expect(input).toHaveAttribute("aria-autocomplete", "list");
				expect(input).toHaveAttribute("autocomplete", "off");
				expect(input).not.toHaveAttribute("aria-activedescendant");
			});

			it("when no placeholder/label, expects a visible element", () => {
				render(<Component {...defaultProps} />);

				const input = screen.getByRole("combobox");
				expect(input).toHaveAttribute("aria-labelledby", "foobar-label");
			});

			it("with explicit placeholder", () => {
				render(<Component {...defaultProps} label="Foobar placeholder" />);

				const input = screen.getByRole("combobox");
				expect(input).toHaveAccessibleName("Foobar placeholder");
			});

			it("with explicit label", () => {
				render(<Component {...defaultProps} label="Foobar label" />);

				const input = screen.getByRole("combobox");
				expect(input).toHaveAccessibleName("Foobar label");
			});

			it("when the menu is open there's a aria-controls", async () => {
				render(<Component {...defaultProps} initialIsOpen={false} />);

				await act(async () => {
					await user.click(screen.getByRole("button"));
				});

				const input = screen.getByRole("combobox");
				expect(input).toHaveAttribute("aria-controls", "foobar-menu");
				const button = screen.getByRole("button");
				expect(button).toHaveAttribute("aria-controls", "foobar-menu");
			});
		});

		it("button", () => {
			render(<Component {...defaultProps} />);

			const button = screen.getByText("Toggle");
			expect(button).toHaveAttribute("id", "foobar-toggle-button");
			expect(button).toHaveAttribute("tabindex", "-1");
			expect(button).toHaveAttribute("type", "button");
		});

		it("menu", () => {
			render(<Component {...defaultProps} />);

			const menu = screen.getByRole("listbox");
			expect(menu).toHaveAttribute("id", "foobar-menu");
			expect(menu).toHaveAttribute("aria-labelledby", "foobar-label");
		});

		it("item", () => {
			render(<Component {...defaultProps} />);

			const options = screen.queryAllByRole("option");
			expect(options).toHaveLength(4);
			expect(options[0]).toHaveAttribute("id", "foobar-option-item-1");
		});

		it("selected item", async () => {
			render(<Component {...defaultProps} />);

			const input = screen.getByRole("combobox");
			await act(async () => {
				await user.type(input, "{ArrowDown}");
			});

			expect(input).toHaveAttribute(
				"aria-activedescendant",
				"foobar-option-item-1"
			);
			const [first] = screen.queryAllByRole("option");
			expect(first).toHaveAttribute("aria-selected", "true");
		});
	});
});

function Component(props: IUseComboBoxArgs<IItem>) {
	const {
		getComboBoxProps,
		getInputProps,
		getItemProps,
		getLabelProps,
		getMenuProps,
		getToggleButtonProps,
		isOpen,
		items,
	} = useComboBox(props);

	return (
		<div>
			<label {...getLabelProps()}>Choose</label>
			<div {...getComboBoxProps()}>
				<input {...getInputProps()} />
				<button {...getToggleButtonProps()}>Toggle</button>
			</div>
			{isOpen && (
				<ul {...getMenuProps()}>
					{items.map((item, index) => (
						<li key={item.label} {...getItemProps({ index, item })}>
							{item.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
