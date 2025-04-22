/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Filter Script Custom Defined Method Parameter Type
 */
type FilterScriptDefMethodParam = {
	name: string;
	type: string;
}

/**
 * Filter Script Custom Defined Method Type
 */
export type FilterScriptDefOptionMethod = {
	name: string;
	paramCount: number;
	params: FilterScriptDefMethodParam[];
	resultType: string;
	text: string;
	description: string;
}

export type FilterScriptDefParameter = {
	text : string;
	description : string;
}

/**
 * Filter Script Custom Defined Property Type
 */
export type FilterScriptDefOptionProperty = {
	type : number;
	name : string;
	text : string;
	description : string;
	source : string;
}

export class FilterScriptDef {
	public methods : { [k : string] : FilterScriptDefOptionMethod} = {};
	public operators : string[] = [];
	public keywords : string[] = [];
	public ov : string[] = [];
	public propertyTypes : string[] = [];
	public atom : string[] = [];
}

/**
 * Filter Script Custom Defined Hint Message Detail
 */
export class FilterScriptOptionMessageDetail {
	public keyPath : string = '';
	public description : string = '';
}

/**
 * Filter Script Custom Defined Hint Message
 */
export type FilterScriptDefOptionMessage = {
	propertyNameUndefined : FilterScriptOptionMessageDetail;
	propertyNameError : FilterScriptOptionMessageDetail;
	variableNameUndefined : FilterScriptOptionMessageDetail;
	variableNameError : FilterScriptOptionMessageDetail;
	notSupport : FilterScriptOptionMessageDetail;
	missingError : FilterScriptOptionMessageDetail;
	value : FilterScriptOptionMessageDetail;
	operator : FilterScriptOptionMessageDetail;
	syntaxError : FilterScriptOptionMessageDetail;
}

/**
 * Filter Script Option Data
 */
export type FilterScriptDefOptions = {
	filterDef:FilterScriptDef,
	properties: FilterScriptDefOptionProperty[],
	messages:FilterScriptDefOptionMessage,
	selectionParameters?:FilterScriptDefParameter[]
}