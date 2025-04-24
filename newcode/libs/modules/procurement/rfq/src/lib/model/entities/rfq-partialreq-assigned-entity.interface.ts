import { IEntityBase, IEntityIdentification} from '@libs/platform/common';

export interface IRfqPartialReqAssignedEntity extends IEntityBase, IEntityIdentification {
	RfqHeaderFk: number;
	BpdBusinessPartnerFk: number;
	ReqHeaderFk: number;
	ReqVariantFk?: number;
}