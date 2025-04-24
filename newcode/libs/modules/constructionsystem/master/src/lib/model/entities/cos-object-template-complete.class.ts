/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosObjectTemplateEntity } from './cos-object-template-entity.interface';
import { ICosObjectTemplatePropertyEntity } from './cos-object-template-property-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class CosObjectTemplateComplete implements CompleteIdentification<ICosObjectTemplateEntity> {
	/**
	 * CosObjectTemplate
	 */
	public CosObjectTemplate?: ICosObjectTemplateEntity | null;

	/**
	 * CosObjectTemplatePropertyToDelete
	 */
	public CosObjectTemplatePropertyToDelete?: ICosObjectTemplatePropertyEntity[] | null = [];

	/**
	 * CosObjectTemplatePropertyToSave
	 */
	public CosObjectTemplatePropertyToSave?: ICosObjectTemplatePropertyEntity[] | null = [];

	/**
	 * CostGroupToDelete
	 */
	// public CostGroupToDelete?: IMainItem2CostGroupEntity[] | null = [];

	/**
	 * CostGroupToSave
	 */
	// public CostGroupToSave?: IMainItem2CostGroupEntity[] | null = [];

	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;
}
