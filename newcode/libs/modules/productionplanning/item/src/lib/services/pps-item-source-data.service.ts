import {Injectable} from '@angular/core';
import {
    DataServiceFlatLeaf, IDataServiceEndPointOptions,
    IDataServiceOptions, IDataServiceRoleOptions,
    ServiceRole
} from '@libs/platform/data-access';
import {IPpsItemSourceEntity} from '../model/entities/pps-item-source-entity.interface';
import {IPPSItemEntity} from '../model/entities/pps-item-entity.interface';
import {PPSItemComplete} from '../model/entities/pps-item-complete.class';
import {PpsItemDataService} from './pps-item-data.service';

@Injectable({
    providedIn: 'root',
})
export class PpsItemSourceDataService extends DataServiceFlatLeaf<IPpsItemSourceEntity, IPPSItemEntity, PPSItemComplete> {
    public constructor(private ppsItemDataService: PpsItemDataService) {
        const options : IDataServiceOptions<IPpsItemSourceEntity> = {
            apiUrl: 'productionplanning/item/source',
            roleInfo: <IDataServiceRoleOptions<IPpsItemSourceEntity>> {
                role: ServiceRole.Leaf,
                itemName: 'PpsItemSource',
                parent: ppsItemDataService,
            },
            readInfo: <IDataServiceEndPointOptions> {
                endPoint: 'list',
                prepareParam: ident => {
                    return {
                        itemFk: ident.pKey1,
                    };
                }
            }
        };
        super(options);
    }

    public override canCreate(): boolean {
        return false;
    }

    public override canDelete(): boolean {
        return false;
    }
}