/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LazyInjectable, prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { BASICS_SCOPE_DETAIL_ENTITY_LAYOUT_GENERATOR, IMaterialScopeDetailEntity, IEntityLayoutGenerator } from '@libs/basics/interfaces';
import {
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedLookupOverloadProvider,
} from '@libs/basics/shared';

@Injectable({
	providedIn: 'root'
})
@LazyInjectable({
	token: BASICS_SCOPE_DETAIL_ENTITY_LAYOUT_GENERATOR
})
export class BasicsMaterialScopeDetailLayoutService<T extends IMaterialScopeDetailEntity>  implements IEntityLayoutGenerator<T>{

	public generateLayout(): ILayoutConfiguration<T> {
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data'
					},
					attributes: [
						'Total',
						'ScopeOfSupplyTypeFk',
						'ItemNo',
						'PrcStructureFk',
						'Description1Info',
						'Description2Info',
						'SpecificationInfo',
						'Quantity',
						'UomFk',
						'Price',
						'PrcPriceConditionFk',
						'PriceExtra',
						'PriceUnit',
						'UomPriceUnitFk',
						'FactorPriceUnit',
						'DateRequired',
						'PaymentTermFiFk',
						'PaymentTermPaFk',
						'PrcIncotermFk',
						'Address',
						'HasText',
						'SupplierReference',
						'Trademark',
						'CommentText',
						'Remark',
						'QuantityAskedFor',
						'QuantityDelivered',
						'Batchno',
						'UserDefined1',
						'UserDefined2',
						'UserDefined3',
						'UserDefined4',
						'UserDefined5',
						'MaterialFk'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('basics.material.', {
					'ScopeOfSupplyTypeFk': {
						'key': 'entityScopeOfSupplyType',
						'text': 'Scope Of Supply Type'
					},
					'Description2Info': {
						'key': 'record.furtherDescription',
						'text': 'Further Description'
					},
					'PriceExtra': {
						'key': 'portion.priceExtras',
						'text': 'Price Extras'
					},
					'Trademark': {
						'key': 'entityTrademark',
						'text': 'Trademark'
					},
					'MaterialFk': {
						'key': 'record.material',
						'text': 'Material'
					},
					'ItemNo': {
						'key': 'prcItemItemNo',
						'text': 'Item No.'
					},
					'HasText': {
						'key': 'prcItemHasText',
						'text': 'Has Text'
					},
					'SupplierReference': {
						'key': 'prcItemSupplierReference',
						'text': 'Supplier Reference'
					},
					'QuantityAskedFor': {
						'key': 'prcItemQuantityAskedfor',
						'text': 'Quantity Asked for'
					},
					'QuantityDelivered': {
						'key': 'prcItemQuantityDelivered',
						'text': 'Quantity Delivered'
					},
					'Batchno': {
						'key': 'prcItemBatchno',
						'text': 'Batchno'
					}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					'Description1Info': {
						'key': 'entityDescription',
						'text': 'Description'
					},
					'SpecificationInfo': {
						'key': 'EntitySpec',
						'text': 'Specification'
					},
					'UomFk': {
						'key': 'entityUoM',
						'text': 'UoM'
					},
					'Price': {
						'key': 'entityPrice',
						'text': 'Price'
					},
					'Total': {
						'key': 'entityTotal',
						'text': 'Total'
					},
					'Quantity': {
						'key': 'entityQuantity',
						'text': 'Quantity'
					},
					'PrcPriceConditionFk': {
						'key': 'entityPriceCondition',
						'text': 'Price Condition'
					},
					'PriceUnit': {
						'key': 'entityPriceUnit',
						'text': 'Price Unit'
					},
					'UomPriceUnitFk': {
						'key': 'entityPriceUnitUoM',
						'text': 'Price Unit UoM'
					},
					'FactorPriceUnit': {
						'key': 'entityFactor',
						'text': 'Factor'
					},
					'DateRequired': {
						'key': 'entityRequiredBy',
						'text': 'Required By'
					},
					'PaymentTermFiFk': {
						'key': 'entityPaymentTermFI',
						'text': 'Payment Term (FI)'
					},
					'PaymentTermPaFk': {
						'key': 'entityPaymentTermPA',
						'text': 'Payment Term (PA)'
					},
					'PrcIncotermFk': {
						'key': 'entityIncoterms',
						'text': 'Incoterms'
					},
					'Address': {
						'key': 'entityAddress',
						'text': 'Address'
					},
					'CommentText': {
						'key': 'entityCommentText',
						'text': 'Comment'
					},
					'Remark': {
						'key': 'entityRemark',
						'text': 'Remarks'
					},
					'PrcStructureFk': {
						'text': 'Structure',
						'key': 'entityStructure'
					},
					'UserDefined1': {
						key: 'entityUserDefined',
						text: 'User-Defined 1',
						params: {'p_0': '1'}
					},
					'UserDefined2': {
						key: 'entityUserDefined',
						text: 'User-Defined 2',
						params: {'p_0': '2'}
					},
					'UserDefined3': {
						key: 'entityUserDefined',
						text: 'User-Defined 3',
						params: {'p_0': '3'}
					},
					'UserDefined4': {
						key: 'entityUserDefined',
						text: 'User-Defined 4',
						params: {'p_0': '4'}
					},
					'UserDefined5': {
						key: 'entityUserDefined',
						text: 'User-Defined 5',
						params: {'p_0': '5'}
					}
				})
			},
			overloads: {
				ScopeOfSupplyTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideScopeOfSupplyTypeLookupOverload(false), 
				PrcStructureFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true), 
				PaymentTermFiFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(true, 'Description'), 
				PaymentTermPaFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(true, 'Description'),
				PrcIncotermFk: BasicsSharedLookupOverloadProvider.providePrcIncotermLookupOverload(true), 
				Address: BasicsSharedLookupOverloadProvider.providerAddressDialogComponentOverload(true),
				//TODO: implement the filter here
				MaterialFk: BasicsSharedLookupOverloadProvider.provideMaterialLookupOverload(true),	
				UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
				UomPriceUnitFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				PrcPriceConditionFk: {
					//TODO: implement price condition lookup
				},
				Total: {
					readonly: true
				},
				PriceExtra: {
					readonly: true
				},
				HasText: {
					readonly: true
				},
				QuantityAskedFor: {
					readonly: true
				},
				QuantityDelivered: {
					readonly: true
				},
				Batchno: {
					readonly: true
				}
			}
		};
	}

}