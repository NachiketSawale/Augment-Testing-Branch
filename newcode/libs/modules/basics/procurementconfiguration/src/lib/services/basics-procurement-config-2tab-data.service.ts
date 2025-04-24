/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { BasicsProcurementConfigurationHeaderDataService } from './basics-procurement-configuration-header-data.service';
import { BasicsProcurementConfigModuleDataService } from './basics-procurement-config-module-data.service';
import { IPrcConfiguration2TabEntity } from '../model/entities/prc-configuration-2-tab-entity.interface';
import { IPrcConfigHeaderEntity } from '../model/entities/prc-config-header-entity.interface';
import { PrcConfigurationHeaderComplete } from '../model/complete-class/prc-configuration-header-complete.class';

/**
 * The data service for procurement 2tab entity container.
 */
@Injectable({
    providedIn: 'root',
})
export class BasicsProcurementConfig2TabDataService extends DataServiceFlatLeaf<IPrcConfiguration2TabEntity, IPrcConfigHeaderEntity, PrcConfigurationHeaderComplete> {

    public constructor(headerService: BasicsProcurementConfigurationHeaderDataService, moduleService: BasicsProcurementConfigModuleDataService) {
        const options: IDataServiceOptions<IPrcConfiguration2TabEntity> = {
            apiUrl: 'basics/procurementconfiguration/configuration2tab',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'getlist',
                usePost: false,
                prepareParam: ident => {
                    const parent = headerService.getSelection()[0];
                    const module = moduleService.getSelection()[0];

                    if (!parent) {
                        throw new Error('Parent entity in not selected');
                    }
                    if (module) {
                        return {moduleId: module.Id, mainItemId: parent.Id};
                    } else {
                        return {mainItemId: -1};
                    }
                }
            },
            createInfo: {
                prepareParam: () => {
                    const parent = headerService.getSelection()[0];
                    return {
                        mainItemId: parent.Id
                    };
                }
            },
            roleInfo: <IDataServiceRoleOptions<IPrcConfiguration2TabEntity>>{
                role: ServiceRole.Leaf,
                itemName: 'PrcConfiguration2Tab',
                parent: headerService
            }
        };
        super(options);

        moduleService.selectionChanged$.subscribe(() => {
            headerService.save().then(() => {
                // id is useless here
                this.load({id: 0});
            });
        });
    }

    public override isParentFn(parentKey: IPrcConfigHeaderEntity, entity: IPrcConfiguration2TabEntity): boolean {
		return entity.PrcConfigHeaderFk === parentKey.Id;
	}
}