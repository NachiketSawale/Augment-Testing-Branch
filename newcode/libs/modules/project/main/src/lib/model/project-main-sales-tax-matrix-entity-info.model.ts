/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ProjectMainSalesTaxMatrixDataService } from '../services/project-main-sales-tax-matrix-data.service';
import { ProjectMainSalesTaxMatrixValidationService } from '../services/project-main-sales-tax-matrix-validation.service';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ISalesTaxMatrixEntity } from '@libs/project/interfaces';
import { BasicsSharedCompanyContextService } from '@libs/basics/shared';

export const projectMainSalesTaxMatrixEntityInfo: EntityInfo = EntityInfo.create({
	grid: {
		title: {key: 'project.main.salestaxmatrixListTitle'},
	},
	form: {
		title: { key: 'project.main.salestaxmatrixDetailTitle' },
		containerUuid: 'fc8217925f694f2296112740a1aa8b1b',
	},
	dataService: ctx => ctx.injector.get(ProjectMainSalesTaxMatrixDataService),
	validationService: ctx => ctx.injector.get(ProjectMainSalesTaxMatrixValidationService),
	dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'SalesTaxMatrixDto'},
	permissionUuid: '08a1a648b75547dda3fa06bb151a1eee',
	prepareEntityContainer: async ctx => {
		const companyContextSrv = ctx.injector.get(BasicsSharedCompanyContextService);
		await companyContextSrv.prepareLoginCompany();
	},
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['SalesTaxGroupFk', 'PrjTaxPercent', 'TaxPercent']}
		],
		overloads: {
			SalesTaxGroupFk: ProjectSharedLookupOverloadProvider.provideProjectSalesTaxGroupLookupOverload(true),
			TaxPercent: {readonly: true}
		},
		labels: {
			...prefixAllTranslationKeys('project.main.', {
				SalesTaxGroupFk: { key: 'SalesTaxGroupEntity'},
				PrjTaxPercent: { key: 'PrjTaxPercentEntity'},
				TaxPercent: { key: 'TaxPercentEntity'},
			})
		}
	},
} as IEntityInfo<ISalesTaxMatrixEntity>);