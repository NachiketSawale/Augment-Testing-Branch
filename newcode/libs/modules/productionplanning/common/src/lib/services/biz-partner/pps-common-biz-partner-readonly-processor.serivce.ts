import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IPpsCommonBizPartnerEntity } from '../../model/entities/pps-common-biz-partner-entity.interface';
import { PpsCommonBizPartnerDataService } from './pps-common-biz-partner-data.service';

export class PpsCommonBizPartnerReadonlyProcessor<
	PT extends IEntityIdentification,
	PU extends CompleteIdentification<PT>>
	extends EntityReadonlyProcessorBase<IPpsCommonBizPartnerEntity> {

	public constructor(protected dataService: PpsCommonBizPartnerDataService<PT, PU>) {
		super(dataService);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<IPpsCommonBizPartnerEntity> {
		return {
			From: info => info.item.Version !== undefined && info.item.Version > 0,
		};
	}
}