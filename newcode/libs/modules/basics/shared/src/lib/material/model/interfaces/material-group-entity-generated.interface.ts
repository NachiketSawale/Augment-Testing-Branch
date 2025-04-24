/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialGroupEntity } from './material-group-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMaterialGroupEntityGenerated extends IEntityBase {
	/**
	 * ChildItems
	 */
	ChildItems?: IMaterialGroupEntity[] | null;

	/**
	 * Code
	 */
	Code: string;

	/**
	 * CostCodeFk
	 */
	CostCodeFk?: number | null;

	/**
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/**
	 * HasChildren
	 */
	HasChildren: boolean;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * MaterialCatalogFk
	 */
	MaterialCatalogFk: number;

	/**
	 * MaterialGroupCheckedValue
	 */
	MaterialGroupCheckedValue: boolean;

	/**
	 * MaterialGroupChildren
	 */
	MaterialGroupChildren?: number[] | null;

	/**
	 * MaterialGroupFk
	 */
	MaterialGroupFk?: number | null;

	/**
	 * PrcStructureFk
	 */
	PrcStructureFk?: number | null;
}
