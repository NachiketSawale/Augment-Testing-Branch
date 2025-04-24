import { inject, Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { ILogisticCardEntity } from '@libs/logistic/interfaces';
import { LogisticCardDataService } from '../logistic-card-data.service';

@Injectable({
	providedIn: 'root'
})

/**
 * Logistic Card LookupService is a lookup for logistic card
 */
export class LogisticCardLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<ILogisticCardEntity, T> {
	/**
	 * Used to inject logistic card data service.
	 */
	private logisticCardDataService = inject(LogisticCardDataService);

	public constructor() {
		super(
			{
				httpRead: {
					route: 'logistic/card/card/',
					endPointRead: 'searchlist',
					usePostForRead: true,
				},
				filterParam: true,
				prepareListFilter: (context) => {
					return {
						Id: null, PKey1: null, PKey2: null, PKey3: null
					};
				},
			},
			{
				uuid: '519e10079809486abd0817f9ffefb717',
				idProperty: 'Code',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig: {
					columns: [
						{
							id: 'Code',
							model: 'Code',
							width: 100,
							type: FieldType.Translation,
							label: {
								text: 'Code',
								key: 'cloud.common.entityCode'
							},
							sortable: true
						},
						{
							id: 'Description',
							model: 'DescriptionInfo',
							width: 300,
							type: FieldType.Translation,
							label: {
								text: 'Description',
								key: 'cloud.common.entityDescription'
							},
							sortable: true
						},
					]
				}
			});
	}

}