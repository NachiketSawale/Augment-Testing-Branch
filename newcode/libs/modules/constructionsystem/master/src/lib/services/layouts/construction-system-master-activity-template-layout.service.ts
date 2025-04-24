/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ICosActivityTemplateEntity } from '../../model/models';
import { BasicsSharedUomLookupService } from '@libs/basics/shared';
import { ACTIVITY_TEMPLATE_LOOKUP_PROVIDER_TOKEN, IActivityTemplateLookupProvider } from '@libs/scheduling/interfaces';
import { PlatformLazyInjectorService, prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { createLookup, FieldOverloadSpec, FieldType, ILayoutConfiguration, ILookupFieldOverload, UiCommonLookupDataFactoryService } from '@libs/ui/common';

/**
 * Activity Template layouts service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterActivityTemplateLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public async generateLayout(): Promise<ILayoutConfiguration<ICosActivityTemplateEntity>> {
		const lookupServiceFactory = ServiceLocator.injector.get(UiCommonLookupDataFactoryService);
		const activityTemplateLookupProvider = await this.lazyInjector.inject(ACTIVITY_TEMPLATE_LOOKUP_PROVIDER_TOKEN);

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['Code', 'CommentText', 'ActivityTemplateFk'],
					additionalAttributes: [
						'ActivityTemplate.SchedulingMethodFk',
						'ActivityTemplate.TaskTypeFk',
						'ActivityTemplate.ConstraintTypeFk',
						'ActivityTemplate.ActivityPresentationFk',
						'ActivityTemplate.ProgressReportMethodFk',
						'ActivityTemplate.QuantityUoMFk',
						'ActivityTemplate.Perf1UoMFk',
						'ActivityTemplate.Perf2UoMFk',
					],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Code: { key: 'entityCode', text: 'Code' },
					CommentText: { key: 'entityCommentText', text: 'Comment' },
					'ActivityTemplate.Specification': { key: 'EntitySpec', text: 'specification' },
					'ActivityTemplate.TaskTypeFk': { key: 'entityType', text: 'Task Type' },
					'ActivityTemplate.QuantityUoMFk': { key: 'entityUoM', text: 'Quantity Uom' },
				}),
				...prefixAllTranslationKeys('constructionsystem.master.', {
					ActivityTemplateFk: { key: 'entityActivityTemplateFk', text: 'Activity Template' },
					'ActivityTemplate.DescriptionInfo.Description': { key: 'entityActivityTemplateDescription', text: 'Activity Template Description' },
					'ActivityTemplate.ControllingUnitTemplate': { key: 'controllingUnitTemplate', text: 'Controlling Unit Template' },
				}),
				...prefixAllTranslationKeys('scheduling.main.', {
					'ActivityTemplate.SchedulingMethodFk': {
						key: 'schedulingMethod',
						text: 'Scheduling Method',
					},
					'ActivityTemplate.ConstraintTypeFk': {
						key: 'constraint',
						text: 'Constraint Type',
					},
					'ActivityTemplate.ActivityPresentationFk': {
						key: 'activityPresented',
						text: 'Activity Presentation',
					},
					'ActivityTemplate.ProgressReportMethodFk': {
						key: 'progressReportMethod',
						text: 'Progress Report Method',
					},
					'ActivityTemplate.Perf1UoMFk': {
						key: 'perfUoM',
						text: 'perfUoM',
						params: { number: 1 },
					},
					'ActivityTemplate.Perf2UoMFk': {
						key: 'perfUoM',
						text: 'Perf2Uom',
						params: { number: 2 },
					},
					'ActivityTemplate.PerformanceFactor': {
						key: 'performanceFactor',
						text: 'Performance Factor',
					},
				}),
			},
			overloads: {
				ActivityTemplateFk: this.provideActivityTemplateFkOverload(activityTemplateLookupProvider),
			},
			additionalOverloads: { // todo-allen: The values of additional properties of the lookup type are not displayed on the Grid container.
				'ActivityTemplate.SchedulingMethodFk': {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataService: lookupServiceFactory.fromSimpleDataProvider('basics.customize.schedulemethod', {
							uuid: 'schedulingMethodFk',
							valueMember: 'Id',
							displayMember: 'Description',
							showClearButton: false,
						}),
					}),
				},
				'ActivityTemplate.TaskTypeFk': {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataService: lookupServiceFactory.fromSimpleDataProvider('basics.customize.tasktype', {
							uuid: 'TaskTypeFk',
							valueMember: 'Id',
							displayMember: 'Description',
							showClearButton: false,
						}),
					}),
				},
				'ActivityTemplate.ConstraintTypeFk': {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataService: lookupServiceFactory.fromSimpleDataProvider('basics.customize.constrainttype', {
							uuid: 'ConstraintTypeFk',
							valueMember: 'Id',
							displayMember: 'Description',
							showClearButton: false,
						}),
					}),
				},
				'ActivityTemplate.ActivityPresentationFk': {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataService: lookupServiceFactory.fromSimpleDataProvider('basics.customize.activitypresentation', {
							uuid: 'ActivityPresentationFk',
							valueMember: 'Id',
							displayMember: 'Description',
							showClearButton: false,
						}),
					}),
				},
				'ActivityTemplate.ProgressReportMethodFk': {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataService: lookupServiceFactory.fromSimpleDataProvider('basics.customize.progressreportmethod', {
							uuid: 'ProgressReportMethodFk',
							valueMember: 'Id',
							displayMember: 'Description',
							showClearButton: false,
						}),
					}),
				},
				'ActivityTemplate.QuantityUoMFk': this.provideUoMLookupOverload(),
				'ActivityTemplate.Perf1UoMFk': this.provideUoMLookupOverload(),
				'ActivityTemplate.Perf2UoMFk': this.provideUoMLookupOverload(),
			},
		};
	}

	private provideUoMLookupOverload(): ILookupFieldOverload<ICosActivityTemplateEntity> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedUomLookupService,
				descriptionMember: 'DescriptionInfo.Translated',
				showDescription: true,
				showClearButton: false,
			}),
		};
	}

	private provideActivityTemplateFkOverload(activityTemplateLookupProvider: IActivityTemplateLookupProvider) {
		const additionalFieldOptions = {
			column: true,
			row: true,
			singleRow: false,
			readonly: true,
			type: FieldType.Lookup,
		};
		return {
			...activityTemplateLookupProvider.generateActivityTemplateLookup(),
			width: 145,
			additionalFields: [
				{
					displayMember: 'Specification',
					label: { key: 'cloud.common.EntitySpec', text: 'specification' },
					...additionalFieldOptions,
				},
				{
					displayMember: 'ControllingUnitTemplate',
					label: { key: 'constructionsystem.master.controllingUnitTemplate', text: 'Controlling Unit Template' },
					...additionalFieldOptions,
				},
				{
					displayMember: 'PerformanceFactor',
					label: { key: 'scheduling.main.performanceFactor', text: 'Performance Factor' },
					...additionalFieldOptions,
				},
				{
					displayMember: 'DescriptionInfo.Description',
					label: { key: 'constructionsystem.master.entityActivityTemplateDescription', text: 'Activity Template Description' },
					...additionalFieldOptions,
				},
			],
		} as FieldOverloadSpec<ICosActivityTemplateEntity>;
	}
}
