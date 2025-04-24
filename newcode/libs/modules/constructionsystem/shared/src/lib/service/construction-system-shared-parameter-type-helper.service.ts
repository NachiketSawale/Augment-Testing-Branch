import { ParameterDataTypes } from '../model/enum/parameter-data-types.enum';
import { toLower, isBoolean } from 'lodash';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemSharedParameterTypeHelperService {
	/**
	 * convert value according parameterType
	 * @param parameterTypeId
	 * @param value
	 */
	public convertValue(parameterTypeId: number, value: string | number | boolean | Date | null | undefined) {
		let result: string | number | boolean | Date | null = null;
		switch (parameterTypeId) {
			case ParameterDataTypes.Integer:
			case ParameterDataTypes.Decimal1:
			case ParameterDataTypes.Decimal2:
			case ParameterDataTypes.Decimal3:
			case ParameterDataTypes.Decimal4:
			case ParameterDataTypes.Decimal5:
			case ParameterDataTypes.Decimal6:
				result = value !== null ? Number(value) : null;
				break;
			case ParameterDataTypes.Boolean:
				if (isBoolean(value)) {
					result = value;
				} else if (typeof value === 'string') {
					result = toLower(value) === 'true';
				} else {
					result = false;
				}
				break;
			case ParameterDataTypes.Date:
				result = value ? new Date(value.toString()) : null;
				break;
			case ParameterDataTypes.Text:
				result = value ? value.toString() : null;
				break;
			default:
				result = null;
				break;
		}
		return result;
	}
}
