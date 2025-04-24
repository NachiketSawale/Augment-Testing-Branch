/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * material range returns with material search http
 */
export interface IMaterialAttributeRangeEntity {
	Max: number;
	Min: number;
	Value: [number, number];
}
/**
 * material range for http response and request
 */
export interface IMaterialAttributeRangeMinMaxEntity {
	MaxValue: number;
	MinValue: number;
}