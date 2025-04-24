/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { BasicsProcurementConfigConfigurationDataService } from '../basics-procurement-config-configuration-data.service';
import { ReportType } from '../../model/enum/basics-procurement-configuration-report-type.enum';
import { IPrcConfig2ReportEntity } from '../../model/entities/prc-config-2-report-entity.interface';
import { IPrcConfigurationEntity } from '../../model/entities/prc-configuration-entity.interface';
import { PrcConfigurationComplete } from '../../model/complete-class/prc-configuration-complete.class';


/**
 * ProcurementConfiguration RfqReports base entity data service`
 */
@Injectable({
    providedIn: 'root',
})
export class BasicsProcurementConfigurationRfqReportsBaseDataService extends DataServiceFlatLeaf<IPrcConfig2ReportEntity, IPrcConfigurationEntity, PrcConfigurationComplete> {
    public constructor(reportType: ReportType, parentService: BasicsProcurementConfigConfigurationDataService) {
        const options: IDataServiceOptions<IPrcConfig2ReportEntity> = {
            apiUrl: 'basics/procurementconfiguration/configuration2report',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list',
                usePost: false,
                prepareParam: ident => {
                    return {
                        mainItemId: ident.pKey1,
                        reportType: reportType
                    };
                }
            },
            createInfo: {
                prepareParam: () => {
                    const selection = parentService.getSelection()[0];
                    return {
                        mainItemId: selection.Id,
                        reportType: reportType
                    };
                }
            },
            roleInfo: <IDataServiceRoleOptions<IPrcConfig2ReportEntity>>{
                role: ServiceRole.Leaf,
                itemName: 'PrcConfig2Report',
                parent: parentService
            },
        };

        super(options);
    }

    public override isParentFn(parentKey: IPrcConfigurationEntity, entity: IPrcConfig2ReportEntity): boolean {
		return entity.PrcConfigurationFk === parentKey.Id;
	}
}
