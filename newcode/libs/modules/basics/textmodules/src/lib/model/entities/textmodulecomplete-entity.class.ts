/*
 * Copyright(c) RIB Software GmbH
 */

import {ITextModuleEntity} from './textmodule-entity.interface';
import {CompleteIdentification} from '@libs/platform/common';
import {BlobsEntity} from '@libs/basics/shared';
import {ITextModuleHyperlinkEntity} from './textmodulehyperlink-entity.interface';
import {ITextModuleTextEntity} from './textmoduletext-entity.interface';
import {IClobsEntity} from '@libs/basics/shared';


export class TextModuleCompleteEntity implements CompleteIdentification<ITextModuleEntity> {
	public EntitiesCount!: number;
	public MainItemId!: number;
	public TextModule?: ITextModuleEntity | null;
	public RefTextModule?: ITextModuleEntity | null;
	public TextBlobToSave?: BlobsEntity | null;
	public TextClobToSave?: IClobsEntity | null;
	public TextModuleTextToSave?: ITextModuleTextEntity[] | null;
	public TextModuleHyperlinkToSave?: ITextModuleHyperlinkEntity[] | null;
	public TextModuleHyperlinkToDelete?: ITextModuleHyperlinkEntity[] | null;
}
