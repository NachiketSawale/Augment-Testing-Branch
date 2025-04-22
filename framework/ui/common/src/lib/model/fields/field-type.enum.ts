/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Distinguishes types of fields in a [form configuration]{@link IFormConfig} object
 * or in a list of grid columns.
 *
 * @group Fields API
 */
 export enum FieldType {

	/**
	 * An input control for the *code* domain type.
	 */
	Code = 'code',

	/**
	 * An input control for the *description* domain type.
	 */
	Description = 'description',

	/**
	 * An input control for the *history* domain type.
	 */
	History = 'history',

	/**
	 * An input control for the *translation* domain type.
	 */
	Translation = 'translation',

	/**
	 * An input control for the *email* domain type.
	 */
	Email = 'email',

	/**
	 * An input control for the *password* domain type.
	 */
	Password = 'password',

	/**
	 * An input control for the *iban* domain type.
	 */
	Iban = 'iban',

	/**
	 * An input control for the *imperialft* domain type.
	 */
	ImperialFt = 'imperialft',

	/**
	 * An input control for the *durationsec* domain type.
	 */
	DurationSec = 'durationsec',

	/**
	 * An input control for the *money* domain type.
	 */
	Money = 'money',

	/**
	 * An input control for the *integer* domain type.
	 */
	Integer = 'integer',

	/**
	 * An input control for the *quantity* domain type.
	 */
	Quantity = 'quantity',

	/**
	 * An input control for the *uomquantity* domain type.
	 */
	UomQuantity = 'uomquantity',

	/**
	 * An input control for the *linearquantity* domain type.
	 */
	LinearQuantity = 'linearquantity',

	/**
	 * An input control for the *factor* domain type.
	 */
	Factor = 'factor',

	/**
	 * An input control for the *exchangerate* domain type.
	 */
	ExchangeRate = 'exchangerate',

	/**
	 * An input control for the *percent* domain type.
	 */
	Percent = 'percent',

	/**
	 * An input control for the *decimal* domain type.
	 */
	Decimal = 'decimal',

	/**
	 * An input control for the *time* domain type.
	 */
	Time = 'time',

	/**
	 * An input control for the *timeutc* domain type.
	 */
	TimeUtc = 'timeutc',

	/**
	 * An input control for the *date* domain type.
	 */
	Date = 'date',

	/**
	 * An input control for the *dateutc* domain type.
	 */
	DateUtc = 'dateutc',

	/**
	 * An input control for the *datetime* domain type.
	 */
	DateTime = 'datetime',

	/**
	 * An input control for the *datetimeutc* domain type.
	 */
	DateTimeUtc = 'datetimeutc',

	/**
	 * An input control for the *boolean* domain type.
	 */
	Boolean = 'boolean',

	/**
	 * An input control for the *text* domain type.
	 */
	Text = 'text',

	/**
	 * An input control for the *remark* domain type.
	 */
	Remark = 'remark',

	/**
	 * An input control for the *comment* domain type.
	 */
	Comment = 'comment',

	/**
	 * An input control for the *select* domain type.
	 */
	Select = 'select',

	/**
	 * An input control for the *inputselect* domain type.
	 */
	InputSelect = 'inputselect',

	/**
	 * An input control for the *imageselect* domain type.
	 */
	ImageSelect = 'imageselect',

	/**
	 * An input control for the *fileselect* domain type.
	 */
	FileSelect = 'fileselect',

	/**
	 * An input control for the *color* domain type.
	 */
	Color = 'color',

	/**
	 * An input control for the *url* domain type.
	 */
	Url = 'url',

	/**
	 * An input control for the *composite* domain type.
	 */
	Composite = 'composite',

	/**
	 * An input control for the *radio* domain type.
	 */
	Radio = 'radio',

	/**
	 * An input control for the *image* domain type.
	 */
	Image = 'image',

	/**
	 * A field that displays a custom component rather than one of the pre-defined controls.
	 */
	CustomComponent = 'customcomponent',

	/**
	 * A text input control that also allows to save user-defined translations.
	 */
	CustomTranslate = 'customtranslate',

	/**
	 * An input control for storing scripts
	 */
	Script = 'script',

	/**
	 * A lookup input control that usually references a record in a table.
	 */
	Lookup = 'lookup',

	/**
	 * A free input control with a lookup selection dropdown.
	 */
	LookupInputSelect = 'lookupinputselect',

	/**
	 * A grid control.
	 */
	Grid = 'grid',

	/**
	 * A field that changes its domain dynamically
	 */
	Dynamic = 'dynamic',

	/**
	 * A field that displays one or more clickable buttons (actually, a menulist).
	 */
	Action = 'action'
}

const stringFieldTypes = [
	FieldType.Code,
	FieldType.Description,
	FieldType.Translation,
	FieldType.Text,
	FieldType.Comment,
	FieldType.Remark
] as const;

/**
 * Checks whether a given field type denotes a string type.
 * @param fieldType The field type to check.
 * @return The result of the type check.
 *
 * @group Fields API
 */
export function isStringFieldType(fieldType: FieldType): fieldType is StringFieldType {
	return stringFieldTypes.map(v => v as string).includes(fieldType);
}

/**
 * The subset of {@link FieldType} that denote string types.
 *
 * @group Fields API
 */
export type StringFieldType = typeof stringFieldTypes[number];

const numericFieldTypes = [
	FieldType.ImperialFt,
	FieldType.DurationSec,
	FieldType.Money,
	FieldType.Integer,
	FieldType.Quantity,
	FieldType.UomQuantity,
	FieldType.LinearQuantity,
	FieldType.Factor,
	FieldType.ExchangeRate,
	FieldType.Percent,
	FieldType.Decimal
] as const;

/**
 * Checks whether a given field type denotes a number type.
 * @param fieldType The field type to check.
 * @return The result of the type check.
 *
 * @group Fields API
 */
export function isNumericFieldType(fieldType: FieldType): fieldType is NumericFieldType {
	return numericFieldTypes.map(v => v as string).includes(fieldType);
}

/**
 * The subset of {@link FieldType} that denote number types.
 *
 * @group Fields API
 */
export type NumericFieldType = typeof numericFieldTypes[number];

const dateFieldTypes = [
	FieldType.Time,
	FieldType.TimeUtc,
	FieldType.Date,
	FieldType.DateUtc,
	FieldType.DateTime,
	FieldType.DateTimeUtc
] as const;

/**
 * Checks whether a given field type denotes a date type.
 * @param fieldType The field type to check.
 * @return The result of the type check.
 *
 * @group Fields API
 */
export function isDateFieldType(fieldType: FieldType): fieldType is DateFieldType {
	return dateFieldTypes.map(v => v as string).includes(fieldType);
}

/**
 * The subset of {@link FieldType} that denote date types.
 *
 * @group Fields API
 */
export type DateFieldType = typeof dateFieldTypes[number];

const booleanFieldTypes = [
	FieldType.Boolean
] as const;

/**
 * The subset of {@link FieldType} that denote boolean types.
 *
 * @group Fields API
 */
type BooleanFieldType = typeof booleanFieldTypes[number];

/**
 * Checks whether a given field type denotes a boolean type.
 * @param fieldType The field type to check.
 * @return The result of the type check.
 *
 * @group Fields API
 */
export function isBooleanFieldType(fieldType: FieldType): fieldType is BooleanFieldType {
	return booleanFieldTypes.map(v => v as string).includes(fieldType);
}