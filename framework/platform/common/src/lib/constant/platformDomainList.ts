
interface IDomain {
	datatype?: string;
	regex?: string;
	regexFraction?: string;
	regexDecimal?: string;
	regexTemplate?: string;
	baseUnit?: string;
	destinationUnit?: string[];
	alternativeUnits?: string[][];
	isFraction?: boolean;
	defaultWidth?: number;
	searchable?: boolean;
	image?: string;
	genericGrouping?: boolean;
	format?: string;
	precision?: number;
	model?: string;
	disallowNegative?: boolean;
	extendedDomain?: string;
	nameExtension?: string;
	readonly?: boolean;
	isTransient?: boolean;
}
export const platformDomainList: {
	[name: string]: IDomain
} = {
	code: {
		datatype: 'string',
		regex: '^[\\s\\S]{0,16}$',
		regexTemplate: '^[\\s\\S]{0,@@maxLength}$',
		defaultWidth: 100,
		searchable: true,
		image: 'control-icons ico-domain-code',
		genericGrouping: true,
	},
	numcode: {
		datatype: 'string',
		regex: '^[\\d]{0,16}$',
		regexTemplate: '^[\\d]{0,@@maxLength}$',
		defaultWidth: 100,
		searchable: true,
		image: 'control-icons ico-domain-code',
		genericGrouping: true,
	},
	multicode: {
		datatype: 'multicode',
		regex: '^[\\s\\S]{0,255}$',
		defaultWidth: 150,
		searchable: true,
		image: 'control-icons ico-domain-code',
		genericGrouping: true,
	},
	description: {
		datatype: 'string',
		regex: '^[\\s\\S]{0,42}$',
		regexTemplate: '^[\\s\\S]{0,@@maxLength}$',
		defaultWidth: 200,
		searchable: true,
		image: 'control-icons ico-domain-description',
		genericGrouping: true,
	},
	comment: {
		datatype: 'string',
		regex: '^[\\s\\S]{0,255}$',
		regexTemplate: '^[\\s\\S]{0,@@maxLength}$',
		defaultWidth: 200,
		searchable: true,
		image: 'control-icons ico-domain-comment',
		genericGrouping: true,
	},
	remark: {
		datatype: 'string',
		regex: '^[\\s\\S]{0,2000}$',
		regexTemplate: '^[\\s\\S]{0,@@maxLength}$',
		defaultWidth: 200,
		searchable: true,
		image: 'control-icons ico-domain-remark',
	},
	text: {
		datatype: 'string',
		defaultWidth: 200,
		searchable: true,
		image: 'control-icons ico-domain-text',
	},
	translation: {
		datatype: 'string',
		regex: '^[\\s\\S]{0,42}$',
		regexTemplate: '^[\\s\\S]{0,@@maxLength}$',
		model: 'Translated',
		searchable: true,
		defaultWidth: 200,
		image: 'control-icons ico-domain-translation',
	},
	date: {
		datatype: 'date',
		format: 'L',
		defaultWidth: 100,
		image: 'control-icons ico-domain-date',
		genericGrouping: true,
	},
	dateutc: {
		datatype: 'dateutc',
		format: 'L',
		defaultWidth: 100,
		image: 'control-icons ico-domain-date',
		genericGrouping: true,
	},
	datetime: {
		datatype: 'datetime',
		format: 'L LT',
		defaultWidth: 150,
		image: 'control-icons ico-domain-date-time',
		genericGrouping: true,
	},
	datetimeutc: {
		datatype: 'datetimeutc',
		format: 'L LT',
		defaultWidth: 150,
		image: 'control-icons ico-domain-date-time',
		genericGrouping: true,
	},
	time: {
		datatype: 'time',
		format: 'LT',
		defaultWidth: 75,
		image: 'control-icons ico-domain-time',
		genericGrouping: true,
	},
	timeutc: {
		datatype: 'timeutc',
		format: 'LT',
		defaultWidth: 75,
		image: 'control-icons ico-domain-time',
		genericGrouping: true,
	},
	durationsec: {
		datatype: 'duration',
		regex: '^([\\d]*[\\s]{0,1})([\\d]{0,2})(([\\:]{1})([\\d]{0,2})){0,2}$',
		format: 'seconds',
		defaultWidth: 75,
		image: 'control-icons ico-domain-time',
		genericGrouping: true,
	},
	integer: {
		datatype: 'integer',
		regex: '^[+-]?\\d*$',
		precision: 0,
		defaultWidth: 75,
		image: 'control-icons ico-domain-integer',
		genericGrouping: true,
		disallowNegative: true,
	},
	money: {
		datatype: 'numeric',
		precision: 2,
		regex: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s]{0,1}\\d+)*)([,\\.][\\d]{0,2})$)',
		defaultWidth: 100,
		image: 'control-icons ico-domain-money',
		genericGrouping: true,
		disallowNegative: true,
	},
	quantity: {
		datatype: 'numeric',
		precision: 3,
		regex: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s]{0,1}\\d+)*)([,\\.][\\d]{0,3})$)',
		defaultWidth: 100,
		image: 'control-icons ico-domain-quantity',
		genericGrouping: true,
		disallowNegative: true,
	},
	uomquantity: {
		extendedDomain: 'convert',
		nameExtension: 'uom',
		datatype: 'numeric',
		precision: 3,
		regex: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s]{0,1}\\d+)*)([,\\.][\\d]{0,3})$)',
		defaultWidth: 100,
		image: 'control-icons ico-domain-quantity',
		genericGrouping: true,
		disallowNegative: true,
	},
	linearquantity: {
		extendedDomain: 'imperialft',
		nameExtension: 'ft',
		datatype: 'numeric',
		precision: 3,
		regex: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s]{0,1}\\d+)*)([,\\.][\\d]{0,3})$)',
		defaultWidth: 100,
		image: 'control-icons ico-domain-quantity',
		genericGrouping: true,
		disallowNegative: true,
	},
	convert: {
		datatype: 'convert',
		precision: 4,
		regex: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.]{0,1}\\d+)*)([,\\.][\\d]{0,3})$)',
		regexFraction: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.]{0,1}\\d+)*)([,\\.][\\d]{0,3})$)|(^([+-]?)(\\d+\\s){0,1}(\\d*[\\/:]{0,1}[\\d]{0,4})?$)',
		// eslint-disable-next-line no-useless-escape
		regexDecimal: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,.]{0,1}\\d+)*)([,\\.][\\d]{0,4})$)',
		defaultWidth: 100,
		image: 'control-icons ico-domain-quantity',
		genericGrouping: true,
		disallowNegative: true,
	},
	imperialft: {
		datatype: 'imperialft',
		precision: 4,
		// eslint-disable-next-line no-useless-escape
		regex: '(^((\\d+\\s)?\\d*((\\/|:)\\d*)?((f?(?<=f)t?)|\')?)?((?<=ft|\')\\s)?((\\d+\\s)?\\d*((\\/|:)\\d*)?((i?(?<=i)n?)|&#34)?)?$)',
		defaultWidth: 100,
		baseUnit: 'm',
		destinationUnit: ['ft', 'in'],
		alternativeUnits: [['\'', '"']],
		isFraction: true,
		genericGrouping: true,
		disallowNegative: true,
		image: 'control-icons ico-domain-quantity',
	},
	factor: {
		datatype: 'numeric',
		precision: 6,
		regex: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s]{0,1}\\d+)*)([,\\.][\\d]{0,6})$)',
		defaultWidth: 100,
		image: 'control-icons ico-domain-factor',
		genericGrouping: true,
		disallowNegative: true,
	},
	exchangerate: {
		datatype: 'numeric',
		precision: 5,
		regex: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s]{0,1}\\d+)*)([,\\.][\\d]{0,5})$)',
		defaultWidth: 100,
		image: 'control-icons ico-domain-exchangerate',
		genericGrouping: true,
		disallowNegative: true,
	},
	percent: {
		datatype: 'numeric',
		precision: 2,
		regex: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s]{0,1}\\d+)*)([,\\.][\\d]{0,2})$)',
		defaultWidth: 100,
		image: 'control-icons ico-domain-percent',
		genericGrouping: true,
		disallowNegative: true,
	},
	decimal: {
		datatype: 'numeric',
		precision: 3,
		regex: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s]{0,1}\\d+)*)([,\\.][\\d]{0,3})$)',
		regexTemplate: '(^[+-]?\\d+$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s]{0,1}\\d+)*)([,\\.][\\d]{0,@@decimalPlaces})$)',
		defaultWidth: 100,
		image: 'control-icons ico-domain-percent',
		genericGrouping: true,
		disallowNegative: true,
	},
	boolean: {
		datatype: 'bool',
		defaultWidth: 20,
		image: 'control-icons ico-domain-boolean',
	},
	history: {
		datatype: 'history',
		regex: '^[\\s\\S]{0,255}$',
		defaultWidth: 150,
		image: 'control-icons ico-domain-history',
	},
	password: {
		datatype: 'password',
		regex: '^[\\s\\S]{0,128}$',
		defaultWidth: 150,
		image: 'control-icons ico-domain-password',
	},
	buttoninput: {
		defaultWidth: 150,
		image: 'control-icons ico-domain-buttoninput',
	},
	telephonefax: {
		datatype: 'phone',
		defaultWidth: 150,
		image: 'control-icons ico-domain-telephonefax',
	},
	fax: {
		datatype: 'fax',
		defaultWidth: 150,
		image: 'control-icons ico-domain-telephonefax',
	},
	phone: {
		datatype: 'phone',
		defaultWidth: 150,
		image: 'control-icons ico-domain-telephonefax',
	},
	email: {
		datatype: 'email',
		regex: '^[\\s\\S]{0,64}@?[\\s\\S]{0,253}$',
		searchable: true,
		defaultWidth: 150,
		image: 'control-icons ico-mail-noicon-1',
		genericGrouping: true,
	},
	radio: {
		defaultWidth: 100,
		image: 'control-icons ico-domain-radio',
	},
	optiongroup: {
		defaultWidth: 100,
		image: 'control-icons ico-domain-optiongroup',
	},
	tristatecheckbox: {
		defaultWidth: 20,
		image: 'control-icons ico-domain-checkbox',
	},
	colorpicker: {
		datatype: 'color',
		defaultWidth: 50,
		image: 'control-icons ico-domain-colorpicker',
	},
	color: {
		datatype: 'color',
		defaultWidth: 50,
		image: 'control-icons ico-domain-color',
	},
	lookup: {
		datatype: 'lookup',
		searchable: true,
		defaultWidth: 150,
		image: 'control-icons ico-domain-lookup',
	},
	url: {
		datatype: 'url',
		searchable: true,
		defaultWidth: 150,
		image: 'control-icons ico-web2',
		genericGrouping: true,
	},
	select: {
		datatype: 'select',
		defaultWidth: 75,
		image: 'control-icons ico-domain-select',
	},
	inputselect: {
		datatype: 'inputselect',
		defaultWidth: 100,
		image: 'control-icons ico-domain-inputselect',
	},
	directive: {
		datatype: 'directive',
		defaultWidth: 150,
		image: 'control-icons ico-domain-directive',
	},
	image: {
		datatype: 'image',
		defaultWidth: 50,
		image: 'control-icons ico-domain-image',
	},
	customDropDownEdit: {
		defaultWidth: 75,
		image: 'control-icons ico-domain-dropdownedit',
	},
	customDropDown: {
		defaultWidth: 75,
		image: 'control-icons ico-domain-dropdown',
	},
	action: {
		datatype: 'action',
		defaultWidth: 75,
		readonly: true,
		image: 'control-icons ico-domain-action',
	},
	imageselect: {
		datatype: 'imageselect',
		defaultWidth: 100,
		image: 'control-icons ico-domain-imageselect',
	},
	marker: {
		datatype: 'marker',
		defaultWidth: 20,
		isTransient: true,
		image: 'control-icons ico-domain-marker',
	},
	iban: {
		datatype: 'iban',
		defaultWidth: 100,
		regex: '^[\\s\\S]{0,42}$',
		image: 'control-icons ico-domain-iban',
	},
	none: {
		datatype: 'none',
		readonly: true,
	},
};
