/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILookupDialogSearchFormEntity, TypedConcreteFieldOverload } from '@libs/ui/common';
import { ACTIVITY_TEMPLATE_LOOKUP_PROVIDER_TOKEN, IActivityTemplateLookupOptions, IActivityTemplateLookupProvider } from '@libs/scheduling/interfaces';
import { ActivityTemplateLookupDataService } from './activity-template-lookup-data.service';
import { IActivityTemplateEntity } from '../model/entities/activity-template-entity.interface';
import { SchedulingTemplategroupTreeLookup } from '@libs/scheduling/shared';
import { IEntityContext, LazyInjectable } from '@libs/platform/common';


/**
 * Provides activity template related lookups.
 */
@LazyInjectable({
	token:ACTIVITY_TEMPLATE_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection:true
})

@Injectable({
	providedIn: 'root'
})
export class SchedulingActivityTemplateLookupProviderService implements IActivityTemplateLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick a activity template.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	public generateActivityTemplateLookup<T extends object>(options?: IActivityTemplateLookupOptions): TypedConcreteFieldOverload<T> {

		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IActivityTemplateEntity>({
				dataServiceToken: ActivityTemplateLookupDataService,
				serverSideFilter: {
					key: 'activityTemplateFilter',
				   execute(entity: IEntityContext<object>): string | object {
					   const tempEntity = entity as unknown as { templateGroupFk: number | null | undefined };
					   return { templateGroupFk: tempEntity.templateGroupFk };
				   }
				},
				showDialog: true,
				dialogOptions: {
					headerText: {key: 'scheduling.template.activityTemplateLookup'}
				},
				dialogSearchForm: {
					form: {
						entity: () => {
							const result: ILookupDialogSearchFormEntity = {};
							return result;
						},
						config: {
							groups: [{groupId: 'default'}],
							rows: [{
								id: 'baseType',
								groupId: 'default',
								//...ActivityTemplateGroupLookupProviderService.generateActivityTemplateGroupLookup(IActivityTemplateGroupLookupOptions),
								type: FieldType.Lookup,
								lookupOptions: createLookup({
									dataServiceToken: SchedulingTemplategroupTreeLookup
								}),
								model: 'templateGroupFk',
								label: {key: 'model.administration.baseValueType'}
							}]
						}
					},
					visible:true
				},
				gridConfig: {
					uuid: 'ba1b5070e2914046aac80c9dba448e8c',
					columns: [{
						id: 'code',
						label: {key: 'cloud.common.entityCode'},
						type: FieldType.Code,
						model: 'Code',
						sortable: true,
						width: 100
					},{
						id: 'desc',
						label: {key: 'cloud.common.entityDescription'},
						type: FieldType.Translation,
						model: 'DescriptionInfo',
						sortable: true,
						width: 220
					}]
				}
			})
		};
	}
}
