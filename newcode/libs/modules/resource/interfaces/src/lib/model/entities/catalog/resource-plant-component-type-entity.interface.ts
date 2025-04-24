/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from 'libs/platform/common/src';

export interface IResourcePlantComponentTypeEntity extends IEntityBase {

	DescriptionInfo?: IDescriptionInfo | null;
	EquipmentContextFk?: number | null;
	Id: number;
	IsBaseComponent?: boolean | null;
	IsDefault?: boolean | null;
	IsLive?: boolean | null;
	Sorting?: number | null;
}
