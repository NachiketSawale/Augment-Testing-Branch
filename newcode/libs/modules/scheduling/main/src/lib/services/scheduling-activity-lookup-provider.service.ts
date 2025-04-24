/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILookupDialogSearchFormEntity, TypedConcreteFieldOverload } from '@libs/ui/common';
import { ACTIVITY_LOOKUP_PROVIDER_TOKEN, IActivityEntity, ISchedulingActivityLookupOptions, ISchedulingActivityLookupProvider } from '@libs/scheduling/interfaces';
import { LazyInjectable, ServiceLocator } from '@libs/platform/common';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { SchedulingActivityFullLookupService, SchedulingScheduleLookup } from '@libs/scheduling/shared';
import { SchedulingActivityLookupWithoutEndpoint } from './scheduling-activity-lookup-without-endpoint.service';
import { SchedulingMainDataService } from './scheduling-main-data.service';


/**
 * Provides scheduling activity lookups.
 */
@LazyInjectable({
	token:ACTIVITY_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection:true
})

@Injectable({
	providedIn: 'root'
})
export class SchedulingActivityLookupProviderService implements ISchedulingActivityLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick an activity lookup.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	public generateActivityLookup<T extends object>(options?: ISchedulingActivityLookupOptions): TypedConcreteFieldOverload<T> {

		return {
			type: FieldType.Lookup,
			readonly: options?.readonly ?? false,
			lookupOptions: createLookup({
				dataServiceToken: SchedulingActivityLookupWithoutEndpoint,
				readonly: options?.readonly ?? false,
				showClearButton: options?.showClearButton ?? false,
				serverSideFilter: {
					key: 'schedulingActivityFilter',
					execute(context) {
						let scheduleFk = null;
						if (context.entity){
							scheduleFk = context.entity ? ['ScheduleFk'] : null;
						}
						return { scheduleFk: scheduleFk };
					}
				},
				showDialog: true,
				dialogOptions: {
					headerText: {key: 'scheduling.main.entityActivity'}
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
									dataServiceToken: ProjectSharedLookupService
								}),
								model: 'projectFk',
								label: {key: 'project.main.projectListTitle'}
							},
								{
									id: 'scheduleId',
									groupId: 'default',
									type: FieldType.Lookup,
									lookupOptions: createLookup({
										dataServiceToken: SchedulingScheduleLookup
									}),
									model: 'scheduleFk',
									label: {key: 'scheduling.schedule.schedule'}
								}]
						}
					},
					visible:true
				},
				gridConfig: {
					uuid: '9c02764bcd304d618a43ff502de1cdcf',
					columns: [{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Id', key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true
					},
						{
							id: 'Description',
							model: 'DescriptionInfo',
							type: FieldType.Translation,
							label: {text: 'Description', key: 'cloud.common.entityDescription'},
							sortable: true,
							visible: true
						}]
				}
			})
		};
	}

	public generateGridActivityLookup<T extends object>(options?: ISchedulingActivityLookupOptions): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IActivityEntity>({
				dataServiceToken: SchedulingActivityFullLookupService,
				showClearButton: options?.showClearButton ?? false,
				readonly: options?.readonly ?? false,
				//TODO now activities with typeFk = 5 can't be selected. In old client these activities aren't shown in the list.
				selectableCallback: (item) => !item.HasChildren && item.ActivityTypeFk !== 5 ,
				showGrid: true,
				gridConfig: {
					treeConfiguration: {
						parent: function (entity: IActivityEntity) {
							const service = ServiceLocator.injector.get(SchedulingMainDataService);
							return service.parentOf(entity);
						},
						children: function (entity: IActivityEntity) {
							const service = ServiceLocator.injector.get(SchedulingMainDataService);
							return service.childrenOf(entity);
						}
					},
					columns: [
						{
							id: 'Code',
							model: 'Code',
							type: FieldType.Code,
							label: { text: 'Id', key: 'cloud.common.entityCode' },
							sortable: true,
							visible: true
						},
						{
							id: 'Description',
							model: 'DescriptionInfo',
							type: FieldType.Translation,
							label: {text: 'Description', key: 'cloud.common.entityDescription'},
							sortable: true,
							visible: true
						},
						{
							id: 'Schedule',
							model: 'Schedule.Code',
							type: FieldType.Description,
							label: {text: 'Description', key: 'scheduling.schedule.entitySchedule'},
							sortable: true,
							visible: true
						}
					]
				}
			})
		};
	}
}
