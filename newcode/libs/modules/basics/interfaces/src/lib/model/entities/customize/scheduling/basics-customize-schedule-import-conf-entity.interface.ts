/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeScheduleImportConfEntity extends IEntityBase, IEntityIdentification {
	ScheduleimportpropFk: number;
	Userdefnumber: number;
	CommentText: string;
}
