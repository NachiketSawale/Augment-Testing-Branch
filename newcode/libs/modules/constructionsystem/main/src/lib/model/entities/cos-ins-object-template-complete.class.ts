/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosInsObjectTemplateEntity, ICosInsObjectTemplatePropertyEntity } from '@libs/constructionsystem/shared';
import { CompleteIdentification } from '@libs/platform/common';

export class CosInsObjectTemplateComplete implements CompleteIdentification<ICosInsObjectTemplateEntity> {
	/**
	 * CosInsObjectTemplate
	 */
	public CosInsObjectTemplate?: ICosInsObjectTemplateEntity | null = null;

	/**
	 * CosInsObjectTemplatePropertyToDelete
	 */
	public CosInsObjectTemplatePropertyToDelete?: ICosInsObjectTemplatePropertyEntity[] | null = [];

	/**
	 * CosInsObjectTemplatePropertyToSave
	 */
	public CosInsObjectTemplatePropertyToSave?: ICosInsObjectTemplatePropertyEntity[] | null = [];

	/**
	 * CosInsObjectTemplates
	 */
	public CosInsObjectTemplates?: ICosInsObjectTemplateEntity[] | null = [];

	// /**
	//  * CostGroupToDelete
	//  */
	// public CostGroupToDelete?: IMainItem2CostGroupEntity[] | null = [];
	//
	// /**
	//  * CostGroupToSave
	//  */
	// public CostGroupToSave?: IMainItem2CostGroupEntity[] | null = [];

	/**
	 * EntitiesCount
	 */
	public EntitiesCount: number = 0;

	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;
}
