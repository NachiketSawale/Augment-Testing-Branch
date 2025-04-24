/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosInstanceEntity } from './instance-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IInstance2ObjectParamEntity } from './instance-2-object-param-entity.interface';

export interface IInstance2ObjectEntityGenerated extends IEntityBase {
	/**
	 * CadIdInt
	 */
	CadIdInt?: number | null;

	/**
	 * ControllingUnitFk
	 */
	ControllingUnitFk?: number | null;

	/**
	 * CpiId
	 */
	CpiId?: string | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * Instance2ObjectParamEntities
	 */
	Instance2ObjectParamEntities?: IInstance2ObjectParamEntity[] | null;

	/**
	 * InstanceEntity
	 */
	InstanceEntity?: ICosInstanceEntity | null;

	/**
	 * InstanceFk
	 */
	InstanceFk: number;

	/**
	 * InstanceHeaderFk
	 */
	InstanceHeaderFk: number;

	/**
	 * IsComposite
	 */
	IsComposite: boolean;

	/**
	 * IsNegative
	 */
	IsNegative: boolean;

	/**
	 * IsOldModel
	 */
	IsOldModel: boolean;

	/**
	 * IsParameterChanged
	 */
	IsParameterChanged: boolean;

	/**
	 * LineItemCostGroup1Fk
	 */
	LineItemCostGroup1Fk?: number | null;

	/**
	 * LineItemCostGroup2Fk
	 */
	LineItemCostGroup2Fk?: number | null;

	/**
	 * LineItemCostGroup3Fk
	 */
	LineItemCostGroup3Fk?: number | null;

	/**
	 * LineItemCostGroup4Fk
	 */
	LineItemCostGroup4Fk?: number | null;

	/**
	 * LineItemCostGroup5Fk
	 */
	LineItemCostGroup5Fk?: number | null;

	/**
	 * MeshId
	 */
	MeshId?: number | null;

	/**
	 * ModelFk
	 */
	ModelFk: number;

	/**
	 * ObjectFk
	 */
	ObjectFk: number;

	/**
	 * ObjectSetFk
	 */
	ObjectSetFk?: number | null;

	/**
	 * PrjProjectFk
	 */
	PrjProjectFk?: number | null;

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
}
