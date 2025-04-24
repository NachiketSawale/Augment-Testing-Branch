/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { inject, Injectable, Injector, ProviderToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification, IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { IPrcGeneralsEntity } from '../model/entities/prc-generals-entity.interface';
import { BasicsSharedCompanyContextService, BasicsSharedGeneralTypeLookupService, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ProcurementCommonGeneralsDataService } from '../services/procurement-common-generals-data.service';
import { ProcurementSharedLookupOverloadProvider } from '@libs/procurement/shared';

/**
 * Common procurement Generals layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonGeneralsLayoutService {
	private readonly injector = inject(Injector);
	private readonly companyContextService = inject(BasicsSharedCompanyContextService);

	public async generateLayout<T extends IPrcGeneralsEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(
		context: IInitializationContext,
		config: {
			dataServiceToken: ProviderToken<ProcurementCommonGeneralsDataService<T, PT, PU>>;
		},
	): Promise<ILayoutConfiguration<T>> {
		const dataService = this.injector.get(config.dataServiceToken);

		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['CommentText', 'PrcGeneralstypeFk', 'ControllingUnitFk', 'TaxCodeFk', 'Value', 'ValueType'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					PrcGeneralstypeFk: { key: 'entityType' },
					ControllingUnitFk: { key: 'entityControllingUnitCode' },
					TaxCodeFk: { key: 'entityTaxCode' },
					CommentText: { key: 'entityComment' },
				}),
				...prefixAllTranslationKeys('procurement.common.', {
					Value: { key: 'generalsValue' },
					ValueType: { key: 'generalsValueType' },
				}),
			},
			overloads: {
				PrcGeneralstypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedGeneralTypeLookupService,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
						//only support client side filter currently. But to support serverside filter will be better
						clientSideFilter: {
							execute: (item) => {
								return item.LedgerContextFk === this.companyContextService.loginCompanyEntity.LedgerContextFk && item.IsProcurement;
							},
						},
					}),
				},
				ControllingUnitFk: await ProcurementSharedLookupOverloadProvider.provideProcurementControllingUnitLookupOverload(context, {
					controllingUnitGetter: (e) => e.ControllingUnitFk,
					lookupOptions: {
						serverSideFilter: {
							key: 'prc.con.controllingunit.by.prj.filterkey',
							execute: (context) => {
								return dataService.controllingUnitSideFilterValue();
							},
						},
						selectableCallback: (e) => {
							return e.Isaccountingelement;
							// TODO - checkIsAccountingElement other logic
						},
					},
				}),
				TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true),
				ValueType: BasicsSharedLookupOverloadProvider.provideGeneralsValueTypeReadonlyLookupOverload(),
			},
		};
	}
}
