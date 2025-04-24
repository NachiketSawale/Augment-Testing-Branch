/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface ILogisticCardTemplateJobCardTemplateDocumentEntityGenerated extends IEntityIdentification, IEntityBase {
	 JobCardTemplateFk: number;
	 Description?: string | null;
	 JobCardDocumentTypeFk: number;
	 DocumentTypeFk: number;
	 Date?: Date | null;
	 Barcode?: string | null;
	 FileArchiveDocFk?: number | null;
	 Url?: string | null;
}