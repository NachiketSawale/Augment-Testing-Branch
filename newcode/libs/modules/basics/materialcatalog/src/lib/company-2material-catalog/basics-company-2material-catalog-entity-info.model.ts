/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { BasicsCompany2MaterialCatalogDataService } from './basics-company-2material-catalog-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsCompany2MaterialCatalogBehavior } from './basics-company-2material-catalog-behavior.service';
import { BasicsCompany2MaterialCatalogValidationService } from './basics-company-2material-catalog-validation.service';
import { ICompanies2MaterialCatalogEntity } from '../model/entities/companies-2-material-catalog-entity.interface';

export const BASICS_COMPANY_2MATERIAL_CATALOG_ENTITY_INFO = EntityInfo.create<ICompanies2MaterialCatalogEntity>({
	grid: {
		title: { text: 'Catalogs to Companies', key: 'basics.materialcatalog.catToCompanysTitle' },
		behavior: (ctx) => ctx.injector.get(BasicsCompany2MaterialCatalogBehavior),
		treeConfiguration: true,
	},
	dataService: (ctx) => ctx.injector.get(BasicsCompany2MaterialCatalogDataService),
	validationService: (context) => context.injector.get(BasicsCompany2MaterialCatalogValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.MaterialCatalog', typeName: 'Dtos.Companies2MaterialCatalogDto' },
	permissionUuid: '327f778df36d4c0181bfe3c3935121f7',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					key: 'cloud.common.entityProperties',
					text: 'Basic Data',
				},
				attributes: ['CompanyCode', 'CompanyName', 'IsOwner', 'CanEdit', 'CanLookup'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('basics.materialcatalog.', {
				IsOwner: {
					key: 'isOwner',
					text: 'Is Owner',
				},
				CanEdit: {
					key: 'canEdit',
					text: 'Can Edit',
				},
				CanLookup: {
					key: 'canLookup',
					text: 'Can Lookup',
				},
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				CompanyCode: {
					key: 'entityCompanyCode',
					text: 'Company Name',
				},
				CompanyName: {
					key: 'entityCompanyName',
					text: 'Company Name',
				},
			}),
		},
		overloads: {
			CompanyCode: {
				readonly: true,
			},
			CompanyName: {
				readonly: true,
			},
		},
	},
});
