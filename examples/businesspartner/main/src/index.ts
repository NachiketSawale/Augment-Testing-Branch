import { IApplicationModuleInfo } from '@libs/platform/common';
import { BusinesspartnerMainModuleInfo } from './lib/model/businesspartner-main-module-info.class';

export * from './lib/businesspartner-main.module';

export * from './lib/model/wizards/wizard.class';

export * from './lib/services/businesspartner-data.service';
export * from './lib/services/businesspartner-contact-data.service';
export * from './lib/services/businesspartner-data.service';

export * from './lib/services/lookup-layout/businesspartner-lookup-column-generator.service';
export * from './lib/services/lookup-layout/contact-lookup-column-generator.service';
export * from './lib/services/lookup-layout/guarantor-lookup-column-generator.service';
export * from './lib/services/lookup-layout/subsidiary-lookup-column-generator.service';
export * from './lib/services/businesspartner-main-document-project-data.service';
export * from './lib/services/lazy-injections/businesspartner-data-provider.service';
export * from './lib/services/wizards/businesspartner-main-change-status-for-project-document.service';
export * from './lib/services/layouts/businesspartner-layout.service';
export * from './lib/services/helper/businesspartner-helper.service';
export * from './lib/services/lazy-injections/businesspartner-helper-service-provider.service';

export function getModuleInfo(): IApplicationModuleInfo {
    return BusinesspartnerMainModuleInfo.instance;
}
