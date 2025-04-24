/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';

export interface ITaskSidebarTabService {

	getEntityIdListForActionInstances(): number[] | undefined

}

export const TASK_SIDEBAR_TAB_SERVICE = new LazyInjectionToken<ITaskSidebarTabService>('sidebar-tab-service');
