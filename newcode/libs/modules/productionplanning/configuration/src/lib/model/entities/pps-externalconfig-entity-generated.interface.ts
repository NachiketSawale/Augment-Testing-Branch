/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IClobsEntity } from '@libs/basics/shared';

export interface IPpsExternalconfigEntityGenerated extends IEntityBase {

	/*
	 * BasClobsFk
	 */
	BasClobsFk?: number | null;

	/*
	 * BasExternalSourceFk
	 */
	BasExternalSourceFk?: number | null;

	/*
	 * BasExternalSourceTypeFk
	 */
	BasExternalSourceTypeFk?: number | null;

	/*
	 * ClobToSave
	 */
	ClobToSave?: IClobsEntity | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsLive
	 */
	IsLive?: boolean | null;

	/*
	 * PKey1
	 */
	PKey1?: number | null;

	/*
	 * PKey2
	 */
	PKey2?: number | null;

	/*
	 * Remark
	 */
	Remark?: string | null;

	/*
	 * Sorting
	 */
	Sorting?: number | null;

	/*
	 * UserFlag1
	 */
	UserFlag1?: boolean | null;

	/*
	 * UserFlag2
	 */
	UserFlag2?: boolean | null;

	/*
	 * Userdefined1
	 */
	Userdefined1?: string | null;

	/*
	 * Userdefined2
	 */
	Userdefined2?: string | null;

	/*
	 * Userdefined3
	 */
	Userdefined3?: string | null;

	/*
	 * Userdefined4
	 */
	Userdefined4?: string | null;

	/*
	 * Userdefined5
	 */
	Userdefined5?: string | null;
}
