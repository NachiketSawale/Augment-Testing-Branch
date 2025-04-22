/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

import { TemplateRef, ViewContainerRef, ViewRef } from '@angular/core';

export interface IDomainControl {
	email: TemplateRef<any>;
	color: TemplateRef<any>;
	date: TemplateRef<any>;
	iban: TemplateRef<any>;
	code: TemplateRef<any>;
	container: ViewContainerRef;

	domainAttr: string;

	modelAttr: any;
	optionsAttr: IOptionsAttr;
	ngModelAttr: any;
	placeholderAttr: string;
	maxLengthAttr: string | number;
	platformAutofocus: boolean;
	grid: boolean;
	regexAttr: string;
	configAttr: any; //not sure about type as data is not available
	decimalPlacesAttr: string;
	mandatoryAttr: boolean;
	modelOptionsAttr: object;
	cssClass: string;
	ngModelOptionsAttr: object;
	readonlyAttr: string;
	entityAttr: object;
	tabstopAttr: string;
	keydown: () => void;
	keyup: () => void;
	enterstopAttr: boolean;
	uomAttr: string;
	fractionAttr: string;
	autofocusAttr: number;
	styleAttr: string;
	id: string;
	gridAttr: boolean;
	inGrid: boolean;
	config: object;
	options: object;
	domain: IData;
	cssList: string;
	controlFlag: string;
	ngModel: string;
	controlValidation: boolean;
	gridControlKeyHandler: boolean;
	isDisabled: string | boolean;

	setAttributes: () => void;
	createView: () => void;
	insertViewToContainer: (view: ViewRef) => void;
}
export interface IOptionsAttr {
	decimalPlaces?: string;
	cssClass?: string;
	disablePopup?: boolean;
	infoText?: string;
	labelText?: string;
	ctrlId?: number;
	id?: string;
	template?: string;
	title?: string;
	containerType?: string;
	uuid?: string;
	permission?: string;
	customOptions?: object;
}

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
export interface IRadioOptions {
	items: IRadioItems[];
	valueMember: string;
	labelMember: string;
	showImage: boolean;
	viewValue: number;
	groupName: string;
}

export interface IRadioItems {
	Description: string;
	Id: number;
	sorting: number;
	isLive: boolean;
	isDefault: boolean | null;
	icon: number;
	[x: string]: string | number | boolean | null;
}

export interface IComposite {
	model: string;
	type: string;
	fill: boolean;
	label?: string;
	label$tr$?: string;
}

export interface ICustomCss {
	width: string;
	left: string;
	top: string;
	bottom: string;
	height: string;
	maxHeight: string;
	right: string;
}

export interface ISettingsStyle {
	settings: ISettings;
	item: IItems;
}

export interface ISettings {
	align: IAlign;
	level: number;
}

export interface IAlign {
	bottom: boolean;
	up: boolean;
	left: boolean;
	right: boolean;
}
export interface IItems {
	image: boolean;
	items: IListItems[];
	tooltip: boolean;
	useLocalIcons: boolean;
}

export interface IListItems {
	Id?: number;
	Sorting?: number;
	Description: string;
	Language?: string;
	Culture?: string;
	id?: boolean;
	res: string;
	toolTip?: string;
}
