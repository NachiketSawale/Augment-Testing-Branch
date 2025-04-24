/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeLanguageEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Culture: number;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	Codefinance: string;
	FbLanguageFk: number;
}
