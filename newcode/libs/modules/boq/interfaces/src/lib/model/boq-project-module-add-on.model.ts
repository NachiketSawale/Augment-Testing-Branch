import { IBusinessModuleAddOn } from '@libs/ui/business-base';
import { LazyInjectionToken } from '@libs/platform/common';

export const BOQ_PROJECT_MODULE_ADD_ON_TOKEN = new LazyInjectionToken<IBusinessModuleAddOn>('boq.project.moduleAddOn');
