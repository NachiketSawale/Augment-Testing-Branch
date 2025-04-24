/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { BasicsConfigComplete } from '../model/basics-config-complete.class';
import { IModuleEntity } from '../model/entities/module-entity.interface';


@Injectable({
    providedIn: 'root'
})

export class BasicsConfigDataService extends DataServiceFlatRoot<IModuleEntity, BasicsConfigComplete> {

    public constructor() {
        const options: IDataServiceOptions<IModuleEntity> = {
            apiUrl: 'basics/config',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'listFiltered',
                usePost: true
            },
            deleteInfo: <IDataServiceEndPointOptions>{
                endPoint: 'deleteModule'
            },
            roleInfo: <IDataServiceRoleOptions<IModuleEntity>>{
                role: ServiceRole.Root,
                itemName: 'Module',
            }
        };

        super(options);
    }
    public override createUpdateEntity(modified: IModuleEntity | null): BasicsConfigComplete {
        const complete = new BasicsConfigComplete();
        if (modified !== null) {
            complete.Id = modified.Id;
            complete.Datas = [modified];
        }

        return complete;
    }

}
