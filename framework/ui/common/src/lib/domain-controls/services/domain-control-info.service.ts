/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, StaticProvider, Type } from '@angular/core';
import { FieldType } from '../../model/fields/field-type.enum';
import { CheckBoxComponent } from '../components/check-box/check-box.component';
import { FileSelectComponent } from '../components/file-select/file-select.component';
import {
	UntypedDomainControlBaseComponent
} from '../components/untyped-domain-control-base/untyped-domain-control-base.component';
import { DateComponent } from '../components/date/date.component';
import { CustomControlHostComponent } from '../components/custom-control-host/custom-control-host.component';
import { HistoryComponent } from '../components/history/history.component';
import { SingleLineTextComponent } from '../components/single-line-text/single-line-text.component';
import { MultiLineTextComponent } from '../components/multi-line-text/multi-line-text.component';
import { FloatComponent } from '../components/float/float.component';
import { IntegerComponent } from '../components/integer/integer.component';
import { PasswordComponent } from '../components/password/password.component';
import { FloatConfigInjectionToken, IFloatConfig } from '../model/float-config.interface';
import { SelectComponent } from '../components/select/select.component';
import { getAdditionalConfigFieldsForType } from '../../model/fields/additional/additional-options-utils.model';
import { InputSelectComponent } from '../components/input-select/input-select.component';
import { ColorPickerComponent } from '../components/color-picker/color-picker.component';
import { TimeComponent } from '../components/time/time.component';
import { TranslationComponent } from '../components/translation/translation.component';
import { RadioComponent } from '../components/radio/radio.component';
import { CompositeComponent } from '../components/composite/composite.component';
import { CustomTranslateComponent } from '../components/custom-translate/custom-translate.component';
import { ScriptComponent } from '../components/script/script.component';
import { LookupHostComponent } from '../components/lookup-host/lookup-host.component';
import { ITimeConfig, TimeConfigInjectionToken } from '../model/time-config.interface';
import { DateConfigInjectionToken, IDateConfig } from '../model/date-config.interface';
import { MISSING_IDENT_TOKEN, MissingComponent } from '../components/missing/missing.component';
import { FormGridComponent } from '../components/form-grid/form-grid.component';
import { DynamicDomainControlComponent } from '../components/dynamic-domain-control/dynamic-domain-control.component';
import { LookupInputSelectHostComponent } from '../components/lookup-input-select-host/lookup-input-select-host.component';
import { ActionComponent } from '../components/action/action.component';
import { ImageSelectComponent } from '../components/image-select/image-select.component';
import { UrlComponent } from '../components/url/url.component';

/**
 * Contains some information about a domain control component type.
 */
interface IDomainControlInfo {
	/**
	 * The Angular component type to use.
	 */
	readonly componentType: Type<UntypedDomainControlBaseComponent>;

	/**
	 * An optional list of custom injection providers.
	 */
	readonly providers?: StaticProvider[];

	/**
	 * Additional attributes
	 */
	readonly attributes?: IDomainControlAttributes;
}

/**
 * Contains predefined attributes of domain control component type.
 */
interface IDomainControlAttributes {
	/**
	 * Regular Expression
	 */
	readonly regex?: string;

	/**
	 * Regular Expression Template
	 */
	readonly regexTemplate?: string;

	/**
	 * Default Width of the control
	 */
	readonly defaultWidth?: number;

	/**
	 * Boolean value defining if control is searchable
	 */
	readonly searchable?: boolean;

	/**
	 * Icon Path
	 */
	readonly image?: string;

	/**
	 * Base unit
	 */
	readonly baseUnit?: string;

	/**
	 * Destination Unit
	 */
	readonly destinationUnit?: string[];

	/**
	 * Alternative Unit
	 */
	readonly alternativeUnits?: string[][];

	/**
	 * Is Fraction
	 */
	readonly isFraction?: boolean;

	/**
	 * Format
	 */
	readonly format?: string;

	/**
	 * Model
	 */
	readonly model?: string;

}

function generateFloatInfo(config: IFloatConfig, attributes?: IDomainControlAttributes): IDomainControlInfo {
	return {
		componentType: FloatComponent,
		providers: [
			{
				provide: FloatConfigInjectionToken,
				useValue: config,
			}
		],
		attributes: attributes
	};
}
/**
 * Provides FieldType along with componentType
 * @param config {ITimeConfig}
 * @returns {IDomainControlInfo}
 */
function generateTimeInfo(config: ITimeConfig): IDomainControlInfo {
	return {
		componentType: TimeComponent,
		providers: [
			{
				provide: TimeConfigInjectionToken,
				useValue: config,
			},
		],
	};
}

function generateDateInfo(config: IDateConfig, attributes?: IDomainControlAttributes): IDomainControlInfo {
	return {
		componentType: DateComponent,
		providers: [
			{
				provide: DateConfigInjectionToken,
				useValue: config,
			},
		],
		attributes: attributes
	};
}

