/*
 * Copyright(c) RIB Software GmbH
 */

import { ILayoutConfiguration } from '@libs/ui/common';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { LazyInjectionToken } from '@libs/platform/common';

/**
 * Interface for resource layout.
 */
export interface IResourceBaseLayoutService<T extends IEstResourceEntity> {
	/**
	 * generate layout
	 */
	generateLayout(): Promise<ILayoutConfiguration<T>>;
}

export const ESTIMATE_MAIN_RESOURCE_LAYOUT_TOKEN = new LazyInjectionToken<IResourceBaseLayoutService<IEstResourceEntity>>('estimate.main.resource.layout.service');
