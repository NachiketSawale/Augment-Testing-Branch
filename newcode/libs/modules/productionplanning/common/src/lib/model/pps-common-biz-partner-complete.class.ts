import { CompleteIdentification } from '@libs/platform/common';
import { IPpsCommonBizPartnerEntity } from './entities/pps-common-biz-partner-entity.interface';
import { IPpsCommonBizPartnerContactEntity } from './entities/pps-common-biz-partner-contact-entity.interface';

export class PpsCommonBizPartnerComplete implements CompleteIdentification<IPpsCommonBizPartnerEntity> {

	public MainItemId: number = 0;
	public CommonBizPartner: IPpsCommonBizPartnerEntity | null = null;

	public CommonBizPartnerContactToSave: IPpsCommonBizPartnerContactEntity[] | null = [];
	public CommonBizPartnerContactToDelete: IPpsCommonBizPartnerContactEntity[] | null = [];
}
