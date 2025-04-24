/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosInsObjectTemplatePropertyEntity } from './cos-ins-object-template-property-entity.interface';
import { ICosInstanceEntity } from './instance-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ICosInsObjectTemplateEntityGenerated extends IEntityBase {
	/**
	 * CosInsHeaderFk
	 */
	CosInsHeaderFk: number;

	/**
	 * CosInsObjectTemplatePropertyEntities
	 */
	CosInsObjectTemplatePropertyEntities?: ICosInsObjectTemplatePropertyEntity[] | null;

	/**
	 * CosInstanceFk
	 */
	CosInstanceFk: number;

	/**
	 * Description
	 */
	Description?: string | null;

	/**
	 * Height
	 */
	Height: number;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * InstanceEntity
	 */
	InstanceEntity?: ICosInstanceEntity | null;

	/**
	 * IsComposite
	 */
	IsComposite: boolean;

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
	 * MdcControllingUnitFk
	 */
	MdcControllingUnitFk?: number | null;

	/**
	 * MdlDimensionTypeFk
	 */
	MdlDimensionTypeFk: number;

	/**
	 * MdlObjectTextureNegFk
	 */
	MdlObjectTextureNegFk: number;

	/**
	 * MdlObjectTexturePosFk
	 */
	MdlObjectTexturePosFk: number;

	/**
	 * Multiplier
	 */
	Multiplier: number;

	/**
	 * NegativeColor
	 */
	NegativeColor: number;

	/**
	 * Offset
	 */
	Offset: number;

	/**
	 * PositiveColor
	 */
	PositiveColor: number;

	/**
	 * PrjCostGroup1Fk
	 */
	PrjCostGroup1Fk?: number | null;

	/**
	 * PrjCostGroup2Fk
	 */
	PrjCostGroup2Fk?: number | null;

	/**
	 * PrjCostGroup3Fk
	 */
	PrjCostGroup3Fk?: number | null;

	/**
	 * PrjCostGroup4Fk
	 */
	PrjCostGroup4Fk?: number | null;

	/**
	 * PrjCostGroup5Fk
	 */
	PrjCostGroup5Fk?: number | null;

	/**
	 * PrjLocationFk
	 */
	PrjLocationFk?: number | null;
}
