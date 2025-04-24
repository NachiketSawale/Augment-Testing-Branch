/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeKeyFigureEntity extends IEntityBase, IEntityIdentification {
	UomFk: number;
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	Iscurrency: boolean;
	IsDefault: boolean;
	Isvisible: boolean;
	IsLive: boolean;
}
