/*
 * Copyright(c) RIB Software GmbH
 */

export interface IChartDataEntity {
	Id: number;
	IsSelected: boolean
	ParentId?: number;
	Name: string;
	Value: number | string;
	Type: string;
	Items?: IChartDataEntity[]
}