export const data = {
	newFieldAddItem: [
		{
			itemsData: { id: 1, caption: 'bold', visible: true },
			list: { items: [] },
		},
	],

	item: {
		itemsData: [{ id: 2, caption: 'Italic' }],
		showSVGTag: true,
		svgSprite: 'tlb-wh-icon',
		svgImage: 'ico-menu',
		list: { itemsData: [] },
	},
	changeField: [
		{
			itemsData: [{ id: 2, caption: 'Italic' }],
			list: { itemsData: [{ id: 3, caption: 'Bold' }] },
			disabled: {},
		},
	],
	newCahngeField: {
		itemsData: [{ id: 2, caption: 'Italic' }],
		list: { itemsData: [{ id: 3, caption: 'Bold' }] },
		disabled: {},
	},
	singleField: [{ id: 1, caption: 'bold' }],
	arr: [
		{ id: 8, caption: 'bold' },
		{ id: 4, caption: 'Italic' },
	],
	setField: [
		{
			itemsData: [{ id: 2, caption: 'Italic' }],
			list: { itemsData: [{ id: 3, caption: 'Bold' }] },
			disabled: {},
		},
	],
	updateField: [
		{
			itemsData: [{ id: 2, caption: 'Italic' }],
			list: { itemsData: [{ id: 3, caption: 'Bold' }] },
			disabled: {},
		},
	],
	updateById: [
		{
			itemsData: [{ id: 2, caption: 'Italic' }],
			list: { itemsData: [{ id: 3, caption: 'Bold' }] },
			disabled: {},
		},
	],
	addFieldsByIndex: [
		{
			itemsData: [{ id: 2, caption: 'Italic' }],
			list: { itemsData: [{ id: 3, caption: 'Bold' }] },
			disabled: {},
		},
	],
	caseFields: {
		cssClass: 'btn wysiwyg-tb-bold',
		iconClass: 'fa fa-bold',
		id: 'wysiwyg-tb-bold',
		value: false,
		caption$tr$: 'platform.wysiwygEditor.bold',
		caption: 'platform.wysiwygEditor.bold',
		type: 'check',
		visible: true,
		disabled: false,
		toolTip: '',
		svgImage: '',
		svgSprite: '',
		list:{}
	},
};

export const subfieldMock = {
	itemsData: [{ id: 2, caption: 'Italic' }],
	list: { items: [] },
};

export const ItemData = {
	cssClass: '',
	iconClass: '',
	id: '',
	value: false,
	caption$tr$: '',
	caption: '',
	type: '',
	visible: true,
	disabled: true,
	toolTip: '',
	svgSprite: 'tlb-wh-icons',
	showSVGTag:true,
	svgImage: 'ico-menu',
	popupOptions: {},
	itemFnWrapper: {},
	list: {
		itemFnWrapper:()=> { }
	},
	fn: ()=> { }
};

export const ItemDataElse = {
	cssClass: '',
	iconClass: '',
	id: '',
	value: false,
	caption$tr$: '',
	caption: '',
	type: '',
	visible: true,
	disabled: true,
	toolTip: '',
	svgSprite: 'tlb-wh-icons',
	showSVGTag:true,
	svgImage: 'ico-menu',
	popupOptions: {},
	itemFnWrapper: {},
	list: {},
	fn: ()=> { }
};

export const defaultData = {
	id: '',
	visible: true,
	disabled: false,
	toolTip: '',
	align: 'right',
	ellipsis: false,
	list:{}
};

export const newField = {
	items: [],
	itemsData: [],
};

export const fields = [
	{
		items: [{ id: 2, caption: 'Italic' }],
		itemsData: [{ id: 2, caption: 'Italic' }],
		list: { items: [{ id: 3, caption: 'Bold' }] },
		disabled: {},
	},
];

export const itemsData = [
	{
		items: [{ id: 2, caption: 'Italic' }],
		itemsData: [{ id: 2, caption: 'Italic' }],
	},
];

export const listObj = {
	items: [],
	itemsData: [],
	cssClass: '',
};

export const itemFn = {
	id: 1,
	caption: 'bold',
	fn: () => {},
};

export const listitem = [
	{ id: 2, caption$tr$: 'Italic' },
	{ id: 3, caption$tr$: 'Bold' },
];

export const itemDataArray = [
	{
		cssClass: '',
		iconClass: '',
		id: '',
		value: false,
		caption$tr$: '',
		caption: '',
		list: {
			items: [{ id: 3, list: {} }],
		},
	},
	{
		cssClass: '',
		iconClass: '',
		id: '',
		value: false,
		caption$tr$: '',
		caption: '',
		list: {
			items: [{ id: 3, list: {} }],
		},
	},
];

export const objMock = {
	value: '',
};

export const listArr = {
	id: 'items',
	items: [{ id: 3, list: {} }],
	itemsData: [{ id: 3, list: {} }],
	disabled: false,
	showImages: false,
	cssClass: 'bold-icon',
};
