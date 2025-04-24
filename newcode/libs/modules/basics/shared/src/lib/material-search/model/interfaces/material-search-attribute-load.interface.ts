/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * material loading attribute
 */
export interface IMaterialAttributeLoadEntity {
	Property: string;
	Value: string;
}

/**
 * node value interface
 */
export interface IMaterialAttributeNodeLoadEntity {
	property: string,
	values: IMaterialAttributeValueLoadEntity[]
	finish: boolean
}

/**
 * node value interface
 */
export interface IMaterialAttributeValueLoadEntity {
	value: string,
	checked: boolean
}