/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo, IEntityBase, IEntityIdentification} from '@libs/platform/common';

export interface ITextModuleHyperlinkEntity extends IEntityBase, IEntityIdentification {
	Id: number;
	TextModuleFk: number;
	LanguageFk: number;
	Url: string | null;
	DescriptionInfo: IDescriptionInfo;
}
