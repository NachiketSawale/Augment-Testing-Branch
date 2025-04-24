/*
 * Copyright(c) RIB Software GmbH
 */

import { ICodeField } from './code-field.interface';
import { IPasswordField } from './password-field.interface';
import { IEmailField } from './email-field.interface';
import { IRadioField } from './radio-field.interface';
import { IImageField } from './image-field.interface';
import { IPercentField } from './percent-field.interface';
import { IDateTimeField } from './date-time-field.interface';
import { ITranslationField } from './translation-field.interface';
import { IIbanField } from './iban-field.interface';
import { IIntegerField } from './integer-field.interface';
import { IFileSelectField } from './file-select-field.interface';
import { ISelectField } from './select-field.interface';
import { ICompositeField } from './composite-field.interface';
import { IExchangeRateField } from './exchange-rate-field.interface';
import { IDurationSecField } from './duration-sec-field.interface';
import { IFactorField } from './factor-field.interface';
import { IColorField } from './color-field.interface';
import { IQuantityField } from './quantity-field.interface';
import { ITextField } from './text-field.interface';
import { IUomQuantityField } from './uom-quantity-field.interface';
import { IDecimalField } from './decimal-field.interface';
import { IDateTimeUtcField } from './date-time-utc-field.interface';
import { IBooleanField } from './boolean-field.interface';
import { ILinearQuantityField } from './linear-quantity-field.interface';
import { IDateUtcField } from './date-utc-field.interface';
import { IInputSelectField } from './input-select-field.interface';
import { IImperialFtField } from './imperial-ft-field.interface';
import { ICommentField } from './comment-field.interface';
import { ITimeField } from './time-field.interface';
import { IHistoryField } from './history-field.interface';
import { ITimeUtcField } from './time-utc-field.interface';
import { IRemarkField } from './remark-field.interface';
import { IUrlField } from './url-field.interface';
import { IMoneyField } from './money-field.interface';
import { IDateField } from './date-field.interface';
import { IDescriptionField } from './description-field.interface';
import { ICustomComponentField } from './custom-component-field.interface';
import { ICustomTranslateField } from './custom-translate-field.interface';
import { IScriptField } from './script-field.interface';
import { ILookupField } from './lookup-field.interface';
import { IGridField } from './grid-field.interface';
import { ILookupInputSelectField } from './lookup-input-select-field.interface';
import { IDynamicField } from './dynamic-field.interface';
import { IActionField } from './action-field.interface';

/**
 * Represents the set of allowable row types in a [form configuration]{@link IFormConfig}.
 *
 * @group Fields API
 */
export type ConcreteField<T extends object> =
	| ICodeField<T>
	| IDescriptionField<T>
	| IHistoryField<T>
	| ITranslationField<T>
	| IEmailField<T>
	| IPasswordField<T>
	| IIbanField<T>
	| IImperialFtField<T>
	| IDurationSecField<T>
	| IMoneyField<T>
	| IIntegerField<T>
	| IQuantityField<T>
	| IUomQuantityField<T>
	| ILinearQuantityField<T>
	| IFactorField<T>
	| IExchangeRateField<T>
	| IPercentField<T>
	| IDecimalField<T>
	| ITimeField<T>
	| ITimeUtcField<T>
	| IDateField<T>
	| IDateUtcField<T>
	| IDateTimeField<T>
	| IDateTimeUtcField<T>
	| IBooleanField<T>
	| ITextField<T>
	| IRemarkField<T>
	| ICommentField<T>
	| ISelectField<T>
	| IInputSelectField<T>
	| IFileSelectField<T>
	| IColorField<T>
	| IUrlField<T>
	| ICompositeField<T>
	| IRadioField<T>
	| IImageField<T>
	| ICustomComponentField<T>
	| ICustomTranslateField<T>
	| IScriptField<T>
	| ILookupField<T>
	| ILookupInputSelectField<T>
	| IGridField<T>
	| IDynamicField<T>
	| IActionField<T>;
