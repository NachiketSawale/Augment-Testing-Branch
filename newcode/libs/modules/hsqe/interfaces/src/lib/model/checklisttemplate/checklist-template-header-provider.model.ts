import { LazyInjectionToken } from '@libs/platform/common';
import { IChecklistTemplateHeaderDataProvider } from './checklist-template-header-provider.interface';
import { IHsqChkListTemplateEntity } from '../entities/hsq-chk-list-template-entity.interface';

export const CHECKLIST_TEMPLATE_HEADER_DATA_PROVIDER = new LazyInjectionToken<IChecklistTemplateHeaderDataProvider<IHsqChkListTemplateEntity>>('hsqe.checklist.template.header.dataservice');
