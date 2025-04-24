/*
 * Copyright(c) RIB Software GmbH
 */

import {BlobsEntity} from '@libs/basics/shared';
import {IClobsEntity} from '@libs/basics/shared';
import {IEntityBase, IEntityIdentification} from '@libs/platform/common';

export interface ITextModuleTextEntity extends IEntityBase, IEntityIdentification{
	Id: number;
	TextModuleFk: number;
	LanguageFk: number;
	BlobFk?: number | null;
	ClobFk: number | null;
	TextBlob: BlobsEntity | null;
	TextClob: IClobsEntity | null;
}
