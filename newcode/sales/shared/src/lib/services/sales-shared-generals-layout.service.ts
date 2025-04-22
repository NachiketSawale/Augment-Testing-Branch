/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { Injectable} from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsShareControllingUnitLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider, BasicsSharedValueTypeLookupService } from '@libs/basics/shared';
import { ISalesSharedGeneralsEntity } from '../model/entities/sales-shared-generals-entity.interface';

/**
 * Common sales generals layout service
 */
@Injectable({
	providedIn: 'root'
})
export class SalesSharedGeneralsLayoutService {
	public async generateLayout<T extends ISalesSharedGeneralsEntity>(): Promise<ILayoutConfiguration<T>> {
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['GeneralsTypeFk', 'ControllingUnitFk', 'TaxCodeFk', 'ValueType', 'Value', 'CommentText']
				}
			],
			labels: {
				...prefixAllTranslationKeys('sales.common.', {
					GeneralsTypeFk: { key: 'generals.entity.generalsTypeFk' },
					ControllingUnitFk: { key: 'entityControllingUnitFk' },
					TaxCodeFk: { key: 'generals.entity.taxCodeFk' },
					ValueType: { key: 'generals.entity.valueType' },
					Value: { key: 'generals.entity.value' },
					CommentText: { key: 'generals.entity.commentText' },
				}),
			},
			overloads: {
				GeneralsTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideGeneralTypeLookupOverload(true),
				ControllingUnitFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsShareControllingUnitLookupService,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
						// serverSideFilter: {
						// 	key: 'prc.con.controllingunit.by.prj.filterkey',
						// 	execute: () => {
						// 		return dataService.controllingUnitSideFilterValue();
						// 	}
						// },
						selectableCallback: e => {
							return e.Isaccountingelement;
						}
					})
				},
				TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true), 
				ValueType: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedValueTypeLookupService,
						descriptionMember: 'DescriptionInfo.Translated'
					})
				}
			}
		};
	}
}
