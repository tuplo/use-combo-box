<br />
<div align="center">
  <img src="docs/logo.png" alt="Logo" width="120" height="120">
  <h1 align="center">use-combo-box</h3>
  <p align="center">Headless combo-box hook for React</p>
  <p align="center">
    <img src="https://img.shields.io/npm/v/@tuplo/use-combo-box">
    <img src="https://img.shields.io/bundlephobia/minzip/@tuplo/use-combo-box">
  	<a href="https://codeclimate.com/github/tuplo/use-combo-box/test_coverage"><img src="https://api.codeclimate.com/v1/badges/309c1f1e7ab197b5453e/test_coverage" /></a>
  </p>
</div>

## Why

We tried `downshift` but it was too heavy for our needs.

- No dependencies
- Tiny footprint (1.12 kB)
- WAI-ARIA compliant, implements the [Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- Keyboard navigation

## Install

```bash
$ npm install @tuplo/use-combo-box

# or with yarn
$ yarn add @tuplo/use-combo-box
```

## Usage

Minimal example

```jsx
import { useComboBox } from "@tuplo/use-combo-box";

function ComboBox() {
  const {
    getComboBoxProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    getToggleButtonProps,
    items,
  } = useComboBox({
    id: "my-combo-box",
    onSelectedItemChange: (item) => console.log(item),
  });

  return (
    <div>
      <label {...getLabelProps()}>Choose</label>
      <div {...getComboBoxProps()}>
        <input {...getInputProps()} />
        <button {...getToggleButtonProps()}>Toggle</button>
      </div>
      <ul {...getMenuProps()}>
        {items.map((item, index) => (
          <li key={item.label} {...getItemProps({ item, index })}>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Options

```typescript
const comboBoxProps = useComboBox({
  filterFn: async (keyword, items) =>
    items.filter((item) => item.label.includes(keyword)),
  id: "my-combo-box",
  initialIsOpen: true,
  items: [
    { id: "item-1", label: "Alice" },
    { id: "item-2", label: "Bob" },
  ],
  itemToString: (item) => item.id,
  label: "Team members",
  onInputValueChange: (value) => console.log(value),
  onSelectedItemChange: (item) => console.log(item),
  placeholder: "Choose team member",
  selectedValues: ["item-1", "item-2"]
});
```

### filterFn

> `(keyword: string, items: ItemType[]) => Promise<ItemType[]>` | optional

A custom function to be called when filtering the list of items according to the keyword typed in by the user.

### id

> `string` | required

Unique identifier for this widget. It's used to build IDs for all child elements.

### initialIsOpen

> `boolean` | optional

Sets the open state of the menu when the combo-box is initialized.

### itemToString

> `(item: ItemType) => string` | defaults to `JSON.stringify(item)`

If your items are stored as objects, this function is used to create unique IDs for each option.

### items

> `ItemType[]` | optional

List of initial items to show on menu. When empty, the list is populated by the return value of `filterFn`.

### label

> `string` | optional

Explicit value to be used on `aria-label`.

### onInputValueChange

> `(value: string) => void` | optional

Callback to be used when user changes the input value on the textbox.

### onSelectedItemChange

> `(item: ItemType) => void` | required

Callback to be used when user picks an item.

### placeholder

> `string` | optional

To be used as placeholder text on the textbox.

### selectedValue

> `string` | optional

The selected value. Makes it a single-selection combo-box.

### selectedValues

> `string[]` | optional

List of selected values. Makes it a multi-selection combo-box.

## License

MIT
