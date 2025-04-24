/*
 * Copyright(c) RIB Software GmbH
 */

import { CosInsObjectTemplateComplete } from './cos-ins-object-template-complete.class';
import { ICosMainRequestEntity } from './cos-main-request-entity.interface';
import { Instance2ObjectComplete } from './instance-2-object-complete.class';
import { IUserFormDataEntity } from './user-form-data-entity.interface';
import { IBasicMainItem2CostGroup } from '@libs/basics/shared';
import { CompleteIdentification } from '@libs/platform/common';
import { IEstLineItemEntity } from '@libs/estimate/assemblies';
import { ICosChgOption2InsEntity, ICosInsObjectTemplateEntity, ICosInstanceEntity, IInstance2ObjectEntity, IInstanceParameterEntity } from '@libs/constructionsystem/shared';

export class CosMainComplete implements CompleteIdentification<ICosInstanceEntity> {
	/**
	 * CosChgOptionToDelete
	 */
	public CosChgOptionToDelete?: ICosChgOption2InsEntity[] | null = [];

	/**
	 * CosChgOptionToSave
	 */
	public CosChgOptionToSave?: ICosChgOption2InsEntity[] | null = [];

	/**
	 * CosInsObjectTemplateToDelete
	 */
	public CosInsObjectTemplateToDelete?: ICosInsObjectTemplateEntity[] | null = [];

	/**
	 * CosInsObjectTemplateToSave
	 */
	public CosInsObjectTemplateToSave?: CosInsObjectTemplateComplete[] | null = [];

	/**
	 * CostGroupToDelete
	 */
	public CostGroupToDelete?: IBasicMainItem2CostGroup[] = [];

	/**
	 * CostGroupToSave
	 */
	public CostGroupToSave?: IBasicMainItem2CostGroup[] = [];

	/**
	 * EntitiesCount
	 */
	public EntitiesCount: number = 0;

	/**
	 * EstLineItemsToDelete
	 */
	public EstLineItemsToDelete?: IEstLineItemEntity[] | null = [];

	/**
	 * EstLineItemsToSave
	 */
	public EstLineItemsToSave?: ICosMainRequestEntity[] | null = [];

	/**
	 * Instance
	 */
	public Instance: ICosInstanceEntity | null = null;

	/**
	 * Instance2ObjectToDelete
	 */
	public Instance2ObjectToDelete?: IInstance2ObjectEntity[] | null = [];

	/**
	 * Instance2ObjectToSave
	 */
	public Instance2ObjectToSave?: Instance2ObjectComplete[] | null = [];

	/**
	 * InstanceParameterToDelete
	 */
	public InstanceParameterToDelete?: IInstanceParameterEntity[] | null = [];

	/**
	 * InstanceParameterToSave
	 */
	public InstanceParameterToSave?: IInstanceParameterEntity[] | null = [];

	/**
	 * Instances
	 */
	public Instances?: ICosInstanceEntity[] | null = [];

	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;

	/**
	 * ModelValidateError
	 */
	public ModelValidateError?: string[] | null = [];

	/**
	 * UserFormData2InstanceParameter
	 */
	public UserFormData2InstanceParameter?: IUserFormDataEntity[] | null = [];
}
