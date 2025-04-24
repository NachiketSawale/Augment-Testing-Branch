/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { ParameterDataTypes } from '@libs/constructionsystem/shared';
import { CosDefaultType } from '@libs/constructionsystem/common';

interface ICommonParameter {
	DefaultValue?: string | number | boolean | Date | null;
	IsLookup: boolean;
	CosParameterTypeFk: number;
	PropertyName?: string | null;
	CosDefaultTypeFk: number;
	BasFormFieldFk?: number | null;
}

/**
 * base readonly processor for parameter related entity
 */
export abstract class ConstructionSystemMasterParameterReadonlyProcessorBaseService<T extends ICommonParameter> extends EntityReadonlyProcessorBase<T> {
	public get isBasFormFieldFkReadOnly(): boolean {
		return true;
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<ICommonParameter> {
		return {
			PropertyName: (info) => {
				if (
					info.item.CosDefaultTypeFk === CosDefaultType.PropertyOrGivenDefault ||
					info.item.CosDefaultTypeFk === CosDefaultType.PropertyOrQuantityQuery ||
					info.item.CosDefaultTypeFk === CosDefaultType.QuantityQueryOrProperty ||
					info.item.CosDefaultTypeFk === CosDefaultType.PropertyCurrentObjectOrGivenDefault ||
					info.item.CosDefaultTypeFk === CosDefaultType.PropertyCurrentObjectOrQuantityQuery ||
					info.item.CosDefaultTypeFk === CosDefaultType.QuantityQueryOrPropertyCurrentObject ||
					info.item.CosDefaultTypeFk === CosDefaultType.Customize
				) {
					return false;
				} else {
					info.item.PropertyName = null;
					return true;
				}
			},
			// QuantityQuery: (info) => { // todo-allen: The field is not present on the UI.
			// 	if (
			// 		info.item.CosDefaultTypeFk === CosDefaultType.quantityQuery ||
			// 		info.item.CosDefaultTypeFk === CosDefaultType.propertyOrQuantityQuery ||
			// 		info.item.CosDefaultTypeFk === CosDefaultType.quantityQueryOrProperty ||
			// 		info.item.CosDefaultTypeFk === CosDefaultType.propertyCurrentObjectOrQuantityQuery ||
			// 		info.item.CosDefaultTypeFk === CosDefaultType.quantityQueryOrPropertyCurrentObject
			// 	) {
			// 		return false;
			// 	} else {
			// 		if (info.item.QuantityQueryInfo) {
			// 			info.item.QuantityQueryInfo.Description = null;
			// 		}
			// 		return true;
			// 	}
			// },
			DefaultValue: (info) => {
				if (info.item.CosDefaultTypeFk === CosDefaultType.GivenDefault || info.item.CosDefaultTypeFk === CosDefaultType.PropertyOrGivenDefault || info.item.CosDefaultTypeFk === CosDefaultType.Customize) {
					return false;
				} else {
					info.item.DefaultValue = null;
					return true;
				}
			},
			IsLookup: (info) => {
				if (info.item.CosParameterTypeFk === ParameterDataTypes.Boolean) {
					info.item.IsLookup = false;
					return true;
				} else {
					return false;
				}
			},
			BasFormFieldFk: (info) => this.isBasFormFieldFkReadOnly,
		};
	}
}
