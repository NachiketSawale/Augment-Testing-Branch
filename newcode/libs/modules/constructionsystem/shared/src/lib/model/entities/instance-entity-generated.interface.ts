/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosChgOption2InsEntity } from './cos-chg-option-2-ins-entity.interface';
import { ICosInsObjectTemplateEntity } from './cos-ins-object-template-entity.interface';
import { IInstance2ObjectEntity } from './instance-2-object-entity.interface';
import { IInstanceParameterEntity } from './instance-parameter-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IBasicMainItem2CostGroup } from '@libs/basics/shared';

export interface IInstanceEntityGenerated extends IEntityBase {
	/**
	 * BoqHeaderFk
	 */
	BoqHeaderFk?: number | null;

	/**
	 * BoqItemFk
	 */
	BoqItemFk?: number | null;

	/**
	 * ChangeOption
	 */
	ChangeOption?: ICosChgOption2InsEntity | null;

	/**
	 * Code
	 */
	Code: string;

	/**
	 * CommentText
	 */
	CommentText?: string | null;

	/**
	 * ControllingUnitFk
	 */
	ControllingUnitFk?: number | null;

	/**
	 * CosInsHeaderOldFk
	 */
	CosInsHeaderOldFk?: number | null;

	/**
	 * CosInsObjectTemplateEntities
	 */
	CosInsObjectTemplateEntities?: ICosInsObjectTemplateEntity[] | null;

	/**
	 * CosInstanceOldFk
	 */
	CosInstanceOldFk?: number | null;

	/**
	 * CosTemplateFk
	 */
	CosTemplateFk?: number | null;

	/**
	 * CostGroups
	 */
	CostGroups?: IBasicMainItem2CostGroup[] | null;

	/**
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/**
	 * Flag
	 */
	Flag: number;

	/**
	 * FormDataFk
	 */
	FormDataFk?: number | null;

	/**
	 * FormId
	 */
	FormId?: number | null;

	/**
	 * HeaderFk
	 */
	HeaderFk: number;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * Instance2ObjectEntities
	 */
	Instance2ObjectEntities?: IInstance2ObjectEntity[] | null;

	/**
	 * InstanceHeaderFk
	 */
	InstanceHeaderFk: number;

	/**
	 * InstanceParameterEntities
	 */
	InstanceParameterEntities?: IInstanceParameterEntity[] | null;

	/**
	 * IsAotuSelectionStatement
	 */
	IsAotuSelectionStatement: boolean;

	/**
	 * IsAutoApply
	 */
	IsAutoApply: boolean;

	/**
	 * IsAutoCalculate
	 */
	IsAutoCalculate: boolean;

	/**
	 * IsChecked
	 */
	IsChecked: boolean;

	/**
	 * IsDistinctInstances
	 */
	IsDistinctInstances: boolean;

	/**
	 * IsUpdateOnly
	 */
	IsUpdateOnly: boolean;

	/**
	 * IsUserModified
	 */
	IsUserModified?: boolean | null;

	/**
	 * LicCostGroup1Fk
	 */
	LicCostGroup1Fk?: number | null;

	/**
	 * LicCostGroup2Fk
	 */
	LicCostGroup2Fk?: number | null;

	/**
	 * LicCostGroup3Fk
	 */
	LicCostGroup3Fk?: number | null;

	/**
	 * LicCostGroup4Fk
	 */
	LicCostGroup4Fk?: number | null;

	/**
	 * LicCostGroup5Fk
	 */
	LicCostGroup5Fk?: number | null;

	/**
	 * LocationFk
	 */
	LocationFk?: number | null;

	/**
	 * MasterHeaderCode
	 */
	MasterHeaderCode?: string | null;

	/**
	 * MasterHeaderDescription
	 */
	MasterHeaderDescription?: string | null;

	/**
	 * ModelAndObjectFks
	 */
	ModelAndObjectFks?: IModelAndObjectFkEntity[] | null;

	/**
	 * ModelFk
	 */
	ModelFk?: number | null;

	/**
	 * ModelObjectFks
	 */
	ModelObjectFks?: number[] | null;

	/**
	 * OverrideOnApply
	 */
	OverrideOnApply: boolean;

	/**
	 * PermissionObjectInfo
	 */
	PermissionObjectInfo?: string | null;

	/**
	 * ProjectCostGroup1Fk
	 */
	ProjectCostGroup1Fk?: number | null;

	/**
	 * ProjectCostGroup2Fk
	 */
	ProjectCostGroup2Fk?: number | null;

	/**
	 * ProjectCostGroup3Fk
	 */
	ProjectCostGroup3Fk?: number | null;

	/**
	 * ProjectCostGroup4Fk
	 */
	ProjectCostGroup4Fk?: number | null;

	/**
	 * ProjectCostGroup5Fk
	 */
	ProjectCostGroup5Fk?: number | null;

	/**
	 * ProjectSortCode01Fk
	 */
	ProjectSortCode01Fk?: number | null;

	/**
	 * ProjectSortCode02Fk
	 */
	ProjectSortCode02Fk?: number | null;

	/**
	 * ProjectSortCode03Fk
	 */
	ProjectSortCode03Fk?: number | null;

	/**
	 * ProjectSortCode04Fk
	 */
	ProjectSortCode04Fk?: number | null;

	/**
	 * ProjectSortCode05Fk
	 */
	ProjectSortCode05Fk?: number | null;

	/**
	 * ProjectSortCode06Fk
	 */
	ProjectSortCode06Fk?: number | null;

	/**
	 * ProjectSortCode07Fk
	 */
	ProjectSortCode07Fk?: number | null;

	/**
	 * ProjectSortCode08Fk
	 */
	ProjectSortCode08Fk?: number | null;

	/**
	 * ProjectSortCode09Fk
	 */
	ProjectSortCode09Fk?: number | null;

	/**
	 * ProjectSortCode10Fk
	 */
	ProjectSortCode10Fk?: number | null;

	/**
	 * SelectStatement
	 */
	SelectStatement?: string | null;

	/**
	 * Status
	 */
	Status: number;

	/**
	 * UpdateOnApply
	 */
	UpdateOnApply: boolean;

	/**
	 * UserDefined1
	 */
	UserDefined1?: string | null;

	/**
	 * UserDefined2
	 */
	UserDefined2?: string | null;

	/**
	 * UserDefined3
	 */
	UserDefined3?: string | null;

	/**
	 * UserDefined4
	 */
	UserDefined4?: string | null;

	/**
	 * UserDefined5
	 */
	UserDefined5?: string | null;
}

interface IModelAndObjectFkEntity {
	/**
	 * Model
	 */
	Model: number;
	/**
	 * ObjectFk
	 */
	ObjectFk: number;
}
