/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IProjectMainPrj2BusinessPartnerEntity } from '../entities/main';

/**
 * Project 2 Business Partner layout service
 */
export interface IProjectMainPrj2BPLayoutService {
	generateLayout(): ILayoutConfiguration<IProjectMainPrj2BusinessPartnerEntity>
}
export const PROJECT_MAIN_PRJ2BP_LAYOUT_SERVICE_TOKEN = new LazyInjectionToken<IProjectMainPrj2BPLayoutService>('project.main.prj2bp-layout-service');
