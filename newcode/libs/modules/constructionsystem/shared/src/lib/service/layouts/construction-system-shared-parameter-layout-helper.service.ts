import { IEntityContext } from '@libs/platform/common';
import {
	ConcreteFieldOverload,
	createLookup,
	FieldType,
	NumericFieldType,
	StringFieldType,
	TypedConcreteFieldOverload
} from '@libs/ui/common';
import { ConstructionSystemSharedGlobalParameterValueLookupService } from '../lookup/construction-system-shared-global-parameter-value-lookup.service';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ParameterDataTypes } from '../../model/enum/parameter-data-types.enum';
import { ICosGlobalParamValueEntity } from '../../model/entities/cos-global-param-value-entity.interface';

interface IParameterValue {
	CosParameterTypeFk: number;
	IsLookup: boolean;
	Id: number;
}

/**
 * dynamic domain parameter value overload
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemSharedParameterLayoutHelperService<T extends IParameterValue> {
	private defaultValueOverloadSubject = new BehaviorSubject<ConcreteFieldOverload<T>>({
		type: FieldType.Description,
	});

	public provideParameterValueOverload(showClearButton: boolean = true): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Dynamic,
			overload: (ctx) => {
				this.updateDefaultValueOverload(ctx, showClearButton);
				return this.defaultValueOverloadSubject;
			},
		};
	}

	public updateDefaultValueOverload(ctx: IEntityContext<T>, showClearButton: boolean) {
		let value: ConcreteFieldOverload<T>;
		if (ctx.entity?.IsLookup) {
			//todo lookup type seems do not working well
			value = {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ConstructionSystemSharedGlobalParameterValueLookupService,
					showClearButton: showClearButton,
					clientSideFilter: {
						execute(item: ICosGlobalParamValueEntity): boolean {
							return item.CosGlobalParamFk === ctx.entity?.Id;
						},
					},
				}),
			};
		} else {
			value = getParamValueFieldOverloadForNonLookup<T>(ctx.entity?.CosParameterTypeFk);
		}

		this.defaultValueOverloadSubject.next(value);
	}
}

export function getParamValueFieldOverloadForNonLookup<T extends object>(cosParameterTypeFk: number | null | undefined, defaultType: StringFieldType | NumericFieldType = FieldType.Description): ConcreteFieldOverload<T> {
	switch (cosParameterTypeFk) {
		case ParameterDataTypes.Integer:
			return { type: FieldType.Integer };
		case ParameterDataTypes.Decimal1:
			return { type: FieldType.Decimal }; // todo-allen: How to configure decimalPlaces for dynamic fields? formatterOptions: { decimalPlaces: 1 }
		case ParameterDataTypes.Decimal2:
			return { type: FieldType.Decimal };
		case ParameterDataTypes.Decimal3:
			return { type: FieldType.Decimal };
		case ParameterDataTypes.Decimal4:
			return { type: FieldType.Decimal };
		case ParameterDataTypes.Decimal5:
			return { type: FieldType.Decimal };
		case ParameterDataTypes.Decimal6:
			return { type: FieldType.Decimal };
		case ParameterDataTypes.Boolean:
			return { type: FieldType.Boolean };
		case ParameterDataTypes.Date:
			return { type: FieldType.DateUtc };
		case ParameterDataTypes.Text:
			return { type: FieldType.Description };
		default:
			return { type: defaultType };
	}
}
