/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { IBusinessModuleAddOn } from '@libs/ui/business-base';

export const MODEL_PROJECT_MODULE_ADD_ON_TOKEN = new LazyInjectionToken<IBusinessModuleAddOn>('model.project.moduleAddOn');
