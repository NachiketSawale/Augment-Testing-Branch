/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, isNumericFieldType, isStringFieldType } from '../field-type.enum';

export function getAdditionalConfigFieldsForType(type: FieldType): string[] {
	if (isStringFieldType(type)) {
		return ['maxLength', 'placeholder'];
	} else if (isNumericFieldType(type)) {
		return ['minValue', 'maxValue', 'placeholder'];
	} else {
		switch (type) {
			case FieldType.CustomComponent:
				return ['componentType', 'providers'];
			case FieldType.FileSelect:
				return ['options'];
			case FieldType.Select:
			case FieldType.InputSelect:
			case FieldType.ImageSelect:
			case FieldType.Radio:
				return ['itemsSource', 'options'];
			case FieldType.Color:
				return ['format', 'showClearButton', 'infoText'];
			case FieldType.CustomTranslate:
				return ['options'];
			case FieldType.Composite:
				return [
					'composite'
				];
			case FieldType.Time:
			case FieldType.TimeUtc:
				return [
					'options'
				];
			case FieldType.Script:
				return ['editorOptions'];
			case FieldType.Lookup:
				return ['lookupOptions', 'format', 'additionalFields'];
			case FieldType.Password:
				return ['placeholder'];
			case FieldType.LookupInputSelect:
				return ['lookupOptions'];
			case FieldType.Dynamic:
				return ['overload'];
			case FieldType.Grid:
				return ['configuration', 'height', 'tools'];
			case FieldType.Action:
				return ['actions', 'actionsSource', 'displayText'];
			default:
				return [];
		}
	}
}
