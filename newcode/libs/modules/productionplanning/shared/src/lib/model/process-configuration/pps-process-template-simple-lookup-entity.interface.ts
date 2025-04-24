import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IPpsProcessTemplateSimpleLookupEntity extends IEntityBase {
	Id?: number,
	DescriptionInfo?: IDescriptionInfo | null;
	InsertedAt?: Date,
	InsertedBy?: number,
	UpdatedAt?: Date | undefined,
	UpdatedBy?: number | undefined,
	Version?: number,
}