/*
 * Copyright(c) RIB Software GmbH
 */

import { FormRow } from '@libs/ui/common';
import { IEntityIdentification } from '@libs/platform/common';
import { InjectionToken, Type } from '@angular/core';
import { IEntityFilterResultPreviewInfo } from './entity-filter-result-preview-info.interface';

/**
 * Interface of entity filter result preview configuration
 */
export interface IEntityFilterResultPreviewConfig<TEntity extends IEntityIdentification, CEntity extends object = object> {
	formRows: FormRow<TEntity>[];
	headerComponent?: Type<unknown>;
	headerComponentToken?: InjectionToken<IEntityFilterResultPreviewInfo<TEntity>>;
	previewCustomConfig?: CEntity,
	onPreviewItemChanged?(entity?: TEntity | null): Promise<void>
}