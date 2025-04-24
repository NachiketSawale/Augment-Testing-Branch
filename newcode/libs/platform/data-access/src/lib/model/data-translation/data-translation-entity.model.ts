/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';

/**
 * Stripped down structure of BasTranslation entry
 */
export class DataTranslationEntity implements IEntityIdentification {

	/**
	 * Id of the entry
	 */
	public Id!: number;

	/**
	 * Database Language Id
	 */
	public BasLanguageFk!: number;

	/**
	 * The description
	 */
	public Description!: string;

	/**
	 * Version of the entity
	 */
	public Version!: number;
}