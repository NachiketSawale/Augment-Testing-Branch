/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

import { Subject } from 'rxjs';

export interface IPlatformdomainService {
	domainChanges: Subject<string>;
	platformDomainList: IDomainData;
	loadDomain(domainName: string): IDomain;
}

export interface IDomain {
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
	[x: string]: IDomain;
	code: IDomain;
	numcode: IDomain;
	multicode: IDomain;
	description: IDomain;
	comment: IDomain;
	remark: IDomain;
	text: IDomain;
	translation: IDomain;
	date: IDomain;
	dateutc: IDomain;
	datetime: IDomain;
	datetimeutc: IDomain;
	time: IDomain;
	timeutc: IDomain;
	durationsec: IDomain;
	integer: IDomain;
	money: IDomain;
	quantity: IDomain;
	uomquantity: IDomain;
	linearquantity: IDomain;
	convert: IDomain;
	imperialft: IDomain;
	factor: IDomain;
	exchangerate: IDomain;
	percent: IDomain;
	decimal: IDomain;
	boolean: IDomain;
	history: IDomain;
	password: IDomain;
	buttoninput: IDomain;
	telephonefax: IDomain;
	fax: IDomain;
	phone: IDomain;
	email: IDomain;
	radio: IDomain;
	optiongroup: IDomain;
	tristatecheckbox: IDomain;
	colorpicker: IDomain;
	color: IDomain;
	lookup: IDomain;
	url: IDomain;
	select: IDomain;
	inputselect: IDomain;
	directive: IDomain;
	image: IDomain;
	customDropDownEdit: IDomain;
	customDropDown: IDomain;
	action: IDomain;
	imageselect: IDomain;
	marker: IDomain;
	iban: IDomain;
	none: IDomain;
}
