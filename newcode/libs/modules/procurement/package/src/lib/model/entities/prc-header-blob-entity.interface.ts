/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase, IEntityIdentification} from '@libs/platform/common';

export interface IPrcHeaderblobEntity extends IEntityBase, IEntityIdentification {
	PrcTexttypeFk: number;
	PrcHeaderFk: number;
	Content?: unknown ;
	PlainText?: string ;
	TextModuleTypeFk?: number ;
	IsProject: boolean;
	ContentString?: string ;
	TextFormatFk?: number ;
	IsReload: boolean;
}
