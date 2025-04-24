/*
 * Copyright(c) RIB Software GmbH
 */

import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ConcreteFieldOverload, createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IEntityContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { getParamValueFieldOverloadForNonLookup, ICosParameterEntity } from '@libs/constructionsystem/shared';
import { UserFormFieldLookupService } from '../lookup/user-form-field-lookup.service';
import { ConstructionSystemMasterHeaderDataService } from '../construction-system-master-header-data.service';
import { ConstructionSystemMasterDefaultTypeLookupService } from '../lookup/construction-system-master-default-type-lookup.service';
import { ConstructionSystemMasterParameterTypeLookupService } from '../lookup/construction-system-master-parameter-type-lookup.service';
import { ConstructionSystemMasterParameterGroupLookupService } from '../lookup/construction-system-master-parameter-group-lookup.service';
import { ConstructionSystemMasterParameterValueLookupService } from '../lookup/construction-system-master-parameter-value-lookup.service';
import { ConstructionSystemMasterParameterAggregateTypeLookupService } from '../lookup/construction-system-master-parameter-aggregate-type-lookup.service';
import { ConstructionSystemCommonPropertyNameLookupService } from '@libs/constructionsystem/common';

/**
 * The construction system master parameter layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterParameterLayoutService {
	private defaultValueOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<ICosParameterEntity>>({
		type: FieldType.Description,
	});

	public generateLayout(): ILayoutConfiguration<ICosParameterEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: { key: 'cloud.common.entityProperties', text: 'Basic Data' },
					attributes: ['CosParameterGroupFk', 'CosParameterTypeFk', 'UomFk', 'CosDefaultTypeFk', 'PropertyName', 'DefaultValue', 'BasFormFieldFk', 'Sorting', 'DescriptionInfo', 'VariableName', 'IsLookup', 'AggregateType'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('constructionsystem.master.', {
					CosParameterGroupFk: { key: 'entityCosParameterGroupFk', text: 'Parameter Group' },
					CosParameterTypeFk: { key: 'entityParameterTypeFk', text: 'Type' },
					UomFk: { key: 'entityUomFk', text: 'UoM' },
					CosDefaultTypeFk: { key: 'entityDefaultTypeFk', text: 'Default Type' },
					PropertyName: { key: 'entityPropertyName', text: 'Property Name' },
					DefaultValue: { key: 'entityDefaultValue', text: 'Default Value' },
					BasFormFieldFk: { key: 'entityFormFieldFk', text: 'Form Field' },
					Sorting: { key: 'entitySorting', text: 'Sorting' },
					VariableName: { key: 'entityVariableName', text: 'Variable Name' },
					IsLookup: { key: 'entityIsLookup', text: 'Is Lookup' },
					AggregateType: { key: 'entityAggregateType', text: 'Aggregate Type' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					DescriptionInfo: { key: 'entityDescription', text: 'Description' },
				}),
			},
			overloads: {
				CosParameterTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemMasterParameterTypeLookupService,
						showClearButton: false,
					}),
				},
				CosDefaultTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemMasterDefaultTypeLookupService,
						showClearButton: false,
					}),
				},
				UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
				CosParameterGroupFk: {
					type: FieldType.Lookup,
					width: 150,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemMasterParameterGroupLookupService,
						showClearButton: false,
					}),
				},
				BasFormFieldFk: {
					type: FieldType.Lookup,
					width: 150,
					readonly: false,
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
				DefaultValue: {
					type: FieldType.Dynamic,
					overload: (ctx) => {
						this.updateDefaultValueOverload(ctx);
						return this.defaultValueOverloadSubject;
					},
					width: 150,
				},
				PropertyName: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemCommonPropertyNameLookupService,
						showClearButton: true,
					}),
				},
				AggregateType: {
					type: FieldType.Lookup,
					width: 150,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemMasterParameterAggregateTypeLookupService,
						showClearButton: false,
					}),
				},
			},
		};
	}

	public updateDefaultValueOverload(ctx: IEntityContext<ICosParameterEntity>) {
		let value: ConcreteFieldOverload<ICosParameterEntity>;

		if (ctx.entity?.IsLookup) {
			// todo-allen: There is a bug here: the LookupService is not called in the grid container,
			//  so the field defaults to displaying the Id instead of the description.
			value = {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ConstructionSystemMasterParameterValueLookupService,
					showClearButton: true,
				}),
			};
		} else {
			value = getParamValueFieldOverloadForNonLookup<ICosParameterEntity>(ctx.entity?.CosParameterTypeFk);
		}

		this.defaultValueOverloadSubject.next(value);
	}
}
