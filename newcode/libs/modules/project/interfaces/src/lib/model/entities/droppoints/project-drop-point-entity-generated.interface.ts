/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { IProjectDropPointEntity } from './project-drop-point-entity.interface';

export interface IProjectDropPointEntityGenerated extends IEntityIdentification, IEntityBase {
	 ProjectFk: number;
	 SubResources: IProjectDropPointEntity | null[];
	 Code: string | null;
	 GLNCode?: string | null;
	 DropPointTypeFk: number;
	 IsActive: boolean;
	 HidInPubApi: boolean;
	 IsManual: boolean;
	 ControllingUnitFk?: number | null;
	 PrjAddressFk?: number | null;
	 ClerkRespFk?: number | null;
	 Comment?: string | null;
}