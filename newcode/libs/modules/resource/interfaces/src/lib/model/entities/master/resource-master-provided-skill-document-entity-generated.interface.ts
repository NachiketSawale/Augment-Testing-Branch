/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceMasterProvidedSkillDocumentEntityGenerated extends IEntityIdentification, IEntityBase {
	 ResourceFk: number;
	 Resource2ProvSkillFk: number;
	 Description?: string | null;
	 ProvSkillDocTypeFk: number;
	 DocumentTypeFk: number;
	 Date?: Date | null;
	 Barcode?: string | null;
	 FileArchiveDocFk: number;
}