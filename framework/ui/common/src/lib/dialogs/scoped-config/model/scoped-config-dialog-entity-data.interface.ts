/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Extra data for fallback.
 */
export interface IEntityData<T extends object> {
	/**
	 * Form control values for fallback level.
	 */
	__rt$inheritedSettings: Partial<T>;

	/**
	 * Function to modify form values.
	 */
	passValueOn: (propName: string) => void;
}
