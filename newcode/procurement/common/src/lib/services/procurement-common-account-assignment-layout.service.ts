/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { inject, Injectable, Injector, ProviderToken, runInInjectionContext } from '@angular/core';
import { CompleteIdentification, IEntityIdentification, prefixAllTranslationKeys } from '@libs/platform/common';
import { IPrcCommonAccountAssignmentEntity } from '../model/entities/procurement-common-account-assignment-entity.interface';
import { ProcurementCommonAccountAssignmentDataService } from './procurement-common-account-assignment-data.service';
import {
	BasicsShareCompanyYearLookupService,
	BasicsShareControllingUnitLookupService,
	BasicsSharedAccountAssignmentAccountTypeLookupService,
	BasicsSharedAccountAssignmentFactoryLookupService,
	BasicsSharedAccountAssignmentItemTypeLookupService,
	BasicsSharedAccountAssignmentMatGroupLookupService,
	BasicsSharedBasAccountLookupService, BasicsSharedLookupOverloadProvider,
} from '@libs/basics/shared';

/**
 * Common procurement account assignment layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonAccountAssignmentLayoutService<T extends IPrcCommonAccountAssignmentEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> {
	private readonly injector = inject(Injector);

	public async generateLayout(config: {
		dataServiceToken: ProviderToken<ProcurementCommonAccountAssignmentDataService<T, PT, PU>>;
	}): Promise<ILayoutConfiguration<T>> {
		return runInInjectionContext(this.injector, () => {
			return <ILayoutConfiguration<T>>{
				groups: [
					{
						gid: 'baseGroup',
						title: {
							key: 'cloud.common.entityProperties',
							text: 'Basic Data',
						},
						attributes: [
							'ItemNO',
							'BreakdownPercent',
							'BreakdownAmount',
							'BasCompanyYearFk',
							'MdcControllingUnitFk',
							//'PsdScheduleFk',
							//'PsdActivityFk',
							'Remark',
							'Version',
							//'ConCrewFk',
							'Description',
							'Quantity',
							'BasAccountFk',
							'IsDelete',
							'IsFinalInvoice',
							'BreakdownAmountOc',
							'BasUomFk',
							'DateDelivery',
							'AccountAssignment01',
							'AccountAssignment02',
							'BasAccAssignItemTypeFk',
							'BasAccAssignMatGroupFk',
							'BasAccAssignAccTypeFk',
							'AccountAssignment03',
							'BasAccAssignFactoryFk',
						],
					},
				],
				labels: {
					...prefixAllTranslationKeys('cloud.common.', {
						Remark: {key: 'entityRemark'},
						Description: {key: 'entityDescription'},
					}),
					...prefixAllTranslationKeys('procurement.common.', {
						ItemNO: {key: 'accountAssign.EntityItemNO'},
						BreakdownPercent: {key: 'accountAssign.EntityBreakdownPercent'},
						BreakdownAmount: {key: 'accountAssign.EntityBreakdownAmount'},
						BasCompanyYearFk: {key: 'accountAssign.EntityBasCompanyYearFk'},
						MdcControllingUnitFk: {key: 'accountAssign.EntityMdcControllingUnitFk'},
						Version: {key: 'accountAssign.Version'},
						Quantity: {key: 'transaction.quantity'},
						BasAccountFk: {key: 'accountAssign.BasAccount'},
						IsDelete: {key: 'accountAssign.AccIsDelete'},
						IsFinalInvoice: {key: 'accountAssign.AccIsFinalInvoice'},
						BreakdownAmountOc: {key: 'accountAssign.BreakdownAmountOc'},
						BasUomFk: {key: 'accountAssign.BasUom'},
						DateDelivery: {key: 'entityDateDelivered'},
						AccountAssignment01: {key: 'accountAssign.AccountAssignment01'},
						AccountAssignment02: {key: 'accountAssign.AccountAssignment02'},
						BasAccAssignItemTypeFk: {key: 'accountAssign.ConAccountItemType'},
						BasAccAssignMatGroupFk: {key: 'accountAssign.ConAccountMaterialGroup'},
						BasAccAssignAccTypeFk: {key: 'accountAssign.AccountAssignAccType'},
						AccountAssignment03: {key: 'accountAssign.AccountAssignment03'},
						BasAccAssignFactoryFk: {key: 'accountAssign.AccountAssignFactory'},
					}),
				},
				overloads: {
					BasCompanyYearFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsShareCompanyYearLookupService,
							showClearButton: true,
						}),
					},
					MdcControllingUnitFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsShareControllingUnitLookupService,
							showClearButton: true,
							/* TODO: related to ticket https://rib-40.atlassian.net/browse/DEV-17789
							considerPlanningElement: true,
							selectableCallback: (item, context) => {
								return true;
						}*/
						}),
					},
					BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
					BasAccAssignItemTypeFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedAccountAssignmentItemTypeLookupService,
							showClearButton: true,
						}),
					},
					BasAccountFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedBasAccountLookupService,
							showClearButton: true,
						}),
					},
					BasAccAssignMatGroupFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedAccountAssignmentMatGroupLookupService,
							showClearButton: true,
						}),
					},
					BasAccAssignAccTypeFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedAccountAssignmentAccountTypeLookupService,
							showClearButton: true,
						}),
					},
					BasAccAssignFactoryFk: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedAccountAssignmentFactoryLookupService,
							showClearButton: true,
						}),
					},
				},
			};
		});
	}
}
