/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { BasicsProcurementConfigConfigurationDataService } from './basics-procurement-config-configuration-data.service';
import { BasicsProcurementConfigurationHeaderDataService } from './basics-procurement-configuration-header-data.service';
import { IPrcConfig2dataformatEntity } from '../model/entities/prc-config-2-dataformat-entity.interface';
import { IPrcConfigurationEntity } from '../model/entities/prc-configuration-entity.interface';
import { PrcConfigurationComplete } from '../model/complete-class/prc-configuration-complete.class';

export const BASICS_PROCUREMENT_CONFIGURATION_RFQDATAFORMAT_DATA_TOKEN = new InjectionToken<BasicsProcurementConfigurationRfqDataFormatDataService>('basicsProcurementConfigurationRfqDataFormatDataToken');

/**
 * ProcurementConfiguration RfqDataFormat entity data service
 */
@Injectable({
    providedIn: 'root',
})
export class BasicsProcurementConfigurationRfqDataFormatDataService extends DataServiceFlatLeaf<IPrcConfig2dataformatEntity, IPrcConfigurationEntity, PrcConfigurationComplete> {

    public constructor(headerService: BasicsProcurementConfigurationHeaderDataService, parentService: BasicsProcurementConfigConfigurationDataService) {
        const options: IDataServiceOptions<IPrcConfig2dataformatEntity> = {
            apiUrl: 'basics/procurementconfiguration/configuration2dataformat',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list',
                usePost: false,
                prepareParam: ident => {
                    return {mainItemId: ident.pKey1};
                }
            },
            createInfo: {
                prepareParam: () => {
                    const header = headerService.getSelection()[0];
                    const selection = parentService.getSelection()[0];
                    return {
                        headerId: header.Id,
                        mainItemId: selection.Id
                    };
                }
            },
            roleInfo: <IDataServiceRoleOptions<IPrcConfig2dataformatEntity>>{
                role: ServiceRole.Leaf,
                itemName: 'PrcConfig2dataformat',
                parent: parentService
            },
        };

        super(options);
    }

    public override isParentFn(parentKey: IPrcConfigurationEntity, entity: IPrcConfig2dataformatEntity): boolean {
		return entity.PrcConfigurationFk === parentKey.Id;
	}
}
