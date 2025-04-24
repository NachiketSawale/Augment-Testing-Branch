/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IProjectDropPointArticlesEntityGenerated extends IEntityIdentification, IEntityBase {
	 ProjectFk: number;
	 DropPointFk: number;
	 Code: string | null;
	 PlantFk: number;
	 MdcMaterialFk: number;
	 ProductFk: number;
	 Quantity: number;
	 Comment?: string | null;
}