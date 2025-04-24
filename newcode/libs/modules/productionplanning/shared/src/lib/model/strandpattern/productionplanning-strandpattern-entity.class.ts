import { IEntityBase } from '@libs/platform/common';

export interface IPpsStrandPatternEntity extends IEntityBase {
	Id: number;
	Code: string;
	Description?: string | null;
	CadCode: string | null;
}
