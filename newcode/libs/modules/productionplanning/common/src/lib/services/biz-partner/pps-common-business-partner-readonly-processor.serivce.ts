/* it's useless, to be deleted in the future
import {CompleteIdentification, IEntityIdentification} from '@libs/platform/common';
import {EntityReadonlyProcessorBase, ReadonlyFunctions} from '@libs/basics/shared';
import {IPpsCommonBizPartnerEntity} from '../../model/entities/pps-common-biz-partner-entity.interface';
import {PpsCommonBizPartnerComplete} from '../../model/pps-common-biz-partner-complete.class';
import {PpsCommonBusinessPartnerDataService} from './pps-common-business-partner-data.service';

export class PpsCommonBusinessPartnerReadonlyProcessor<
    T extends IPpsCommonBizPartnerEntity,
    U extends PpsCommonBizPartnerComplete,
    PT extends IEntityIdentification,
    PU extends CompleteIdentification<PT>>
    extends EntityReadonlyProcessorBase<T> {

    public constructor(protected dataService: PpsCommonBusinessPartnerDataService<T, U, PT, PU>) {
        super(dataService);
    }

    public generateReadonlyFunctions(): ReadonlyFunctions<T> {
        return {
            From: info=> info.item.Version !== undefined && info.item.Version > 0,
        };
    }
}
*/