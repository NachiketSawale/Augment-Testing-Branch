/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

export interface IData {
	limits?: any;
	mandatory?: boolean;
	datatype?: string;
	regex?: string;
	regexTemplate?: string;
	defaultWidth?: number;
	searchable?: boolean;
	image?: string;
	genericGrouping?: boolean;
	model?: string;
	format?: string;
	precision?: number;
	disallowNegative?: boolean;
	extendedDomain?: string;
	nameExtension?: string;
	regexDecimal?: string;
	baseUnit?: string;
	destinationUnit?: string[];
	alternativeUnits?: string[][];
	isFraction?: boolean;
	readonly?: boolean;
	isTransient?: boolean;
	regexFraction?: string;
}
export interface IDomainData {
	[x: string]: IData;
	code: IData;
	numcode: IData;
	multicode: IData;
	description: IData;
	comment: IData;
	remark: IData;
	text: IData;
	translation: IData;
	date: IData;
	dateutc: IData;
	datetime: IData;
	datetimeutc: IData;
	time: IData;
	timeutc: IData;
	durationsec: IData;
	integer: IData;
	money: IData;
	quantity: IData;
	uomquantity: IData;
	linearquantity: IData;
	convert: IData;
	imperialft: IData;
	factor: IData;
	exchangerate: IData;
	percent: IData;
	decimal: IData;
	boolean: IData;
	history: IData;
	password: IData;
	buttoninput: IData;
	telephonefax: IData;
	fax: IData;
	phone: IData;
	email: IData;
	radio: IData;
	optiongroup: IData;
	tristatecheckbox: IData;
	colorpicker: IData;
	color: IData;
	lookup: IData;
	url: IData;
	select: IData;
	inputselect: IData;
	directive: IData;
	image: IData;
	customDropDownEdit: IData;
	customDropDown: IData;
	action: IData;
	imageselect: IData;
	marker: IData;
	iban: IData;
	none: IData;
}