/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';

/**
 * Interface of entity filter result preview info
 */
export interface IEntityFilterResultPreviewInfo<TEntity extends IEntityIdentification> {
	previewItem?: TEntity;
	previewCustomConfig?: object;
}