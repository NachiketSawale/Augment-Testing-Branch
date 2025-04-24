/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IControltemplateUnitEntity } from './controltemplate-unit-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IControltemplateGroupEntityGenerated extends IEntityBase {

	/*
	 * ControllingGroupFk
	 */
	ControllingGroupFk?: number | null;

	/*
	 * ControllingGrpDetailFk
	 */
	ControllingGrpDetailFk?: number | null;

	/*
	 * ControltemplateUnitEntity
	 */
	ControltemplateUnitEntity?: IControltemplateUnitEntity | null;

	/*
	 * ControltemplateUnitFk
	 */
	ControltemplateUnitFk?: number | null;

	/*
	 * Id
	 */
	Id: number;
}
