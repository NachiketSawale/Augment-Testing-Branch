/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsProcurementConfigurationRfqCoverLetterOrEmailBodyDataService } from '../../services/basics-procurement-configuration-rfqcoverletteroremailbody-data.service';
import { BasicsProcurementConfigurationRfqReportsLayoutService } from '../../services/layouts/basics-procurement-configuration-rfqreports-layout.service';
import { ReportType } from '../enum/basics-procurement-configuration-report-type.enum';
import { IPrcConfig2ReportEntity } from '../entities/prc-config-2-report-entity.interface';


export const BASICS_PROCUREMENT_CONFIGURATION_RFQCOVERLETTEROREMAILBODY_ENTITY_INFO = EntityInfo.create<IPrcConfig2ReportEntity>({
    grid: {
        title: {
            text: 'WizardConfig Cover letter / Email Body',
            key: 'basics.procurementconfiguration.rfqCoverLetterOrEmailBody'
        }
    },
    dataService: ctx => ctx.injector.get(BasicsProcurementConfigurationRfqCoverLetterOrEmailBodyDataService),
    dtoSchemeId: {moduleSubModule: 'Basics.ProcurementConfiguration', typeName: 'PrcConfig2ReportDto'},
    permissionUuid: 'c6bf65718cfc4f6693802ed76b00a503',
    layoutConfiguration: context => {
        return context.injector.get(BasicsProcurementConfigurationRfqReportsLayoutService).generateLayout(ReportType.CoverLetterEmailBody);
    }
});