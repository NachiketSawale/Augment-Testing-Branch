/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents modes by which to populate fields with data.
 */
export enum FieldDataMode {

	/**
	 * The data will be taken from the field definition.
	 * If the field definition contains no data, the model of the edited record will be used.
	 */
	FieldDefElseModel,

	/**
	 * The data will be taken from the edited record.
	 * If the edited record contains no data, the field definition will be used.
	 */
	ModelElseFieldDef,

	/**
	 * The data from the field definition and the edited record will be combined.
	 */
	Both
}
