/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions} from '@libs/platform/data-access';
import { BasicsIndexHeaderComplete } from '../model/basics-index-header-complete.class';
import {BasicsIndexHeaderEntity} from '../model/basics-index-header-entity.class';

export const BASICS_INDEX_HEADER_TOKEN = new InjectionToken<BasicsIndexHeaderDataService>('basicsIndexHeaderDataToken');

@Injectable({
    providedIn: 'root',
})
export class BasicsIndexHeaderDataService extends DataServiceFlatRoot<BasicsIndexHeaderEntity, BasicsIndexHeaderComplete> {
    public constructor() {
        const options: IDataServiceOptions<BasicsIndexHeaderEntity> = {
            apiUrl: 'basics/indexheader',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list',
                usePost: true,
            },
            deleteInfo: <IDataServiceEndPointOptions>{
                endPoint: 'deletelist',
                usePost: true,
            },
            roleInfo: <IDataServiceRoleOptions<BasicsIndexHeaderEntity>>{
                role: ServiceRole.Root,
                itemName: 'IndexHeader',
            },
        };

        super(options);
    }
    public override createUpdateEntity(modified: BasicsIndexHeaderEntity | null): BasicsIndexHeaderComplete {
        const complete = new BasicsIndexHeaderComplete();
        if (modified !== null) {
            complete.Id = modified.Id;
            complete.IndexHeader = modified;
        }

        return complete;
    }

    public override getModificationsFromUpdate(complete: BasicsIndexHeaderComplete): BasicsIndexHeaderEntity[] {
        if (complete.IndexHeader === null) {
            return [];
        }

        return [complete.IndexHeader];
    }
}
