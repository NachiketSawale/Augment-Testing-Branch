import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsClerkBlobsEntity extends IEntityBase, IEntityIdentification {
	Content: string | null;
}
