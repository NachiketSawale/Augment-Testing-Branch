/*
 * Copyright(c) RIB Software GmbH
 */

import { ILayoutConfiguration } from '@libs/ui/common';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { LazyInjectionToken } from '@libs/platform/common';

/**
 * Interface for lineItem layout.
 */
export interface ILineItemBaseLayoutService<T extends IEstLineItemEntity> {
	/**
	 * generate layout
	 */
	generateLayout(): Promise<ILayoutConfiguration<T>>;
}

export const ESTIMATE_MAIN_LINE_ITEM_LAYOUT_TOKEN = new LazyInjectionToken<ILineItemBaseLayoutService<IEstLineItemEntity>>('estimate.main.lineitem.layout.service');
