/* it's useless, to be deleted in the future
import {inject, Injectable} from '@angular/core';
import {IDataServiceChildRoleOptions, ServiceRole} from '@libs/platform/data-access';
import {
    IPpsCommonBizPartnerEntity,
    PpsCommonBizPartnerComplete,
    PpsCommonBusinessPartnerDataService
} from '@libs/productionplanning/common';
import {IPPSItemEntity} from '../model/entities/pps-item-entity.interface';
import {PPSItemComplete} from '../model/entities/pps-item-complete.class';
import {PpsItemDataService} from './pps-item-data.service';

@Injectable({
    providedIn: 'root'
})
export class PpsItemBusinessPartnerDataService extends PpsCommonBusinessPartnerDataService<IPpsCommonBizPartnerEntity, PpsCommonBizPartnerComplete, IPPSItemEntity, PPSItemComplete> {
    public constructor() {
        const roleInfo: IDataServiceChildRoleOptions<IPpsCommonBizPartnerEntity, IPPSItemEntity, PPSItemComplete> = {
            role: ServiceRole.Node,
            itemName: 'CommonBizPartner',
            parent: inject(PpsItemDataService),
        };

        super(roleInfo, 'ProjectFk', 'PPSHeaderFk');
    }
}
*/