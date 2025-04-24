/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ResourceRequisitionItemDataService } from '../services/resource-requisition-item-data.service';
import { IRequisitionitemEntity } from '@libs/resource/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ResourceRequisitionItemValidationService } from '../services/resource-requisition-item-validation.service';


export const RESOURCE_REQUISITION_ITEM_ENTITY_INFO: EntityInfo = EntityInfo.create<IRequisitionitemEntity>({
	grid: {
		title: {key: 'resource.requisition' + '.requisitionItemListTitle'},
	},
	form: {
		title: {key: 'resource.requisition' + '.requisitionItemDetailTitle'},
		containerUuid: 'a0db7de7ef924b25bebfabae05c68fe1',
	},
	dataService: ctx => ctx.injector.get(ResourceRequisitionItemDataService),
	validationService: (ctx) => ctx.injector.get(ResourceRequisitionItemValidationService),
	dtoSchemeId: {moduleSubModule: 'Resource.Requisition', typeName: 'RequisitionitemDto'},
	permissionUuid: '2236d94d1c8f4cdd8f9ab9150492ccdb',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['ReservationId', 'StockFk', 'UomFk', 'MaterialFk', 'Description', 'Quantity', 'UserDefinedText01', 'UserDefinedText02', 'UserDefinedText03', 'UserDefinedText04', 'UserDefinedText05'],
			}
		],
		overloads: {
			UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			MaterialFk: BasicsSharedLookupOverloadProvider.provideMaterialLookupOverload(true),
			StockFk: BasicsSharedLookupOverloadProvider.providePrcStockTransactionTypeLookupOverload(true),

		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				Description: {key: 'entityDescription'},
				Quantity: {key: 'entityQuantity'},
				UomFk: {key: 'entityUoM'},
				UserDefinedText01: {
					key: 'entityUserDefText',
					params: {p_0: '1'},
				},
				UserDefinedText02: {
					key: 'entityUserDefText',
					params: {p_0: '2'},
				},
				UserDefinedText03: {
					key: 'entityUserDefText',
					params: {p_0: '3'},
				},
				UserDefinedText04: {
					key: 'entityUserDefText',
					params: {p_0: '4'},
				},
				UserDefinedText05: {
					key: 'entityUserDefText',
					params: {p_0: '5'},
				},

			}), ...prefixAllTranslationKeys('controlling.structure.', {
				StockFk: {key: 'stock'},

			}), ...prefixAllTranslationKeys('basics.material.', {
				MaterialFk: {key: 'record.materialGroup'},
			}), ...prefixAllTranslationKeys('basics.requisition.', {
				ReservationId: {key: 'ReservationId'},


			})

		}
	},

});