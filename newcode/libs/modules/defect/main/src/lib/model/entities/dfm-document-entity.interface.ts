/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IDocumentBaseEntity } from '@libs/documents/interfaces';

/**
 * Defect document dto
 */
export interface IDfmDocumentEntity extends IEntityBase, IDocumentBaseEntity {
	/**
	 * DfmDefectFk
	 */
	DfmDefectFk: number;
	/**
	 * DfmDocumenttypeFk
	 */
	DfmDocumenttypeFk: number;
}
