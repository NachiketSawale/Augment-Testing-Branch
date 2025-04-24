/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface componentSchema {
	name: string;
	project: string;
	style: string;
	nostory: boolean;
	addOn: boolean;
}

export interface nameSet {
	name: string;
	className: string;
	propertyName: string;
	constantName: string;
	fileName: string;
}