/**
 * Provides information related to domain controls and the underlying types.
 */
@Injectable({
	providedIn: 'root',
})
export class DomainControlInfoService {
	/**
	 * Returns the Angular component type for a given field type.
	 * @param type The field type.
	 * @returns The Angular component type.
	 */
	public getComponentInfoByFieldType(type: FieldType): IDomainControlInfo {
		switch (type) {
			case FieldType.Boolean:
				return {
					componentType: CheckBoxComponent,
					attributes: {
						defaultWidth: 20,
						image: 'control-icons ico-domain-boolean'
					}

				};
			case FieldType.Code:
				return {
					componentType: SingleLineTextComponent,
					attributes: {
						regex: '^[\\s\\S]{0,16}$',
						regexTemplate: '^[\\s\\S]{0,@@maxLength}$',
						defaultWidth: 100,
						searchable: true,
						image: 'control-icons ico-domain-code'
					}
				};
			case FieldType.Translation:
				return {
					componentType: TranslationComponent
				};
			case FieldType.Description:
				return {
					componentType: SingleLineTextComponent,
					attributes: {
						regex: '^[\\s\\S]{0,42}$',
						regexTemplate: '^[\\s\\S]{0,@@maxLength}$',
						defaultWidth: 200,
						searchable: true,
						image: 'control-icons ico-domain-description'
					}
				};
			case FieldType.Url:
				return {
					componentType: UrlComponent,
					attributes: {
						defaultWidth: 150,
						searchable: true,
						image: 'control-icons ico-web2'
					}
				};
			case FieldType.Email:
				return {
					componentType: SingleLineTextComponent,
					attributes: {
						regex: '^[\\s\\S]{0,64}@?[\\s\\S]{0,253}$',
						defaultWidth: 150,
						searchable: true,
						image: 'control-icons ico-mail-noicon-1'
					}
				};
			case FieldType.Iban:
				return {
					componentType: SingleLineTextComponent,
					attributes: {
						regex: '^[\\s\\S]{0,42}$',
						defaultWidth: 100,
						image: 'control-icons ico-domain-iban'
					}
				};
			case FieldType.Remark:
				return {
					componentType: MultiLineTextComponent,
					attributes: {
						regex: '^[\\s\\S]{0,2000}$',
						regexTemplate: '^[\\s\\S]{0,@@maxLength}$',
						defaultWidth: 200,
						searchable: true,
						image: 'control-icons ico-domain-remark'
					}
				};
			case FieldType.Comment:
				return {
					componentType: MultiLineTextComponent,
					attributes: {
						regex: '^[\\s\\S]{0,255}$',
						regexTemplate: '^[\\s\\S]{0,@@maxLength}$',
						defaultWidth: 200,
						searchable: true,
						image: 'control-icons ico-domain-comment'
					}
				};
			case FieldType.Password:
				return {
					componentType: PasswordComponent,
					attributes: {
						regex: '^[\\s\\S]{0,128}$',
						regexTemplate: '^[\\s\\S]{0,@@maxLength}$',
						defaultWidth: 200,
						image: 'control-icons ico-domain-password'
					}
				};
			case FieldType.History:
				return {
					componentType: HistoryComponent,
					attributes: {
						regex: '^[\\s\\S]{0,255}$',
						defaultWidth: 150,
						image: 'control-icons ico-domain-history'
					}
				};
			case FieldType.Integer:
				return {
					componentType: IntegerComponent,
					attributes: {
						regex: '^[+-]?\\d*$',
						defaultWidth: 75,
						image: 'control-icons ico-domain-integer'
					}
				};
			case FieldType.ImperialFt:
				return generateFloatInfo({
					decimalPlaces: 4
				}, {
					// eslint-disable-next-line no-useless-escape
					regex: '(^((\\d+\\s)?\\d*((\\/|:)\\d*)?((f?(?<=f)t?)|\')?)?((?<=ft|\')\\s)?((\\d+\\s)?\\d*((\\/|:)\\d*)?((i?(?<=i)n?)|\&#34)?)?$)',
					defaultWidth: 100,
					searchable: true,
					baseUnit: 'm',
					destinationUnit: ['ft', 'in'],
					alternativeUnits: [['\'', '"']],
					isFraction: true,
					image: 'control-icons ico-domain-quantity'
				});
			case FieldType.Decimal:
				return generateFloatInfo({
					decimalPlaces: 3
				}, {
					regex: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s\\d]*))([,\\.][\\d]{0,3})$)',
					regexTemplate: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s\\d]*))([,\\.][\\d]{0,@@decimalPlaces})$)',
					defaultWidth: 100,
					searchable: true,
					image: 'control-icons ico-domain-percent'
				});
			case FieldType.DurationSec:
				return generateFloatInfo({
					decimalPlaces: 2
				}, {
					regex: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s\\d]*))([,\\.][\\d]{0,2})$)',
					format: 'seconds',
					defaultWidth: 75,
					image: 'control-icons ico-domain-time'
				});
			case FieldType.UomQuantity:
			case FieldType.LinearQuantity:
			case FieldType.Percent:
			case FieldType.Money:
				return generateFloatInfo({
					decimalPlaces: 2
				}, {
					regex: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s\\d]*))([,\\.][\\d]{0,2})$)',
					regexTemplate: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s\\d]*))([,\\.][\\d]{0,@@decimalPlaces})$)',
					defaultWidth: 100,
					searchable: true,
					image: 'control-icons ico-domain-money'
				});
			case FieldType.Quantity:
				return generateFloatInfo({
					decimalPlaces: 3
				}, {
					regex: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s\\d]*))([,\\.][\\d]{0,3})$)',
					regexTemplate: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s\\d]*))([,\\.][\\d]{0,@@decimalPlaces})$)',
					defaultWidth: 100,
					searchable: true,
					image: 'control-icons ico-domain-quantity'
				});
			case FieldType.ExchangeRate:
				return generateFloatInfo({
					decimalPlaces: 5
				}, {
					regex: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s\\d]*))([,\\.][\\d]{0,5})$)',
					regexTemplate: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s\\d]*))([,\\.][\\d]{0,@@decimalPlaces})$)',
					defaultWidth: 100,
					image: 'control-icons ico-domain-exchangerate'
				});
			case FieldType.Factor:
				return generateFloatInfo({
					decimalPlaces: 6
				}, {
					regex: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s\\d]*))([,\\.][\\d]{0,6})$)',
					regexTemplate: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s\\d]*))([,\\.][\\d]{0,@@decimalPlaces})$)',
					defaultWidth: 100,
					image: 'control-icons ico-domain-factor'
				});
			case FieldType.Select:
				return {
					componentType: SelectComponent,
					attributes: {
						defaultWidth: 75,
						image: 'control-icons ico-domain-select'
					}
				};
			case FieldType.InputSelect:
				return {
					componentType: InputSelectComponent,
					attributes: {
						defaultWidth: 100,
						image: 'control-icons ico-domain-inputselect'
					}
				};
			case FieldType.ImageSelect:
				return {
					componentType: ImageSelectComponent
				};
			case FieldType.Radio:
				return {
					componentType: RadioComponent,
					attributes: {
						defaultWidth: 100,
						image: 'control-icons ico-domain-radio'
					}
				};
			case FieldType.FileSelect:
				return {
					componentType: FileSelectComponent
				};
			case FieldType.Date:
				return generateDateInfo({
					type: FieldType.Date,
				}, {
					format: 'P',
					defaultWidth: 100,
					image: 'control-icons ico-domain-date'
				});
			case FieldType.DateUtc:
				return generateDateInfo({
					type: FieldType.DateUtc,
				}, {
					format: 'P',
					defaultWidth: 100,
					image: 'control-icons ico-domain-date'
				});
			case FieldType.CustomComponent:
				return {
					componentType: CustomControlHostComponent,
				};
			case FieldType.Color:
				return {
					componentType: ColorPickerComponent,
					attributes: {
						defaultWidth: 50,
						image: 'control-icons ico-domain-color'
					}
				};
			case FieldType.Composite:
				return {
					componentType: CompositeComponent,
				};
			case FieldType.CustomTranslate:
				return {
					componentType: CustomTranslateComponent,
					attributes: {
						regex: '^[\\s\\S]{0,42}$',
						regexTemplate: '^[\\s\\S]{0,@@maxLength}$',
						model: 'Translated',
						searchable: true,
						defaultWidth: 200,
						image: 'control-icons ico-domain-translation'
					}
				};
			case FieldType.Script:
				return {
					componentType: ScriptComponent,
				};
			case FieldType.Lookup:
				return {
					componentType: LookupHostComponent,
				};
			case FieldType.Time:
				return generateTimeInfo({ 
					type: FieldType.Time 
				});
			case FieldType.TimeUtc:
				return generateTimeInfo({
					type: FieldType.TimeUtc
				});
			case FieldType.Action:
				return {
					componentType: ActionComponent,
				};
			case FieldType.LookupInputSelect:
				return {
					componentType: LookupInputSelectHostComponent,
				};
			case FieldType.Grid:
				return {
					componentType: FormGridComponent,
				};
			case FieldType.Dynamic:
				return {
					componentType: DynamicDomainControlComponent
				};
			default:
				return {
					componentType: MissingComponent,
					providers: [{
						provide: MISSING_IDENT_TOKEN,
						useValue: type
					}]
				};
		}
	}

	/**
	 * Gets an array of property names that can be found on the configuration of a given field type in addition to standard fields.
	 * @param type The field type.
	 * @returns An array of property names.
	 */
	public getAdditionalConfigFields(type: FieldType): string[] {
		return getAdditionalConfigFieldsForType(type);
	}
}
