/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { AddressEntity } from './address-entity';
import { IEntityBase } from '@libs/platform/common';

/**
 * Represents a project address object.
 */
export interface IProjectAddress extends IEntityBase {
	/**
	 *
	 */
	Id: number;

	/**
	 *
	 */
	AddressFk: number;

	/**
	 *
	 */
	AddressTypeFk: number;

	/**
	 *
	 */
	CommentText: string;

	/**
	 *
	 */
	Description: string;

	/**
	 *
	 */
	ProjectFk: number;

	/**
	 *
	 */
	AddressEntity: AddressEntity;
}