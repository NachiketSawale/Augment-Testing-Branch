/*
 * Copyright(c) RIB Software GmbH
 */

export interface IEstimateResourceFieldValue {
	Id: number;

	id: number;

	displayValue: string;

	isLive: boolean;

	itemValue: number;

   checked?: boolean | null;

	typeKey: number;
}