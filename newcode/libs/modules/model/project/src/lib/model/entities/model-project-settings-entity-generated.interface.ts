/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IModelProjectSettingsEntityGenerated extends IEntityBase {

	/*
	 * Active
	 */
	Active: boolean;

	/*
	 * DefaultVersionCodePattern
	 */
	DefaultVersionCodePattern?: string | null;

	/*
	 * DefaultVersionDescriptionPattern
	 */
	DefaultVersionDescriptionPattern?: string | null;

	/*
	 * ExpiryDate
	 */
	ExpiryDate?: string | null;

	/*
	 * ExpiryDays
	 */
	ExpiryDays?: number | null;

	/*
	 * LodFk
	 */
	LodFk?: number | null;

	/*
	 * ProjectFk
	 */
	ProjectFk: number;

	/*
	 * TypeFk
	 */
	TypeFk?: number | null;

	/*
	 * VersionCodePattern
	 */
	VersionCodePattern?: string | null;

	/*
	 * VersionDescriptionPattern
	 */
	VersionDescriptionPattern?: string | null;
}
