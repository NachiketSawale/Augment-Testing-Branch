/*
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsCustomizeModelObjectTextureEntity, IPrcStructureEntity } from '@libs/basics/interfaces';
import { CostGroupCompleteEntity, IBasicMainItem2CostGroup, IFilterResponse, ILookupDescriptorEntity, IUserFormEntity } from '@libs/basics/shared';
import { ICosTypeLookupEntity } from './cos-type-lookup-entity.interface';
import { ICosGroupEntity, ICosHeaderEntity, ICosTemplateEntity } from '@libs/constructionsystem/shared';
import { IDimensionTypes } from '@libs/constructionsystem/shared';
import {
	ILicCostGroup1Entity,
	ILicCostGroup2Entity,
	ILicCostGroup3Entity,
	ILicCostGroup4Entity, ILicCostGroup5Entity
} from '@libs/basics/costgroups';

export interface ICosMasterHeaderResponseGenerated {
	/**
	 * BasicsCostGroup1
	 */
	BasicsCostGroup1?: ILicCostGroup1Entity[] | null;

	/**
	 * BasicsCostGroup2
	 */
	BasicsCostGroup2?: ILicCostGroup2Entity[] | null;

	/**
	 * BasicsCostGroup3
	 */
	BasicsCostGroup3?: ILicCostGroup3Entity[] | null;

	/**
	 * BasicsCostGroup4
	 */
	BasicsCostGroup4?: ILicCostGroup4Entity[] | null;

	/**
	 * BasicsCostGroup5
	 */
	BasicsCostGroup5?: ILicCostGroup5Entity[] | null;

	/**
	 * ConstructionSystemMasterGroup
	 */
	ConstructionSystemMasterGroup?: ICosGroupEntity[] | null;

	/**
	 * ConstructionSystemMasterType
	 */
	ConstructionSystemMasterType?: ICosTypeLookupEntity[] | null;

	/**
	 * CosTemplate
	 */
	CosTemplate?: ICosTemplateEntity[] | null;

	/**
	 * CostGroupCats
	 */
	CostGroupCats?: CostGroupCompleteEntity | null;

	/**
	 * DefaultGroupId
	 */
	DefaultGroupId: number;

	/**
	 * DimensionTypes
	 */
	DimensionTypes?: IDimensionTypes[] | null;

	/**
	 * FilterResult
	 */
	FilterResult?: IFilterResponse | null;

	/**
	 * Header2CostGroups
	 */
	Header2CostGroups?: IBasicMainItem2CostGroup[] | null;

	/**
	 * Objecttextures
	 */
	Objecttextures?: IBasicsCustomizeModelObjectTextureEntity[] | null; // IObjectTextures

	/**
	 * Prcstructure
	 */
	Prcstructure?: IPrcStructureEntity[] | null;

	/**
	 * RubricCategory
	 */
	RubricCategory?: ILookupDescriptorEntity[] | null;

	/**
	 * basicsUserFormLookupService
	 */
	basicsUserFormLookupService?: IUserFormEntity[] | null; // IFormEntity

	/**
	 * dtos
	 */
	dtos: ICosHeaderEntity[];
}
