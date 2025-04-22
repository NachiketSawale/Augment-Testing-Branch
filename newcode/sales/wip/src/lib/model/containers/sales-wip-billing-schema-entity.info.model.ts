/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { PlatformConfigurationService, prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsShareControllingUnitLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { SalesWipBillingSchemaDataService } from '../../services/sales-wip-billing-schema-data.service';
import { IWipBillingschemaEntity } from '../entities/wip-billingschema-entity.interface';
import { createLookup, FieldType } from '@libs/ui/common';
import { inject } from '@angular/core';

/**
 * Entity info for basics billing schema
 */
export const SALES_WIP_BILLING_SCHEMA_ENTITY_INFO: EntityInfo = EntityInfo.create<IWipBillingschemaEntity> ({
	grid: {
		title: {key: 'sales.wip.containerBillingschema'}
	},
	dataService: ctx => ctx.injector.get(SalesWipBillingSchemaDataService),
	dtoSchemeId: {moduleSubModule: 'Sales.Wip', typeName: 'WipBillingschemaDto'},
	permissionUuid: 'c8faaacfa60c4790845e06aafd370ec5',
	layoutConfiguration: {
		groups: [
			{gid: 'Basic Data', attributes: ['BillingLineTypeFk','Sorting', 'BillingSchemaFk', 'Description','Value','Result','ResultOc','CredFactor','DebFactor','IsPrinted','ControllingUnitFk',
					'CostLineTypeFk', 'AccountNo']},
		],
		overloads: {
			BillingLineTypeFk:  BasicsSharedCustomizeLookupOverloadProvider.provideBillingLineTypeReadonlyLookupOverload(),
			BillingSchemaFk: BasicsSharedLookupOverloadProvider.provideBillingSchemaLookupOverload(true),
			ControllingUnitFk: {
				readonly: true,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsShareControllingUnitLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'DescriptionInfo.Translated',
					serverSideFilter: {
						key: 'controlling-actuals-controlling-unit-filter',
						execute: context => {
							return {
								ByStructure: true,
								ExtraFilter: false,
								CompanyFk: inject(PlatformConfigurationService).getContext().clientId,
								FilterKey: 'controlling.structure.estimate.prjcontrollingunit.filterkey',
								IsProjectReadonly: true,
								IsCompanyReadonly: true
							};
						}
					},
					selectableCallback: e => {
						return true;
					}
				})
			},
			CostLineTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideCostLineTypeLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('basics.billingschema.', {
				BillingLineTypeFk: {key: 'entityBillingLineTypeFk'},
				CostLineTypeFk: {key: 'costLineTypeFk'},
				AccountNo: {key: 'entityAccountNo'}
			})
		},
	}
});