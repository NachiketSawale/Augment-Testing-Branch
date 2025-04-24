/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IProjectMainPrj2BPContactEntity } from '../entities/main';

/**
 * Project 2 Business Partner Contact layout service
 */
export interface IProjectMainPrj2BPContactLayoutService {
	generateLayout(): ILayoutConfiguration<IProjectMainPrj2BPContactEntity>
}
export const PROJECT_MAIN_PRJ2BPCONTACT_LAYOUT_SERVICE_TOKEN = new LazyInjectionToken<IProjectMainPrj2BPContactLayoutService>('project.main.prj2bpcontact-layout-service');
