/*
 * Copyright(c) RIB Software GmbH
 */


import { IGridConfiguration } from '@libs/ui/common';

export interface IGridConfig<T extends object> {
	title: string;
	size: number;
	showContainer: boolean;
	gridConfig: IGridConfiguration<T>;
	onSelectionChanged?: (selectedRows: T[]) => void;
}


export interface ISizeConfig {
	mainSize: number;
	branchSize: number;
	contractsSize: number;
	guarantorSize: number;
}