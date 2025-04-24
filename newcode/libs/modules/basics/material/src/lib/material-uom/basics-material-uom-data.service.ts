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
import { IMdcMaterial2basUomEntity } from '../model/entities/mdc-material-2-bas-uom-entity.interface';
import { MaterialComplete } from '../model/complete-class/material-complete.class';

/**
 * Material Uom data service
 */

@Injectable({
    providedIn: 'root'
})

export class BasicsMaterialUomDataService extends DataServiceFlatLeaf<IMdcMaterial2basUomEntity,IMaterialEntity,MaterialComplete>{
    public constructor(private basicsMaterialRecordDataService: BasicsMaterialRecordDataService) {
        const options: IDataServiceOptions<IMdcMaterial2basUomEntity> = {
            apiUrl: 'basics/material/basuom',
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
            roleInfo: <IDataServiceChildRoleOptions<IMdcMaterial2basUomEntity,IMaterialEntity,MaterialComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'Material2basUom',
                parent: basicsMaterialRecordDataService
            }
        };

        super(options);
    }

    public override isParentFn(parentKey: IMaterialEntity, entity: IMdcMaterial2basUomEntity): boolean {
		return entity.MdcMaterialFk === parentKey.Id;
	}
}
