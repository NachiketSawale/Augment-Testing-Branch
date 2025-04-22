/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents a domain type that may appear in an entity schema.
 */
export enum EntityDomainType {

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
	 * An input control for the *color* domain type.
	 */
	Color = 'color'
}

const stringDomainTypes = [
	EntityDomainType.Code,
	EntityDomainType.Description,
	EntityDomainType.Translation,
	EntityDomainType.Text,
	EntityDomainType.Comment,
	EntityDomainType.Remark
] as const;

/**
 * The subset of {@link EntityDomainType} that denote string types.
 */
export type StringDomainType = typeof stringDomainTypes[number];

/**
 * A type guard to check whether a given entity domain type denotes a string type.
 * @param domainType The entity domain type.
 * @return The result of the type checking operation.
 */
export function isStringDomainType(domainType?: EntityDomainType): domainType is StringDomainType {
	return domainType ? stringDomainTypes.map(v => v as string).includes(domainType) : false;
}

const numericDomainTypes = [
	EntityDomainType.ImperialFt,
	EntityDomainType.DurationSec,
	EntityDomainType.Money,
	EntityDomainType.Integer,
	EntityDomainType.Quantity,
	EntityDomainType.UomQuantity,
	EntityDomainType.LinearQuantity,
	EntityDomainType.Factor,
	EntityDomainType.ExchangeRate,
	EntityDomainType.Percent,
	EntityDomainType.Decimal
] as const;

/**
 * The subset of {@link EntityDomainType} that denote number types.
 */
export type NumericDomainType = typeof numericDomainTypes[number];

/**
 * A type guard to check whether a given entity domain type denotes a number type.
 * @param domainType The entity domain type.
 * @return The result of the type checking operation.
 */
export function isNumericDomainType(domainType: EntityDomainType): domainType is NumericDomainType {
	return numericDomainTypes.map(v => v as string).includes(domainType);
}

const dateDomainTypes = [
	EntityDomainType.Time,
	EntityDomainType.TimeUtc,
	EntityDomainType.Date,
	EntityDomainType.DateUtc,
	EntityDomainType.DateTime,
	EntityDomainType.DateTimeUtc
] as const;

/**
 * The subset of {@link EntityDomainType} that denote date types.
 */
export type DateDomainType = typeof dateDomainTypes[number];

/**
 * A type guard to check whether a given entity domain type denotes a date type.
 * @param domainType The entity domain type.
 * @return The result of the type checking operation.
 */
export function isDateDomainType(domainType: EntityDomainType): domainType is DateDomainType {
	return dateDomainTypes.map(v => v as string).includes(domainType);
}

const booleanDomainTypes = [
	EntityDomainType.Boolean
] as const;

/**
 * The subset of {@link EntityDomainType} that denote boolean types.
 */
export type BooleanDomainType = typeof booleanDomainTypes[number];

/**
 * A type guard to check whether a given entity domain type denotes a boolean type.
 * @param domainType The entity domain type.
 * @return The result of the type checking operation.
 */
export function isBooleanDomainType(domainType: EntityDomainType): domainType is BooleanDomainType {
	return booleanDomainTypes.map(v => v as string).includes(domainType);
}