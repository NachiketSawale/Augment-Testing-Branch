/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { ICosChgOption2HeaderEntity } from './cos-chg-option-2-header-entity.interface';

export interface ICosHeaderEntityGenerated extends IEntityBase {
	/**
	 * BasBlobsFk
	 */
	BasBlobsFk?: number | null;

	/**
	 * BasFormDataFk
	 */
	BasFormDataFk?: number | null;

	/**
	 * BasFormFk
	 */
	BasFormFk?: number | null;

	/**
	 * ChangeOption
	 */
	ChangeOption?: ICosChgOption2HeaderEntity | null;

	/**
	 * Code
	 */
	Code: string;

	/**
	 * CommentText
	 */
	CommentText?: string | null;

	/**
	 * CosGroupFk
	 */
	CosGroupFk: number;

	/**
	 * CosTypeFk
	 */
	CosTypeFk: number;

	/**
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * IsDistinctInstances
	 */
	IsDistinctInstances: boolean;

	/**
	 * IsLive
	 */
	IsLive: boolean;

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
	 * LineItemContextFk
	 */
	LineItemContextFk: number;

	/**
	 * MatchCode
	 */
	MatchCode?: string | null;

	/**
	 * Reference
	 */
	Reference?: string | null;

	/**
	 * RubricCategoryFk
	 */
	RubricCategoryFk: number;

	/**
	 * SelectStatement
	 */
	SelectStatement?: string | null;

	/**
	 * StructureFk
	 */
	StructureFk?: number | null;
}
