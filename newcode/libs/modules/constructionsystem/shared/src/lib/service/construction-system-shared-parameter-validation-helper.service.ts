/*
 * Copyright(c) RIB Software GmbH
 */

import { Subject } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { DataServiceBase, ValidationResult } from '@libs/platform/data-access';
import { IEntityBase } from '@libs/platform/common';

export interface IEvalCodeValidatorResponse {
	Name?: string;
	IsDisabled?: boolean;
	IsHidden?: boolean;
	HasError?: boolean;
	Error?: object;
}

interface IParameter extends IEntityBase {
	VariableName?: string | null;
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemSharedParameterValidationHelperService<T extends IParameter> {
	public readonly validationInfoChanged = new Subject<{ needToHide: IEvalCodeValidatorResponse[]; validationInfo: IEvalCodeValidatorResponse[] }>();

	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	public applyDisable(info: IEvalCodeValidatorResponse, item: T, model: string, service: DataServiceBase<T>) {
		if (Object.prototype.hasOwnProperty.call(info, 'IsDisabled')) {
			const fields = [{ field: model, readOnly: info.IsDisabled ?? false }];
			service.setEntityReadOnlyFields(item, fields);
		}
	}

	private applyHidden(info: IEvalCodeValidatorResponse, item: T) {
		// if (Object.prototype.hasOwnProperty.call(info, 'IsHidden')) {
		// 	item.__rt$data = item.__rt$data || {};
		// 	item.__rt$data.hide = !!info.IsHidden;
		// }
	}

	public applyError(info: IEvalCodeValidatorResponse, item: T, model: string, service: DataServiceBase<T>) {
		const result = new ValidationResult();
		if (Object.prototype.hasOwnProperty.call(info, 'HasError')) {
			if (info.HasError) {
				result.valid = false;
				result.apply = true;
				result.error = info.Error?.toString();
			} else {
				result.valid = true;
				result.apply = true;
			}
			service.addInvalid(item, { result: result, field: model });
		}
		return result;
	}

	public handleValidatorInfo(validatedInfo: IEvalCodeValidatorResponse[], parameters: T[], model: string, service: DataServiceBase<T>) {
		let result = this.validationUtils.createSuccessObject();
		parameters.forEach((param) => {
			const vInfo = validatedInfo.filter((v) => param.VariableName === v.Name);

			if (vInfo) {
				const disableInfo = vInfo.filter((item) => Object.prototype.hasOwnProperty.call(item, 'IsDisabled'));
				disableInfo.forEach((info) => {
					this.applyDisable(info, param, model, service);
				});

				const hiddenInfo = vInfo.filter((item) => Object.prototype.hasOwnProperty.call(item, 'IsHidden'));
				hiddenInfo.forEach((info) => {
					// this.applyHidden(info, param); // todo-allen: Not sure if this code is needed.
				});

				const errorInfo = vInfo.filter((item) => Object.prototype.hasOwnProperty.call(item, 'HasError') && item.HasError === true);
				if (errorInfo.length === 0) {
					this.applyError({ HasError: false }, param, model, service); // no error at all, so clear previous error info if it exists
				} else {
					this.applyError(errorInfo[0], param, model, service); // always apply the first one
					result = this.validationUtils.createErrorObject('');
				}
			}
		});

		const needToHide = validatedInfo.filter((item) => Object.prototype.hasOwnProperty.call(item, 'IsHidden'));
		this.validationInfoChanged.next({ needToHide: needToHide, validationInfo: validatedInfo });
		return result;
	}

	public copyValue(parameterList: [], cosParameterList: []) {
		// if (angular.isArray(parameterList)) {
		// 	_.forEach(parameterList, function (param) {
		// 		var temp = _.find(cosParameterList, {Id: param.ParameterFk});
		// 		if (temp) {
		// 			if (temp.IsLookup) {
		// 				param.InputValue = parameterTypeConverter.convertValue(temp.ParameterTypeFk, param.ParameterValue);
		// 			} else {
		// 				param.InputValue = param.ParameterValueVirtual;
		// 			}
		// 			param.VariableName = temp.VariableName;
		// 		}
		// 	});
		// }
	}
}
