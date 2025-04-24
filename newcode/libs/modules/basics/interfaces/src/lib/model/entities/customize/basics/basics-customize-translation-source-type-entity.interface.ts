/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTranslationSourceTypeEntity extends IEntityBase, IEntityIdentification {
	Description: string;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
