import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import {
	ConstructionSystemMasterParameterLookupService
} from '../lookup/construction-system-master-parameter-lookup.service';
import { ConstructionSystemSharedGlobalParameterValueLookupService, IInstance2ObjectParamEntity } from '@libs/constructionsystem/shared';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ConstructionSystemCommonInstance2ObjectParamLayoutService {
	public generateLayout(): ILayoutConfiguration<IInstance2ObjectParamEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data'
					},
					attributes: ['ParameterFk', 'PropertyName', 'ParameterValueVirtual', 'QuantityQuery', 'LastEvaluated', 'ValueDetail'],
					additionalAttributes: ['IsInherit']
				}
			],
			labels: {
				...prefixAllTranslationKeys('constructionsystem.main.', {
					ParameterFk: { key: 'entityParameterFk' },
					PropertyName: { key: 'entityPropertyName' },
					ParameterValueVirtual: { key: 'entityParameterValueVirtual' },
					QuantityQuery: { key: 'entityQuantityQuery' },
					LastEvaluated: { key: 'entityLastEvaluated' },
					ValueDetail: { key: 'entityValueDetail' },
					IsInherit: { key: 'entityIsInherit' }
				})
			},
			overloads: {
				LastEvaluated: {
					readonly: true
				},
				ValueDetail: {
					readonly: true
				},
				ParameterFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemMasterParameterLookupService
					}),
					formatterOptions: {
						lookupType: 'CosParameter',
						displayMember: 'DescriptionInfo.Translated'
					}
				},
				PropertyName: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						showClearButton: true,
						showEditButton: true
						//todo serverSideFilter: instanceparameter-property-name-filter
					})
				},
				ParameterValueVirtual: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemSharedGlobalParameterValueLookupService
					})
				}
			},
			additionalOverloads: {
				IsInherit: {}
			}
		};
	}
}