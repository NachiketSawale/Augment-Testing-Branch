/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMaterialCharacteristicEntityGenerated extends IEntityBase {
	/**
	 * CharacteristicDescription
	 */
	CharacteristicDescription?: string | null;

	/**
	 * CharacteristicInfo
	 */
	CharacteristicInfo?: IDescriptionInfo | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * MaterialFk
	 */
	MaterialFk: number;

	/**
	 * PropertyDescription
	 */
	PropertyDescription?: string | null;

	/**
	 * PropertyInfo
	 */
	PropertyInfo?: IDescriptionInfo | null;
}
