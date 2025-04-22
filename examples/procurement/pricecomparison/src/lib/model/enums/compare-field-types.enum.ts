/*
 * Copyright(c) RIB Software GmbH
 */

export enum CompareFieldTypes {
	Default = 0,
	Quote = 1,
	OldBillingSchema = 2, // TODO-DRIZZLE: Why need this old billing schema?
	BillingSchema = 4
}