import { PropertyValueType } from '@libs/constructionsystem/shared';
import { Injectable } from '@angular/core';
interface ICosObjectTemplateProperty {
	/**
	 * PropertyValueBool
	 */
	PropertyValueBool: boolean | null;

	/**
	 * PropertyValueDate
	 */
	PropertyValueDate: string | Date | null;

	/**
	 * PropertyValueLong
	 */
	PropertyValueLong: number | null;

	/**
	 * PropertyValueNumber
	 */
	PropertyValueNumber: number | null;

	/**
	 * PropertyValueText
	 */
	PropertyValueText: string | null;

	Value?: number | string | boolean | Date | null;
}
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemObjectTemplateHelperService {
	public convertValue(type: PropertyValueType, entity: ICosObjectTemplateProperty) {
		switch (type) {
			case PropertyValueType.Text:
				entity.Value = entity.PropertyValueText ?? null;
				break;
			case PropertyValueType.Decimal:
				entity.Value = ((entity.PropertyValueNumber as number) ?? 0).toFixed(3);
				break;
			case PropertyValueType.Long:
				entity.Value = entity.PropertyValueLong ?? null;
				break;
			case PropertyValueType.Boolean:
				entity.Value = entity.PropertyValueBool ?? false;
				break;
			case PropertyValueType.Date:
				entity.Value = entity.PropertyValueDate ?? null;
				break;
			default:
				if (entity) {
					entity.Value = null;
				}
		}
	}
}
