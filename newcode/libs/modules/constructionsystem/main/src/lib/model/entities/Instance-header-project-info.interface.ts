/*
 * Copyright(c) RIB Software GmbH
 */

export interface InstanceHeaderProjectInfo {
	Id?: number;
	BoqHeaderFk?: number;
	EstimateHeaderFk?: number;
	ModelFk?: number;
	HeaderId?: number;
	BasLanguageQtoFk?: number;
	HeaderCode?: string;
	HeaderDescription?: string;
	ProjectId?: number;
	ProjectNo: string;
	ProjectName?: string;
	EstimateHeaderId?: number;
	EstimateHeaderCode?: string;
	EstimateHeaderDescription?: string;
	ModelId?: number;
	ModelCode?: string;
	ModelDescription?: string;
	BoqHeaderId?: number;
	PermissionObjectInfo?: string;
	ProjectFK?: number;
}
