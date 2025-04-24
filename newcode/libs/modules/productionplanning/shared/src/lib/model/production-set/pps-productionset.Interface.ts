import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IPpsProductionSetEntity extends IEntityBase {
	Id: number;
	Code: string;
	Description?: string | null;
	DescriptionInfo?: IDescriptionInfo | null;
}
