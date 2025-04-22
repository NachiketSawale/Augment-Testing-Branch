/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Properties for entity status lookup.
 */
export interface IEntityStatusName {
	StatusName: string;
	ObjectTableName: string;
	StatusTableName: string;
	HasIcon: boolean;
	HasOpticalIndicator: boolean;
	HasIsReadonly: boolean;
	HasRoleTable: boolean;
	HasWorkflow: boolean;
	IsObjectIdInt64: boolean;
	RoleTableName: string | null;
	RuleTableName: string | null;
	WorkFlowTableName: string;
	HistoryTableName: string;
	RoleTableStatusRuleFkColumName: string | null;
	RuleTableStatusFkColumnName: string | null;
	RuleTableStatusTargetFkColumName: string | null;
	HistoryTableStatusNewFkColumnName: string | null;
	HistoryTableStatusOldFkColumnName: string | null;
	WorkFlowTableStatusRuleFkColumName: string | null;
	PKey1ColumnName: string | null;
	PKey2ColumnName: string | null;
	IsSimpleStatus: boolean;
	HasIsLive: boolean;
	HasBackGroundColor: boolean;
	Id: string;
}