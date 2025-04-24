/*
 * Copyright(c) RIB Software GmbH
 */

import { IBisDpTimeintervalEntity, IBisPrjClassificationEntity } from '@libs/controlling/structure';
import { IControllingProjectcontrolsCostAnalysisEntity } from './controlling-projectcontrols-cost-analysis-entity.class';
import { IContrGroupColumn } from '../controlling-projectcontrols-cost-analysis-request.interface';

export interface IGroupingConfig {
	Generic: boolean;
	MaxLevels: number;
}

export interface IGroupingMetaData {
	GroupId: number;
	GroupColumnName: string;
	GroupType: number;
	MaxLevels: number;
}

export interface IGroupingType {
	Id: string;
	Formatter: string;
	Domain: string;
	Field: string;
	Name: string;
	Name$tr$: string;
	Width: number;
	Readonly: boolean;
	Aggregation: boolean;
	IsDefault: boolean;
	Grouping: IGroupingConfig;
	Metadata: IGroupingMetaData;
	State?: groupSate;
	Dateoption?: string;
	Depth?: number;
	SortDesc?: number;
}

export interface IValueDetail {
	Value: string;
	ValueDetail: string;
}

export interface ITimeIntervalListRequest {
	ProjectId: number;
	HistoryNo: number;
	HistoryId: number;
}

export interface ITimeIntervalListResponse {
	TimeIntervalList: IBisDpTimeintervalEntity[];
	PrjClassfications: Map<number, IBisPrjClassificationEntity>[];
}

export interface IGroupingStructureInfoResponse {
	CostAnalysis: IControllingProjectcontrolsCostAnalysisEntity[];
	StructureInfo: IContrGroupColumn[];
}

export interface IFormatteredPeriod {
	Id: string;
	Value: string;
	Description: string;
}

export interface IFormatteredHistory {
	Value: number;
	Description: string;
	RibPrjHistroyKey: number;
}

export interface IColorOption {
	Color: string;
	Enabled: boolean;
}

export interface IGroupingstate {
	Id: string;
	Levels: number;
	Depth: number;
	Grouping: number;
	Metadata: IGroupingMetaData;
	ColorOptions?: IColorOption;
}

export const ProjectControlsGroupingType: IGroupingType[] = [
	{
		Id: 'ControllingUnit',
		Formatter: 'integer',
		Domain: 'integer',
		Field: 'controllingunit',
		Name: 'Controlling Unit',
		Name$tr$: 'controlling.projectcontrols.controllingUnit',
		Width: 120,
		Readonly: true,
		Aggregation: false,
		IsDefault: true,
		Grouping: {
			Generic: true,
			MaxLevels: 8,
		},
		Metadata: {
			GroupId: 1,
			GroupColumnName: 'REL_CO',
			GroupType: 3,
			MaxLevels: 8,
		},
	},
	{
		Id: 'Activity',
		Formatter: 'integer',
		Domain: 'integer',
		Field: 'activity',
		Name: 'Activity',
		Name$tr$: 'controlling.projectcontrols.activity',
		Width: 120,
		Readonly: true,
		Aggregation: false,
		IsDefault: false,
		Grouping: {
			Generic: true,
			MaxLevels: 8,
		},
		Metadata: {
			GroupId: 2,
			GroupColumnName: 'REL_ACTIVITY',
			GroupType: 3,
			MaxLevels: 8,
		},
	},
	{
		Id: 'CostCode',
		Formatter: 'integer',
		Domain: 'integer',
		Field: 'costcode',
		Name: 'Cost Code',
		Name$tr$: 'controlling.projectcontrols.costCode',
		Width: 120,
		Readonly: true,
		Aggregation: false,
		IsDefault: false,
		Grouping: {
			Generic: true,
			MaxLevels: 8,
		},
		Metadata: {
			GroupId: 3,
			GroupColumnName: 'REL_COSTCODE',
			GroupType: 3,
			MaxLevels: 8,
		},
	},
	{
		Id: 'ControllingUnitCostCode',
		Formatter: 'integer',
		Domain: 'integer',
		Field: 'controllingcostcode',
		Name: 'Controlling Cost Code',
		Name$tr$: 'controlling.projectcontrols.controllingUnitCostCode',
		Width: 120,
		Readonly: true,
		Aggregation: false,
		IsDefault: false,
		Grouping: {
			Generic: true,
			MaxLevels: 8,
		},
		Metadata: {
			GroupId: 4,
			GroupColumnName: 'REL_COSTCODE_CO',
			GroupType: 3,
			MaxLevels: 8,
		},
	},
	{
		Id: 'BoQ',
		Formatter: 'integer',
		Domain: 'integer',
		Field: 'boq',
		Name: 'BoQ',
		Name$tr$: 'controlling.projectcontrols.boQ',
		Width: 120,
		Readonly: true,
		Aggregation: false,
		IsDefault: false,
		Grouping: {
			Generic: true,
			MaxLevels: 8,
		},
		Metadata: {
			GroupId: 5,
			GroupColumnName: 'REL_BOQ',
			GroupType: 3,
			MaxLevels: 8,
		},
	},
	{
		Id: 'CostGroup1',
		Formatter: 'integer',
		Domain: 'integer',
		Field: 'costgroup1',
		Name: 'Classification1',
		Name$tr$: 'controlling.projectcontrols.costGroup1',
		Width: 120,
		Readonly: true,
		Aggregation: false,
		IsDefault: false,
		Grouping: {
			Generic: true,
			MaxLevels: 8,
		},
		Metadata: {
			GroupId: 9,
			GroupColumnName: 'REL_CLASSIFICATION_1',
			GroupType: 3,
			MaxLevels: 8,
		},
	},
	{
		Id: 'CostGroup2',
		Formatter: 'integer',
		Domain: 'integer',
		Field: 'costgroup2',
		Name: 'Classification2',
		Name$tr$: 'controlling.projectcontrols.costGroup2',
		Width: 120,
		Readonly: true,
		Aggregation: false,
		IsDefault: false,
		Grouping: {
			Generic: true,
			MaxLevels: 8,
		},
		Metadata: {
			GroupId: 9,
			GroupColumnName: 'REL_CLASSIFICATION_2',
			GroupType: 3,
			MaxLevels: 8,
		},
	},
	{
		Id: 'CostGroup3',
		Formatter: 'integer',
		Domain: 'integer',
		Field: 'costgroup3',
		Name: 'Classification3',
		Name$tr$: 'controlling.projectcontrols.costGroup3',
		Width: 120,
		Readonly: true,
		Aggregation: false,
		IsDefault: false,
		Grouping: {
			Generic: true,
			MaxLevels: 8,
		},
		Metadata: {
			GroupId: 9,
			GroupColumnName: 'REL_CLASSIFICATION_3',
			GroupType: 3,
			MaxLevels: 8,
		},
	},
	{
		Id: 'CostGroup4',
		Formatter: 'integer',
		Domain: 'integer',
		Field: 'costgroup4',
		Name: 'Classification4',
		Name$tr$: 'controlling.projectcontrols.costGroup4',
		Width: 120,
		Readonly: true,
		Aggregation: false,
		IsDefault: false,
		Grouping: {
			Generic: true,
			MaxLevels: 8,
		},
		Metadata: {
			GroupId: 9,
			GroupColumnName: 'REL_CLASSIFICATION_4',
			GroupType: 3,
			MaxLevels: 8,
		},
	},
];

export type groupSate = {
	id: number;
};

export type group = {
	cid: string;
	type?: string;
	state: groupSate;
};

export type formatter = { id: number };
