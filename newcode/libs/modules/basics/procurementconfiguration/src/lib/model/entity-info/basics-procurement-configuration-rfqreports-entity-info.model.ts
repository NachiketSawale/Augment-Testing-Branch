/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsProcurementConfigurationRfqReportsDataService } from '../../services/basics-procurement-configuration-rfqreports-data.service';
import { BasicsProcurementConfigurationRfqReportsLayoutService } from '../../services/layouts/basics-procurement-configuration-rfqreports-layout.service';
import { ReportType } from '../enum/basics-procurement-configuration-report-type.enum';
import { IPrcConfig2ReportEntity } from '../entities/prc-config-2-report-entity.interface';


export const BASICS_PROCUREMENT_CONFIGURATION_RFQREPORTS_ENTITY_INFO = EntityInfo.create<IPrcConfig2ReportEntity>({
    grid: {
        title: {text: 'WizardConfig Reports', key: 'basics.procurementconfiguration.rfqReports'}
    },
    dataService: ctx => ctx.injector.get(BasicsProcurementConfigurationRfqReportsDataService),
    dtoSchemeId: {moduleSubModule: 'Basics.ProcurementConfiguration', typeName: 'PrcConfig2ReportDto'},
    permissionUuid: '85df95d7d06e4ae4b80a5e8d36fa5054',
    layoutConfiguration: context => {
        return context.injector.get(BasicsProcurementConfigurationRfqReportsLayoutService).generateLayout(ReportType.Reports);
    }
});