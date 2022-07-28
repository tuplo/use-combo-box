<br />
<div align="center">
  <img src="logo.png" alt="Logo" width="120" height="120">
  <h1 align="center">combhook</h3>
  <p align="center">Headless combobox hook for React</p>
  <p align="center">
    <img src="https://img.shields.io/npm/v/@tuplo/combhook">
    <img src="https://img.shields.io/bundlephobia/minzip/@tuplo/combhook">
  	 <a href="https://codeclimate.com/github/tuplo/combhook/test_coverage"><img src="https://api.codeclimate.com/v1/badges/3960dc58d920755d77a0/test_coverage" /></a>
  	 <img src="https://github.com/tuplo/combhook/actions/workflows/build.yml/badge.svg">
  </p>
</div>

## Why

We used `downshift` but it was too heavy for our needs.

* No dependencies
* Tiny footprint (2.3K)
* WAI-ARIA compliant
* Keyboard navigation	 

## Install

```bash
$ npm install @tuplo/combhook

# or with yarn
$ yarn add @tuplo/combhook
```

## Usage

Minimal example

```jsx
import { useComboBox } from '@tuplo/combhook'

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
    id: 'my-combo-box',
    onSelectedItemChange: (item) => console.log(item)
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
  id: 'my-combo-box',
  items: [{ id: 1, label: 'Alice' }, { id: 2, label: 'Bob' }],
  itemToString: (item) => item.id,
  filterFn: async (keyword, items) => items.filter(item => item.label.includes(keyword)),
  onInputValueChange: (value) => console.log(value),
  onSelectedItemChange: (item) => console.log(item),
  placeholder: 'Choose name',
});
```

### id

> `string` | required

Unique identifier for this widget. It's used to build IDs for all child elements.

### items

> `ItemType[]` | optional

List of initial items to show on menu. When empty, the list is populated by the return value of `filterFn`.

### itemToString

> `(item: ItemType) => string` | defaults to `JSON.stringify(item)`

If your items are stored as objects, this function is used to create unique IDs for each option.

### filterFn

> `(keyword: string, items: ItemType[]) => Promise<ItemType[]>` | optional

A custom function to be called when filtering the list of items according to the keyword typed in by the user.

### onInputValueChange

> `(value: string) => void` | optional

Callback to be used when user changes the input value on the textbox.

### onSelectedItemChange

> `(item: ItemType) => void` | required

Callback to be used when user picks an item.

### placeholder

> `string` | optional

To be used as placeholder text on the textbox.

## License

MIT
