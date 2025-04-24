/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IControltemplateUnitEntity } from './controltemplate-unit-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IControltemplateEntityGenerated extends IEntityBase {

	/*
	 * BasCompanyFk
	 */
	BasCompanyFk?: number | null;

	/*
	 * Code
	 */
	Code?: string | null;

	/*
	 * ControltemplateUnitEntities
	 */
	ControltemplateUnitEntities?: IControltemplateUnitEntity[] | null;

	/*
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsDefault
	 */
	IsDefault?: boolean | null;

	/*
	 * IsLive
	 */
	IsLive?: boolean | null;

	/*
	 * MdcContextFk
	 */
	MdcContextFk?: number | null;
}
