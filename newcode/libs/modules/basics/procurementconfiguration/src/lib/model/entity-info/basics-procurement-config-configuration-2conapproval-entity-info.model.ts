/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsProcurementConfigConfiguration2ConApprovalDataService } from '../../services/basics-procurement-config-configuration-2conapproval-data.service';
import { BasicsPrcConfigConfiguration2ConApprovalLayoutService } from '../../services/layouts/basics-procurement-config-configuration-2conapproval-layout.service';
import { IPrcConfig2ConApprovalEntity } from '../entities/prc-config-2-con-approval-entity.interface';


export const BASICS_PROCUREMENT_CONFIG_CONFIGURATION_2CONAPPROVAL_ENTITY_INFO = EntityInfo.create<IPrcConfig2ConApprovalEntity>({
    grid: {
        title: {text: 'Contract Approvals', key: 'basics.procurementconfiguration.conApprovalGridTitle'}

    },
    form: {
        containerUuid: '07db0663d70a4faf8935f20781dc890d',
        title: {text: 'Contract Approval Detail', key: 'basics.procurementconfiguration.conApprovalDetailTitle'}
    },
    dataService: ctx => ctx.injector.get(BasicsProcurementConfigConfiguration2ConApprovalDataService),
    dtoSchemeId: {moduleSubModule: 'Basics.ProcurementConfiguration', typeName: 'PrcConfig2ConApprovalDto'},
    permissionUuid: '82741e02ee8e4aa6825be937c9b7765f',
    layoutConfiguration: context => {
        return context.injector.get(BasicsPrcConfigConfiguration2ConApprovalLayoutService).generateLayout();
    }
});