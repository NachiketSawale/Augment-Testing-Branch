import { CompleteIdentification } from '@libs/platform/common';
import { IPpsHeaderEntity } from '@libs/productionplanning/shared';
import { IPpsHeader2ClerkEntity } from './entities/pps-header2clerk-entity.interface';
import {
	PpsCommonBizPartnerComplete,
	IPpsCommonBizPartnerEntity,
} from '@libs/productionplanning/common';

export class PpsHeaderComplete implements CompleteIdentification<IPpsHeaderEntity> {

	public MainItemId: number = 0;
	public PPSHeaders: IPpsHeaderEntity[] | null = [];
	public CommonBizPartnerToSave: PpsCommonBizPartnerComplete[] | null = [];
	public CommonBizPartnerToDelete: IPpsCommonBizPartnerEntity[] | null = [];
	public Header2ClerkToSave: IPpsHeader2ClerkEntity[] | null = [];
	public Header2ClerkToDelete: IPpsHeader2ClerkEntity[] | null = [];
}
