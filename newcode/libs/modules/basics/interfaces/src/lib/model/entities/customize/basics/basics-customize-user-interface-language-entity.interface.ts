/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeUserInterfaceLanguageEntity extends IEntityBase, IEntityIdentification {
	Description: string;
	Language: number;
	Culture: number;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
