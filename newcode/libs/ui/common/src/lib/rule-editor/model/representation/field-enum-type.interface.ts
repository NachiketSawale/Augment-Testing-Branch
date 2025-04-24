/*
 * Copyright(c) RIB Software GmbH
 */

import { IFieldEnumValue } from './field-enum-value.interface';

export interface IFieldEnumType {
	/**
	 * Id
	 */
	Id: number;

	/**
	 * Description
	 */
	Description: string;

	/**
	 * Values
	 */
	Values: IFieldEnumValue[];
}