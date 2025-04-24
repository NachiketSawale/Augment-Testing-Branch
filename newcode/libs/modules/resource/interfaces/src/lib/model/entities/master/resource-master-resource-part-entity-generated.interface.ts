/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceMasterResourcePartEntityGenerated extends IEntityIdentification, IEntityBase {
	 DescriptionInfo?: IDescriptionInfo | null;
	 ResourceFk: number;
	 ResourcePartTypeFk: number;
	 EquipmentContextFk?: number | null;
	 PlantFk?: number | null;
	 IsMainPart: boolean;
	 TimesheetContextFk?: number | null;
	 EmployeeFk?: number | null;
	 Price: number;
	 CurrencyFk: number;
	 CommentText?: string | null;
}