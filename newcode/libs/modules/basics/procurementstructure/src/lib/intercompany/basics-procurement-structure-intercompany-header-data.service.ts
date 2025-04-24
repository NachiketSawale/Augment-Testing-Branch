/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {
    DataServiceFlatNode,
    IDataServiceEndPointOptions,
    IDataServiceOptions,
    IDataServiceRoleOptions, ServiceRole
} from '@libs/platform/data-access';
import {BasicsProcurementStructureDataService} from '../procurement-structure/basics-procurement-structure-data.service';
import { PrcStructureComplete } from '../model/complete-class/prc-structure-complete.class';
import { IPrcStructureEntity } from '@libs/basics/interfaces';
import { IMdcContextEntity } from '../model/entities/mdc-context-entity.interface';
import { MdcContextComplete } from '../model/complete-class/mdc-context-complete.class';



/**
 * The data service of inter company header grid
 */
@Injectable({
    providedIn: 'root'
})

export class BasicsProcurementStructureInterCompanyHeaderDataService extends DataServiceFlatNode<IMdcContextEntity,MdcContextComplete,IPrcStructureEntity, PrcStructureComplete> {

    public constructor(private parentService: BasicsProcurementStructureDataService) {
        const options: IDataServiceOptions<IMdcContextEntity> = {
            apiUrl: 'basics/procurementstructure/intercompany',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'getContextByCompanyId',
                usePost: false
            },
            roleInfo: <IDataServiceRoleOptions<IMdcContextEntity>>{
                role: ServiceRole.Node,
                itemName: 'MdcContext',
                parent: parentService
            },
            entityActions: {
                deleteSupported: false,
                createSupported: false
            }
        };
        super(options);
    }

    //todo  mdcContextToSave too much record when update,need test after framework fix.
    public override createUpdateEntity(modified: IMdcContextEntity | null): MdcContextComplete {
        const complete = new MdcContextComplete(modified);
        if (modified !== null) {
            complete.MainItemId = modified.Id;
        }
        return complete;
    }
}
