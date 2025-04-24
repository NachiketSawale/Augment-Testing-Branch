/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ICostCodeCompanyEntity } from '../../model/models';


@Injectable({
	providedIn: 'root'
})
export class BasicsCostCodesPriceVersionCompanyLayoutService {
	public async generateConfig(): Promise<ILayoutConfiguration<ICostCodeCompanyEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: ['Code','CompanyName','IsChecked']
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Code: { key: 'entityCode' }
				}),
				...prefixAllTranslationKeys('basics.costcodes.', {
					CompanyName: { key: 'companyName', text: 'Company Name' },
					IsChecked :{key:'checked', text:'checked'}

				})
			},
			overloads: {}
		};
	}
}
