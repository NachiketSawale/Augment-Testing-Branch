/*
 * Copyright(c) RIB Software GmbH
 */

import {Translatable} from '@libs/platform/common';

/**
 * Lookup simple entity
 */
export class LookupSimpleEntity {
	/**
	 * Description
	 */
	public description?: Translatable;

	/**
	 * Sorting value
	 */
	public sorting?: number;

	/**
	 * Is live
	 */
	public isLive?: boolean;

	/**
	 * Is default
	 */
	public isDefault?: boolean;

	/**
	 * The icon
	 */
	public icon?: number;

	/**
	 *  The constructor
	 * @param id
	 * @param desc the short name property of description
	 */
	public constructor(public id: number = 0, public desc: Translatable = '') {
		this.description = desc;
	}
}