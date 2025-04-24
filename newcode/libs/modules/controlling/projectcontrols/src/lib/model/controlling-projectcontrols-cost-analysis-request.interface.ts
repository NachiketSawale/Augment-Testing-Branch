/*
 * Copyright(c) RIB Software GmbH
 */

import { IControllingProjectcontrolsCostAnalysisEntity } from './entities/controlling-projectcontrols-cost-analysis-entity.class';
import { IBisPrjClassificationEntity, IBisPrjHistoryInfoEntity } from '@libs/controlling/structure';
import { IMdcContrSacValueEntity } from '@libs/controlling/configuration';

export interface ICostAnalysisRequest {
	ProjectId: number;
	ProjectNo: string;
	ProjectName: string;
	RibHistoryId: number;
	Period: string;
	ShowEmptyData: boolean;
	Module: string;
	// FilterParameter: Map<string, string>[];
	// FilterRequest: FilterRequest<int>[];
	// FilterResponse: FilterResponse<int>[];
	GroupingColumns: IContrGroupColumn[];
	OutputColumns: IContrGroupAggregateColumn[];
	ReportPeriodColumns: IContrGroupAggregateColumn[];
	ForGroupingStructureInfo: boolean;
}

export interface IGroupingStructureInfo {
	StructureId?: number;
	StructureSourceId?: number;
}

export interface IContrGroupColumn {
	Id: number;
	GroupingStructureInfos?: IGroupingStructureInfo[];
	GroupColumnId: string;
	GroupType: number;
	Depth: number;
	SortingBy: number;
	DateOption: string;
}

export interface IContrGroupAggregateColumn {
	PropDefInfo: IPropDefInfo | null;
	OutputColumnName: string;
	Aggregateprivate?: string | null;
	AggregateFunction?: string;
	AggregateFunctionParams?: Map<string, string>[];
	SortingBy: number;
}

export interface IPropDefInfo {
	Type: number;
	Id: number;
	Code: string;
	BasContrColumnTypeFk?: number;
}

export interface ICostAnalysisComposite {
	CostAnalysis: IControllingProjectcontrolsCostAnalysisEntity[];
	CostAnalysisByPeriod: IControllingProjectcontrolsCostAnalysisEntity[];
	PrjClassifications: Map<number, IBisPrjClassificationEntity>;
	stagingActualsValues: IMdcContrSacValueEntity[];
	HistoryInfo: IBisPrjHistoryInfoEntity;
}
