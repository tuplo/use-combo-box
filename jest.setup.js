import "@testing-library/jest-dom";

Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", {
	get() {
		return true;
	},
	set() {},
});
