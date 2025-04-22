/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { BusinessPartnerSharedLookupLayoutProvider } from '@libs/businesspartner/shared';
import { IConCrewEntity } from '../model/entities/con-crew-entity.interface';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN } from '@libs/businesspartner/interfaces';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ProcurementContractCrewDataService } from './procurement-contract-crew-data.service';

/**
 * Crew layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementContractCrewLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private readonly bpSharedLookupLayoutProvider = inject(BusinessPartnerSharedLookupLayoutProvider);

	public async generateConfig(): Promise<ILayoutConfiguration<IConCrewEntity>> {
		const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
		const layout = <ILayoutConfiguration<IConCrewEntity>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['DescriptionInfo', 'BpdContactFk', 'Sorting', 'IsDefault', 'IsLive', 'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('procurement.contract.', {
					BpdContactFk: { key: 'entityBpdContactFk', text: 'Contact' },
					Sorting: { key: 'entitySorting', text: 'Sorting' },
					IsDefault: { key: 'entityIsDefault', text: 'Is Default' },
					IsLive: { key: 'entityIsLive', text: 'Is Live' },
					UserDefined1: { key: 'entityUserDefined1', text: 'User Defined 1' },
					UserDefined2: { key: 'entityUserDefined2', text: 'User Defined 2' },
					UserDefined3: { key: 'entityUserDefined3', text: 'User Defined 3' },
					UserDefined4: { key: 'entityUserDefined4', text: 'User Defined 4' },
					UserDefined5: { key: 'entityUserDefined5', text: 'User Defined 5' },
					DescriptionInfo: { key: 'updateFrameworkMaterialCatalog.entityDescription', text: 'Description' },
				}),
			},
			overloads: {
				BpdContactFk: bpRelatedLookupProvider.getContactLookupOverload({ showClearButton: true }),
				MdcTaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true),
			},
		};

		this.bpSharedLookupLayoutProvider.provideContactLookupFields<IConCrewEntity>(layout, {
			gid: 'basicData',
			lookupKeyGetter: (e) => e.BpdContactFk,
			dataService: ProcurementContractCrewDataService,
		});

		return layout;
	}
}
