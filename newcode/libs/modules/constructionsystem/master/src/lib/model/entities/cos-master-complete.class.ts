/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IBasicMainItem2CostGroup } from '@libs/basics/shared';
import { ICosWicEntity } from './cos-wic-entity.interface';
import { ICosScriptEntity } from './cos-script-entity.interface';
import { ICosAssemblyEntity } from './cos-assembly-entity.interface';
import { ICosObjectTemplateEntity } from './cos-object-template-entity.interface';
import { CosMasterParameterComplete } from './cos-master-parameter-complete.class';
import { ICosActivityTemplateEntity } from './cos-activity-template-entity.interface';
import { ICosControllingGroupEntity } from './cos-controlling-group-entity.interface';
import { ICosChgOption2HeaderEntity, ICosGlobalParamGroupEntity, ICosHeaderEntity, ICosTemplateEntity } from '@libs/constructionsystem/shared';
import { CosMasterTemplateComplete } from './cos-master-template-complete.class';
import { ICosParameterEntity, ICosParameterGroupEntity } from '@libs/constructionsystem/shared';
import { CosObjectTemplateComplete } from './cos-object-template-complete.class';

export class CosMasterComplete implements CompleteIdentification<ICosHeaderEntity> {
	/**
	 * CosActivityTemplateToDelete
	 */
	public CosActivityTemplateToDelete?: ICosActivityTemplateEntity[] | null = [];

	/**
	 * CosActivityTemplateToSave
	 */
	public CosActivityTemplateToSave?: ICosActivityTemplateEntity[] | null = [];

	/**
	 * CosAssemblyToDelete
	 */
	public CosAssemblyToDelete?: ICosAssemblyEntity[] | null = [];

	/**
	 * CosAssemblyToSave
	 */
	public CosAssemblyToSave?: ICosAssemblyEntity[] | null = [];

	/**
	 * CosChgOptionToDelete
	 */
	public CosChgOptionToDelete?: ICosChgOption2HeaderEntity[] | null = [];

	/**
	 * CosChgOptionToSave
	 */
	public CosChgOptionToSave?: ICosChgOption2HeaderEntity[] | null = [];

	/**
	 * CosControllingGroupToDelete
	 */
	public CosControllingGroupToDelete?: ICosControllingGroupEntity[] | null = [];

	/**
	 * CosControllingGroupToSave
	 */
	public CosControllingGroupToSave?: ICosControllingGroupEntity[] | null = [];

	/**
	 * CosGlobalParamGroupToDelete
	 */
	public CosGlobalParamGroupToDelete?: ICosGlobalParamGroupEntity | null;

	/**
	 * CosGlobalParamGroupToSave
	 */
	public CosGlobalParamGroupToSave?: ICosGlobalParamGroupEntity | null;

	/**
	 * CosHeader
	 */
	public CosHeader?: ICosHeaderEntity | null;

	/**
	 * CosHeaders
	 */
	public CosHeaders?: ICosHeaderEntity[] | null = [];

	/**
	 * CosObjectTemplateToDelete
	 */
	public CosObjectTemplateToDelete?: ICosObjectTemplateEntity[] | null = [];

	/**
	 * CosObjectTemplateToSave
	 */
	public CosObjectTemplateToSave?: CosObjectTemplateComplete[] | null = [];

	/**
	 * CosParameterGroupToDelete
	 */
	public CosParameterGroupToDelete?: ICosParameterGroupEntity[] | null = [];

	/**
	 * CosParameterGroupToSave
	 */
	public CosParameterGroupToSave?: ICosParameterGroupEntity[] | null = [];

	/**
	 * CosParameterToDelete
	 */
	public CosParameterToDelete?: ICosParameterEntity[] | null = [];

	/**
	 * CosParameterToSave
	 */
	public CosParameterToSave?: CosMasterParameterComplete[] | null = [];

	/**
	 * CosScriptToSave
	 */
	public CosScriptToSave?: ICosScriptEntity[] | null = [];

	/**
	 * CosTemplateToDelete
	 */
	public CosTemplateToDelete?: ICosTemplateEntity[] | null = [];

	/**
	 * CosTemplateToSave
	 */
	public CosTemplateToSave?: CosMasterTemplateComplete[] | null = [];

	/**
	 * CosWicToDelete
	 */
	public CosWicToDelete?: ICosWicEntity[] | null = [];

	/**
	 * CosWicToSave
	 */
	public CosWicToSave?: ICosWicEntity[] | null = [];

	/**
	 * CostGroupToDelete
	 */
	public CostGroupToDelete?: IBasicMainItem2CostGroup[] | null = [];

	/**
	 * CostGroupToSave
	 */
	public CostGroupToSave?: IBasicMainItem2CostGroup[] | null = [];

	/**
	 * EntitiesCount
	 */
	public EntitiesCount: number = 0;

	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;

	/**
	 * ModelValidateError
	 */
	public ModelValidateError?: string[] | null = [];
}
