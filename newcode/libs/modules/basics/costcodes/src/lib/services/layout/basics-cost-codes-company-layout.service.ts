/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ICostCodesUsedCompanyEntity } from '../../model/models';

/**
 * Basics cost codes company layout service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsCostCodesCompanyLayoutService {

	public async generateConfig(): Promise<ILayoutConfiguration<ICostCodesUsedCompanyEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['Code', 'CompanyName', 'IsChecked']
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Code: { key: 'entityCode' }
				}),
				...prefixAllTranslationKeys('basics.costcodes.', {
					CompanyName: { key: 'companyName', text: 'Company Name' },
					IsChecked: { key: 'checked', text: 'checked' }

				})
			},
			overloads: {}
		};
	}
}
