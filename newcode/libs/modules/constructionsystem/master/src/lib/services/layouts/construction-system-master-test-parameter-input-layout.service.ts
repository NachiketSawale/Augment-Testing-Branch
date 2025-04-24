/*
 * Copyright(c) RIB Software GmbH
 */

import { BehaviorSubject } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { SchedulingScheduleLookup } from '@libs/scheduling/shared';
import { PROJECT_LOOKUP_PROVIDER_TOKEN } from '@libs/project/interfaces';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { getParamValueFieldOverloadForNonLookup, ParameterDataTypes } from '@libs/constructionsystem/shared';
import { ConcreteFieldOverload, createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IEntityContext, PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { ICosTestInputEntity } from '../../model/models';
import { UserFormFieldLookupService } from '../lookup/user-form-field-lookup.service';
import { ConstructionSystemMasterHeaderDataService } from '../construction-system-master-header-data.service';
import { ConstructionSystemMasterParameterValueLookupService } from '../lookup/construction-system-master-parameter-value-lookup.service';
import { ConstructionSystemMasterTestParameterInputDataService } from '../construction-system-master-test-parameter-input-data.service';
import { ConstructionSystemSharedProjectInstanceHeaderLookupService } from '@libs/constructionsystem/shared';

/**
 * The construction system master test input layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterTestParameterInputLayoutService {
	private readonly dataService = inject(ConstructionSystemMasterTestParameterInputDataService);
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private readonly scheduleLookupService = inject(SchedulingScheduleLookup);

	private valueOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<ICosTestInputEntity>>({
		type: FieldType.Description,
	});

	public async generateLayout(): Promise<ILayoutConfiguration<ICosTestInputEntity>> {
		const projectLookupProvider = await this.lazyInjector.inject(PROJECT_LOOKUP_PROVIDER_TOKEN);
		// todo-allen:
		//  1. The "visible" parameter is not working.
		//  2. There are some "parameter value" fields that are dynamically added to the form container. How to implement it?
		return {
			suppressHistoryGroup: true,
			groups: [
				{
					gid: 'basicData',
					title: { key: 'cloud.common.entityProperties', text: 'Basic Data' },
					attributes: ['Value', 'UomFk', 'PropertyName', 'BasFormFieldFk', 'DescriptionInfo', 'VariableName', 'QuantityQueryInfo'],
				},
				{
					gid: 'context',
					title: { key: 'constructionsystem.master.context', text: 'Context' },
					attributes: ['ProjectFk', 'CosInsHeaderFk', 'ModelFk', 'EstHeaderFk', 'PsdScheduleFk', 'BoqHeaderFk'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('constructionsystem.master.', {
					Value: { key: 'entityValue', text: 'Value' },
					UomFk: { key: 'entityUomFk', text: 'UoM' },
					PropertyName: { key: 'entityPropertyName', text: 'Property Name' },
					BasFormFieldFk: { key: 'entityFormFieldFk', text: 'Form Field' },
					VariableName: { key: 'entityVariableName', text: 'Variable Name' },
					QuantityQueryInfo: { key: 'entityQuantityQueryInfoDescription', text: 'Quantity Query' },

					ProjectFk: { key: 'entityProjectFk', text: 'Project' },
					CosInsHeaderFk: { key: 'entityCosInsHeaderFk', text: 'Cos Instance Header' },
					EstHeaderFk: { key: 'entityEstHeaderFk', text: 'Estimate Header' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					DescriptionInfo: { key: 'entityDescription', text: 'Description' },
				}),
				...prefixAllTranslationKeys('scheduling.schedule.', {
					PsdScheduleFk: { key: 'entitySchedule', text: 'Schedule' },
				}),
				...prefixAllTranslationKeys('estimate.main.', {
					BoqHeaderFk: { key: 'boqHeaderFk', text: 'Boq' },
				}),
				...prefixAllTranslationKeys('model.main.', {
					ModelFk: { key: 'entityModel', text: 'Model' },
				}),
			},
			overloads: {
				DescriptionInfo: { grid: { readonly: true }, form: { visible: false } },
				PropertyName: { grid: { readonly: true }, form: { visible: false } },
				QuantityQueryInfo: { grid: { readonly: true }, form: { visible: false } },
				UomFk: {
					grid: {
						...BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
						readonly: true,
					},
					form: { visible: false },
				},
				BasFormFieldFk: {
					grid: {
						type: FieldType.Lookup,
						readonly: true,
						width: 150,
						lookupOptions: createLookup({
							dataServiceToken: UserFormFieldLookupService,
							serverSideFilter: {
								key: 'basformfieldfk-for-construction-system-master-filter',
								execute(context) {
									const parentService = context.injector.get(ConstructionSystemMasterHeaderDataService);
									const parentEntity = parentService.getSelectedEntity();
									return parentEntity ? `FormFk=${parentEntity.BasFormFk || -1}` : '';
								},
							},
							showClearButton: true,
						}),
					},
					form: { visible: false },
				},
				VariableName: { grid: { readonly: true }, form: { visible: false } }, // todo-allen: wait for basics-common-limit-input
				Value: {
					type: FieldType.Dynamic,
					width: 150,
					overload: (ctx) => {
						this.updateValueOverload(ctx);
						return this.valueOverloadSubject;
					},
				},

				ProjectFk: {
					grid: { visible: false },
					form: {
						visible: true,
						type: FieldType.Lookup,
						...projectLookupProvider.generateProjectLookup({
							lookupOptions: {
								showClearButton: false,
								descriptionMember: 'ProjectName',
								showDescription: true,
							},
						}),
					},
				},
				CosInsHeaderFk: {
					grid: { visible: false },
					form: {
						visible: true,
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: ConstructionSystemSharedProjectInstanceHeaderLookupService,
							descriptionMember: 'Description',
							showDescription: true,
						}),
					},
				},
				EstHeaderFk: { grid: { visible: false }, form: { visible: true, readonly: true } }, // todo-allen: estimateMainHeaderLookupDataService is not ready.
				ModelFk: { grid: { visible: false }, form: { visible: true, readonly: true } }, // todo-allen: modelProjectModelLookupDataService is not ready.
				PsdScheduleFk: {
					grid: { visible: false },
					form: {
						visible: true,
						readonly: true,
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: SchedulingScheduleLookup,
							descriptionMember: 'DescriptionInfo.Translated',
							showDescription: true,
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: () => {
										const selected = this.dataService.getSelectedEntity();
										this.scheduleLookupService.setProjectId(selected?.ProjectFk ?? -1);
									},
								},
							],
						}),
					},
				},
				BoqHeaderFk: { grid: { visible: false }, form: { visible: true, readonly: true } }, // todo-allen: boqProjectLookupDataService is not ready.
			},
			excludedAttributes: [],
		};
	}

	public updateValueOverload(ctx: IEntityContext<ICosTestInputEntity>) {
		let value: ConcreteFieldOverload<ICosTestInputEntity>;

		if (ctx.entity?.IsLookup && ctx.entity.CosParameterTypeFk !== ParameterDataTypes.Boolean) {
			value = {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					// todo-allen: It seems there is a bug here: the field defaults to displaying the Id instead of the description.
					dataServiceToken: ConstructionSystemMasterParameterValueLookupService,
					showClearButton: true,
				}),
			};
		} else {
			value = getParamValueFieldOverloadForNonLookup<ICosTestInputEntity>(ctx.entity?.CosParameterTypeFk);
		}

		this.valueOverloadSubject.next(value);
	}
}
