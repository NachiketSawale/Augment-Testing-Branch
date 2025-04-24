/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IEstLineItemSelStatementEntity } from '@libs/estimate/interfaces';

/**
 * estimate line item selection statement layout service
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateLineItemSelectionStatementLayoutService {
	/**
	 * Generate layout configuration
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IEstLineItemSelStatementEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'IsExecute',
						'WicCatFk',
						'LoggingMessage',
						'Code',
						'DescriptionInfo',
						'SelectStatement',
						'EstAssemblyFk',
						'BoqHeaderItemFk',
						'BoqItemFk',
						'WicItemFk',
						'WicItemFk',
						'Quantity',
						'PsdActivityFk',
						'MdlModelFk',
						'ObjectSelectStatement',
					],
				},
			],
			labels: {
				...prefixAllTranslationKeys('estimate.main.', {
					IsExecute: {
						key: 'lineItemSelStatement.isExecute',
						text: 'Select',
					},
					WicCatFk: {
						key: 'lineItemSelStatement.wicCatFk',
						text: 'WIC Catalogue Ref.No.',
					},
					LoggingMessage: {
						key: 'loggingMessage',
						text: 'Last Execution History',
					},
					SelectStatement: {
						key: 'lineItemSelStatement.selectStatement',
						text: 'Select Statement',
					},
					EstAssemblyFk: {
						key: 'estAssemblyFk',
						text: 'Assembly Template',
					},
					BoqHeaderItemFk: {
						key: 'boqRootRef',
						text: 'BoQ Root Item Ref. No.',
					},
					BoqItemFk: {
						key: 'boqItemFk',
						text: 'BoQ Item Ref. No.',
					},
					WicItemFk: {
						key: 'lineItemSelStatement.wicItemRefNo',
						text: 'WIC Item Ref. No.',
					},
					PsdActivityFk: {
						key: 'psdActivityFk',
						text: 'PsdActivity',
					},
					ObjectSelectStatement: {
						key: 'lineItemSelStatement.objectSelectStatement',
						text: 'Object Select Statement',
					},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Code: {
						key: 'entityCode',
						text: 'Code',
					},
					DescriptionInfo: {
						key: 'entityDescription',
						text: 'Description',
					},
					Quantity: {
						key: 'entityQuantity',
						text: 'Quantity',
					},
				}),
				...prefixAllTranslationKeys('model.main.', {
					MdlModelFk: {
						key: 'entityModel',
						text: 'Model',
					},
				}),
			},
			overloads: {
				WicCatFk: {
					readonly: true,
				},
				BoqHeaderItemFk: {
					readonly: true,
				},
				WicItemFk: {
					readonly: true,
				},
			},
		};
	}
}
