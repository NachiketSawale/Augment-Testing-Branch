/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext, LazyInjectionToken } from '@libs/platform/common';
import { IProjectEntity } from '../entities/main/project-main-entity.interface';
import { ILayoutConfiguration } from '@libs/ui/common';

/**
 * Material group attribute data service
 */
export interface IProjectMainLayoutService {
	generateLayout(context: IInitializationContext): Promise<ILayoutConfiguration<IProjectEntity>>
}
export const PROJECT_MAIN_LAYOUT_SERVICE_TOKEN = new LazyInjectionToken<IProjectMainLayoutService>('project.main-layout-service');
