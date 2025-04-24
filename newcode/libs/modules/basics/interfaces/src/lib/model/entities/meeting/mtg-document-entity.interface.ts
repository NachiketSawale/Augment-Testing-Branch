/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IDocumentBaseEntity } from '@libs/documents/interfaces';

/**
 * Meeting document dto
 */
export interface IMtgDocumentEntity extends IEntityBase, IDocumentBaseEntity {
	/**
	 * MtgHeaderFk
	 */
	MtgHeaderFk: number;
}
