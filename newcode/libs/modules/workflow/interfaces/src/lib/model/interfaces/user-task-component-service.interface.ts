/*
 * Copyright(c) RIB Software GmbH
 */

import { Type } from '@angular/core';
import { LazyInjectionToken } from '@libs/platform/common';
import { IUserTaskComponent } from './user-task-component.interface';

/**
 * Interface to provide user-tasks component instance.
 */
export interface IUsertaskComponentService {
	getComponentByActionId: (name: string) => Type<IUserTaskComponent>
}

/**
 * Injection token to lazy load user-tasks mapping.
 */
export const USER_TASK_COMPONENT_SERVICE = new LazyInjectionToken<IUsertaskComponentService>('user-task-component-service');
