/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICustomCharacteristicData {
	/**
	 * CharacteristicId
	 */
	CharacteristicId: number;

	/**
	 * CharacteristicTypeId
	 */
	CharacteristicTypeId: number;

	/**
	 * CharacteristicValueFk
	 */
	CharacteristicValueFk?: number | null;

	/**
	 * Code
	 */
	Code?: string | null;

	/**
	 * DefaultValue
	 */
	DefaultValue?: string | null;

	/**
	 * Description
	 */
	Description?: string | null;

	/**
	 * GroupId
	 */
	GroupId: number;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * ObjectId
	 */
	ObjectId: number;

	/**
	 * SectionId
	 */
	SectionId: number;

	/**
	 * ValueBool
	 */
	ValueBool?: boolean | null;

	/**
	 * ValueDate
	 */
	ValueDate?: string | null;

	/**
	 * ValueNumber
	 */
	ValueNumber?: number | null;

	/**
	 * ValueText
	 */
	ValueText?: string | null;

	CharacteristicValueId?: number;
}
