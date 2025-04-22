import { IApplicationModuleInfo } from '@libs/platform/common';
import { ContactModuleInfo } from './lib/model/contact-module-info.class';

export * from './lib/businesspartner-contact.module';
export * from './lib/model/wizards/wizard.class';
export * from './lib/services/contact-data.service';
export * from './lib/services/contact-document-project-data.service';
export function getModuleInfo(): IApplicationModuleInfo {
	return ContactModuleInfo.instance;
}