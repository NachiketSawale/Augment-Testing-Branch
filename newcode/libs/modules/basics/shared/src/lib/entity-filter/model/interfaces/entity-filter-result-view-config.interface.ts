/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';
import { IEntityFilterResultGridConfig } from './entity-filter-result-grid-config.interface';
import { IEntityFilterResultPreviewConfig } from './entity-filter-result-preview-config.interface';
import { ConcreteMenuItem } from '@libs/ui/common';

/**
 * Interface of entity filter result view configuration
 */
export interface IEntityFilterResultViewConfig<TEntity extends IEntityIdentification, CEntity extends object = object> {
	titleTr?: string;
	gridOption: IEntityFilterResultGridConfig<TEntity>;
	previewOption: IEntityFilterResultPreviewConfig<TEntity, CEntity>;
	toolBarSettingItems: ConcreteMenuItem<void>[]
}