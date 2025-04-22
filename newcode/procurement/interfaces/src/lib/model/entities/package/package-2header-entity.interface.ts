

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { IPrcHeaderEntity } from '../prc-header-entity.interface';

export interface IPackage2HeaderEntity extends IEntityBase, IEntityIdentification {
	 Description?: string ;
	 PrcPackageFk: number;
	 PrcHeaderFk: number;
	 CommentText?: string ;
	 ReqHeaderFk?: number ;
	 PrcHeaderEntity?: IPrcHeaderEntity ;
	 PrcItemValueNet: number;
	 PrcItemValueNetOc: number;
	 PrcItemGross: number;
	 PrcItemGrossOc: number;
	 PrcBoqValueNet: number;
	 PrcBoqValueNetOc: number;
	 PrcBoqGross: number;
	 PrcBoqGrossOc: number;
}
