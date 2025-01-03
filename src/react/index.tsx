import { useComboBox } from "..";

interface IProps {
	items: { label: string }[];
}

function ComboBox(props: IProps) {
	const { items: availableItems } = props;

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
		items: availableItems,
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

function App() {
	const items = [
		{ label: "Apple" },
		{ label: "Banana" },
		{ label: "Orange" },
		{ label: "Pineapple" },
		{ label: "Kiwi" },
		{ label: "Strawberry" },
		{ label: "Grapes" },
	];

	return (
		<div>
			<ComboBox items={items} />
		</div>
	);
}

export default App;
