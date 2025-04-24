/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsProcurementStructureAccountDataService } from './basics-procurement-structure-account-data.service';
import { BasicsProcurementStructureAccountLayoutService } from './basics-procurement-structure-account-layout.service';
import { IPrcStructureAccountEntity } from '../model/entities/prc-structure-account-entity.interface';
import { BasicsSharedAccountingLookupService, BasicsSharedCompanyContextService } from '@libs/basics/shared';
import { BasicsProcurementStructureAccountValidationService } from './basics-procurement-structure-account-validation.service';

export const PROCUREMENT_STRUCTURE_ACCOUNT_ENTITY_INFO = EntityInfo.create<IPrcStructureAccountEntity>({
	dtoSchemeId: {moduleSubModule: 'Basics.ProcurementStructure', typeName: 'PrcStructureAccountDto'},
	permissionUuid: '37c88cbd986348ebb87de6fc9f34a56a',
	grid: {
		title: {text: 'Account', key: 'basics.procurementstructure.accountsContainerTitle'},
	},
	form: {
		containerUuid: 'cdf8629f4aed45a88331ca58313b99c6',
		title: {text: 'Account Detail', key: 'basics.procurementstructure.accountsDetailContainerTitle'},
	},
	dataService: ctx => ctx.injector.get(BasicsProcurementStructureAccountDataService),
	layoutConfiguration: context => {
		return context.injector.get(BasicsProcurementStructureAccountLayoutService).generateLayout();
	},
	validationService: (ctx) => ctx.injector.get(BasicsProcurementStructureAccountValidationService),
	prepareEntityContainer: async (ctx) => {
		const basicsSharedAccountingLookupService = ctx.injector.get(BasicsSharedAccountingLookupService);
		const companyContextSrv = ctx.injector.get(BasicsSharedCompanyContextService);
		await Promise.all([
			basicsSharedAccountingLookupService.getList(),
			companyContextSrv.prepareLoginCompany(),
		]);
	}
});
