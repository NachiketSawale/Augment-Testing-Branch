import { EntityBase, IEntityIdentification } from '@libs/platform/common';

export class FormworkTypeEntity extends EntityBase implements IEntityIdentification {
	public Id!: number;
	public Description?: string;
	public Icon!: number;
	public UserFlag1!: boolean;
	public UserFlag2!: boolean;
	public IsDefault!: boolean;
	public RubricCategoryFk!: number;
	public ProcessTemplateFk?: number;
	public Sorting!: number;
	public IsLive!: boolean;
}