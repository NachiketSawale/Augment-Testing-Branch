/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, IFormConfig, IFormDialogConfig } from '@libs/ui/common';
import { SetProjectCurrencyRate } from './set-project-currency-rate.class';

import { IProjectMainCurrencyRateEntity } from '@libs/project/interfaces';
import { BasicsSharedCurrencyRateTypeLookupService } from '@libs/basics/shared';

export class SetProjectCurrencyRateDialogConfig {
	public createFormConfiguration(currency: IProjectMainCurrencyRateEntity):IFormDialogConfig<SetProjectCurrencyRate>{
		return <IFormDialogConfig<SetProjectCurrencyRate>> {
			headerText: 'project.main.titleUpdateCurrencyExchangeRates',
			id: 'project.main.ChangeProjectGroup',
			entity: currency,
			formConfiguration: <IFormConfig<SetProjectCurrencyRate>> {
				showGrouping: false,
				groups: [
					{
						groupId: 'baseGroup',
						header: {text: ''},
					},
				],
				rows: [
					{
						id: 'CurrencyRateTypeFk',
						label: 'basics.currency.RateType',
						model: 'CurrencyRateTypeFk',
						type: FieldType.Lookup,
						sortOrder: 1,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedCurrencyRateTypeLookupService,
							showClearButton: false,
							showDescription: true,
							descriptionMember: 'DescriptionInfo.Translated'
						})
					}
				]
			}
		};
	}
}