/*
 * Copyright(c) RIB Software GmbH
 */
import {BasicsMaterialRecordDataService} from '../material/basics-material-record-data.service';
import {Injectable} from '@angular/core';
import {
    DataServiceFlatLeaf,
    IDataServiceChildRoleOptions,
    IDataServiceEndPointOptions,
    IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import { IMaterialEntity } from '@libs/basics/interfaces';

import { IMdcMaterialReferenceEntity } from '../model/entities/mdc-material-reference-entity.interface';
import { MaterialComplete } from '../model/complete-class/material-complete.class';

/**
 * Material Reference data service
 */

@Injectable({
    providedIn: 'root'
})

export class BasicsMaterialMaterialReferenceDataService extends DataServiceFlatLeaf<IMdcMaterialReferenceEntity,IMaterialEntity,MaterialComplete>{
    public constructor(private basicsMaterialRecordDataService: BasicsMaterialRecordDataService) {
        const options: IDataServiceOptions<IMdcMaterialReferenceEntity> = {
            apiUrl: 'basics/material/reference',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list',
                usePost: false,
                prepareParam: ident => {
                    return { mainItemId : ident.pKey1};
                }
            },
            createInfo:{
                prepareParam: ident => {
                    return { mainItemId : ident.pKey1!};
                }
            },
            updateInfo: <IDataServiceEndPointOptions>{
                endPoint: 'update'
            },
            roleInfo: <IDataServiceChildRoleOptions<IMdcMaterialReferenceEntity,IMaterialEntity,MaterialComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'MaterialReference',
                parent: basicsMaterialRecordDataService
            }
        };

        super(options);
    }

    public override isParentFn(parentKey: IMaterialEntity, entity: IMdcMaterialReferenceEntity): boolean {
		return entity.MdcMaterialFk === parentKey.Id;
	}
}
