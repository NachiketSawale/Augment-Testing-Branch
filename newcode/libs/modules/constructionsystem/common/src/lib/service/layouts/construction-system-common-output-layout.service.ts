import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { Injectable } from '@angular/core';
import { IConstructionSystemCommonScriptErrorEntity } from '../../model/entities/construction-system-common-script-error-entity.interface';
import { ConstructionSystemCommonOutputCallstackLookupService } from '../lookup/construction-system-common-output-callstack-lookup.service';
import { ConstructionSystemCommonOutputDescriptionLookupService } from '../lookup/construction-system-common-output-description-lookup.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemCommonOutputLayoutService<T extends IConstructionSystemCommonScriptErrorEntity> {
	public generateLayout(): ILayoutConfiguration<T> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['Order', 'ErrorType', 'Description', 'Line', 'Column', 'ModelObject', 'CallStack'],
				},
			],
			labels: {
				Order: { text: '#' },
				...prefixAllTranslationKeys('constructionsystem.executionScriptOutput.', {
					ErrorType: { key: 'category', text: 'ErrorType' },
					Description: { key: 'description' },
					Line: { key: 'line' },
					Column: { key: 'column' },
					ModelObject: { key: 'modelObject' },
					CallStack: { key: 'callStack' },
				}),
			},
			overloads: {
				Order: {
					tooltip: 'Order',
					sortable: true,
					searchable: true,
					type: FieldType.Integer,
				},
				ErrorType: {
					sortable: false,
					formatterOptions: {
						//todo <i class="block-image ... ></i>
					},
					tooltip: 'ErrorType',
				},
				Description: {
					sortable: true,
					searchable: true,
					width: 50,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemCommonOutputDescriptionLookupService,
					}),
				},
				Line: {
					sortable: true,
					searchable: true,
					width: 50,
					tooltip: 'Line',
				},
				Column: {
					sortable: true,
					searchable: true,
					width: 50,
					tooltip: 'Column',
				},
				ModelObject: {
					sortable: true,
					searchable: true,
					tooltip: 'ModelObject',
					width: 200,
				},
				CallStack: {
					tooltip: 'CallStack',
					sortable: true,
					searchable: true,
					width: 150,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemCommonOutputCallstackLookupService,
					}),
				},
			},
		} as ILayoutConfiguration<T>;
	}
}
