import { CompleteIdentification } from '@libs/platform/common';
import { ICosTemplateEntity } from '@libs/constructionsystem/shared';
import { ICosParameter2TemplateEntity } from './cos-parameter-2-template-entity.interface';
import { CosObjectTemplate2TemplateComplete } from './cos-object-template-2-template-complete.class';

export class CosMasterTemplateComplete extends CompleteIdentification<ICosTemplateEntity> {
	/**
	 * EntitiesCount
	 */
	public EntitiesCount: number = 0;

	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;

	/**
	 * CosTemplate
	 */
	public CosTemplate?: ICosTemplateEntity | null;

	/**
	 * CosTemplateToSave
	 */
	public CosTemplateToSave?: ICosTemplateEntity[] | null = null;

	/**
	 * CosParameter2TemplateToSave
	 */
	public CosParameter2TemplateToSave?: ICosParameter2TemplateEntity[] | null = [];

	/**
	 * CosParameter2TemplateToDelete
	 */
	public CosParameter2TemplateToDelete?: ICosParameter2TemplateEntity[] | null = [];

	/**
	 * CosObjectTemplate2TemplateToDelete
	 */
	public CosObjectTemplate2TemplateToDelete?: CosObjectTemplate2TemplateComplete[] | null = [];

	/**
	 * CosObjectTemplate2TemplateToSave
	 */
	public CosObjectTemplate2TemplateToSave?: CosObjectTemplate2TemplateComplete[] | null = [];
}