/*
 * Copyright(c) RIB Software GmbH
 */

import { BehaviorSubject } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { IEntityContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { ConcreteFieldOverload, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { ICosGlobalParamValueEntity, ParameterDataTypes } from '@libs/constructionsystem/shared';
import { ConstructionSystemMasterGlobalParameterDataService } from '../construction-system-master-global-parameter-data.service';

/**
 * The construction system master global parameter value layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterGlobalParameterValueLayoutService {
	private readonly parentService = inject(ConstructionSystemMasterGlobalParameterDataService);

	private defaultValueOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<ICosGlobalParamValueEntity>>({
		type: FieldType.Integer,
	});

	public generateLayout(): ILayoutConfiguration<ICosGlobalParamValueEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: { key: 'cloud.common.entityProperties', text: 'Basic Data' },
					attributes: ['DescriptionInfo', 'Sorting', 'ParameterValue', 'IsDefault'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('constructionsystem.master.', {
					Sorting: { key: 'entitySorting', text: 'Sorting' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					DescriptionInfo: { key: 'entityDescription', text: 'Description' },
					ParameterValue: { key: 'entityParameterValue', text: 'Value' },
					IsDefault: { key: 'entityIsDefault', text: 'Is Default' },
				}),
			},
			overloads: {
				ParameterValue: {
					type: FieldType.Dynamic,
					width: 150,
					overload: (ctx) => {
						this.updateParameterValueOverload(ctx);
						return this.defaultValueOverloadSubject;
					},
				},
			},
		};
	}

	public updateParameterValueOverload(ctx: IEntityContext<ICosGlobalParamValueEntity>) {
		let value: ConcreteFieldOverload<ICosGlobalParamValueEntity>;

		const parentEntity = this.parentService.getSelectedEntity();
		switch (parentEntity?.CosParameterTypeFk) {
			case ParameterDataTypes.Integer:
				value = { type: FieldType.Integer };
				break;
			case ParameterDataTypes.Decimal1:
				value = { type: FieldType.Money };
				break;
			case ParameterDataTypes.Decimal2:
				value = { type: FieldType.Money };
				break;
			case ParameterDataTypes.Decimal3:
				value = { type: FieldType.Decimal };
				break;
			case ParameterDataTypes.Decimal4:
				value = { type: FieldType.ExchangeRate };
				break;
			case ParameterDataTypes.Decimal5:
				value = { type: FieldType.ExchangeRate };
				break;
			case ParameterDataTypes.Decimal6:
				value = { type: FieldType.Factor };
				break;
			// case 7:
			// case 8:
			// case 9:
			// 	break;
			case ParameterDataTypes.Boolean:
				value = { type: FieldType.Boolean };
				break;
			case ParameterDataTypes.Date:
				value = { type: FieldType.DateUtc };
				break;
			case ParameterDataTypes.Text:
				value = { type: FieldType.Description };
				break;
			default:
				value = { type: FieldType.Integer };
		}

		this.defaultValueOverloadSubject.next(value);
	}
}
