/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { IBusinessModuleAddOn } from '@libs/ui/business-base';

export const ESTIMATE_PROJECT_MODULE_ADD_ON_TOKEN = new LazyInjectionToken<IBusinessModuleAddOn>('estimate.project.moduleAddOn');
