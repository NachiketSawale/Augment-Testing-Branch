/*
 * Copyright(c) RIB Software GmbH
 */
export interface IDefectHeaderDataProvider<T extends object> {
	refreshOnlySelected(selected: T[]): Promise<T[]>;
}
