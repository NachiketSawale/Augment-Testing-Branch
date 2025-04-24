/*
 * Copyright(c) RIB Software GmbH
 */
import { PropertyValueType } from '../enum/property-value-type.enum';

export interface IPropertyKeyEntity {
	/**
	 * Id
	 */
	Id: number;

	/**
	 * ValueTypeFk
	 */
	ValueTypeFk: number;

	/**
	 * PropertyName
	 */
	PropertyName: string;

	/**
	 * ValueType
	 */
	ValueType: PropertyValueType;
}