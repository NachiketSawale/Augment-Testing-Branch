/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IBasicMainItem2CostGroup } from '@libs/basics/shared';
import { ICosObjectTemplate2TemplateEntity } from './cos-object-template-2-template-entity.interface';
import { ICosObjectTemplateProperty2TemplateEntity } from './cos-object-template-property-2-template-entity.interface';

export class CosObjectTemplate2TemplateComplete implements CompleteIdentification<ICosObjectTemplate2TemplateEntity> {
	/**
	 * CosObjectTemplate2Template
	 */
	public CosObjectTemplate2Template?: ICosObjectTemplate2TemplateEntity | null;

	/**
	 * CosObjectTemplateProperty2TemplateToDelete
	 */
	public CosObjectTemplateProperty2TemplateToDelete?: ICosObjectTemplateProperty2TemplateEntity[] | null = [];

	/**
	 * CosObjectTemplateProperty2TemplateToSave
	 */
	public CosObjectTemplateProperty2TemplateToSave?: ICosObjectTemplateProperty2TemplateEntity[] | null = [];

	/**
	 * CostGroupToDelete
	 */
	public CostGroupToDelete?: IBasicMainItem2CostGroup[] | null = [];

	/**
	 * CostGroupToSave
	 */
	public CostGroupToSave?: IBasicMainItem2CostGroup[] | null = [];

	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;
}
