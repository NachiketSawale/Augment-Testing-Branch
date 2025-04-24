/*
 * Copyright(c) RIB Software GmbH
 */

import { BehaviorSubject } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { IEntityContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { ConcreteFieldOverload, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { getParamValueFieldOverloadForNonLookup, ICosParameterValueEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMasterParameterDataService } from '../construction-system-master-parameter-data.service';

/**
 * The construction system master parameter value layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterParameterValueLayoutService {
	private readonly parentService = inject(ConstructionSystemMasterParameterDataService);

	private defaultValueOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<ICosParameterValueEntity>>({
		type: FieldType.Integer,
	});

	public generateLayout(): ILayoutConfiguration<ICosParameterValueEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: { key: 'cloud.common.entityProperties', text: 'Basic Data' },
					attributes: ['Sorting', 'ParameterValue', 'IsDefault', 'DescriptionInfo'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('constructionsystem.master.', {
					Sorting: { key: 'entitySorting', text: 'Sorting' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					ParameterValue: { key: 'entityParameterValue', text: 'Value' },
					IsDefault: { key: 'entityIsDefault', text: 'Is Default' },
					DescriptionInfo: { key: 'entityDescription', text: 'Description' },
				}),
			},
			overloads: {
				ParameterValue: {
					type: FieldType.Dynamic,
					overload: (ctx) => {
						this.updateParameterValueOverload(ctx);
						return this.defaultValueOverloadSubject;
					},
				},
			},
		};
	}

	public updateParameterValueOverload(ctx: IEntityContext<ICosParameterValueEntity>) {
		const parentEntity = this.parentService.getSelectedEntity();
		const value: ConcreteFieldOverload<ICosParameterValueEntity> = getParamValueFieldOverloadForNonLookup<ICosParameterValueEntity>(parentEntity?.CosParameterTypeFk, FieldType.Integer);

		this.defaultValueOverloadSubject.next(value);
	}
}
