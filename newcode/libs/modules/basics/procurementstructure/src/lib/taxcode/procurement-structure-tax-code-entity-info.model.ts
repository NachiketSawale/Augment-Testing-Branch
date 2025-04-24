/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsProcurementStructureTaxCodeDataService } from './basics-procurement-structure-tax-code-data.service';
import {BasicsProcurementStructureTaxCodeLayoutService} from './basics-procurement-structure-tax-code-layout.service';
import { IPrcStructureTaxEntity } from '@libs/basics/interfaces';
import { BasicsSharedCompanyContextService } from '@libs/basics/shared';



export const PROCUREMENT_STRUCTURE_TAX_CODE_ENTITY_INFO = EntityInfo.create<IPrcStructureTaxEntity>({
    dtoSchemeId: {moduleSubModule: 'Basics.ProcurementStructure', typeName: 'PrcStructureTaxDto'},
    permissionUuid: 'dad2902a334a43aa8f71cb9420ccd23e',
    grid: {
        title: {text: 'Tax Code', key: 'basics.procurementstructure.taxcodeContainerTitle'},
    },
    form: {
        containerUuid: '206ebd0323504a86ab8484b95089a140',
        title: {text: 'Tax Code Detail', key: 'basics.procurementstructure.taxcodeDetailContainerTitle'},
    },
    dataService: ctx => ctx.injector.get(BasicsProcurementStructureTaxCodeDataService),
    layoutConfiguration: context => {
        return context.injector.get(BasicsProcurementStructureTaxCodeLayoutService).generateLayout();
    },
	prepareEntityContainer:async (ctx) => {
		const companyContextSrv = ctx.injector.get(BasicsSharedCompanyContextService);
		await Promise.all([
			companyContextSrv.prepareLoginCompany(),
		]);
	}
});
