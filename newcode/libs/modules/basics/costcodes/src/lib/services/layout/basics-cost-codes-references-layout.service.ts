/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, ILayoutConfiguration, createLookup } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ICostCodesRefrenceEntity } from '@libs/basics/interfaces';
import { BasicsCostCodesReferenceDetailsStackLookupService } from '@libs/basics/shared';

/**
 * Basics Cost Codes Refrence Layout Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsCostCodesRefrenceLayoutService {

	public async generateConfig(): Promise<ILayoutConfiguration<ICostCodesRefrenceEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: ['Source', 'DetailsStack']
				}
			],
			labels: {
				...prefixAllTranslationKeys('basics.costcodes.', {
					DetailsStack: { key: 'detailsstack', text: 'Details Stack' },
					Source: { key: 'source', text: 'Source' }
				})
			},
			overloads: {

				DetailsStack: {
					readonly: false,
					type: FieldType.Lookup,
					lookupOptions:
						createLookup(
							{
								dataServiceToken: BasicsCostCodesReferenceDetailsStackLookupService
							}
						)
				}
			}
		};
	}
}
