/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase, IEntityIdentification} from '@libs/platform/common';

export interface IEvaluationGroupDataEntity extends IEntityBase, IEntityIdentification{
	Id: number;
	EvaluationFk: number;
	EvaluationGroupFk: number;
	Points: number;
	Evaluation: number;
	Total: number;
	Icon?: number | null;
	Remark?: string;
	PointsPossible: number;
	PointsMinimum: number;
	Weighting: number;
	WeightingGroup: number;
	GroupDescription?: string;
	CommentText?: string;
	IconCommentText?: string | null;
	IsOptional?: boolean;
	IsEditable?: boolean;
	IsMultiSelect?: boolean;
	PId?: number;
	HasChildren: boolean;
	IsEvaluationSubGroupData: boolean;
	GroupSorting: number;
	roupOrder?: string;
	Formula?: string;
	ParentGroupSorting?: number;
	ChildrenItem?: IEvaluationGroupDataEntity[];
	EvalPermissionObjectInfo?: string;
	isCreateByModified?: boolean;
}
