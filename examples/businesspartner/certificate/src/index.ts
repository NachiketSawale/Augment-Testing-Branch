import { IApplicationModuleInfo } from '@libs/platform/common';
import { BusinesspartnerCertificateModuleInfo } from './lib/model/businesspartner-certificate-module-info.class';

export * from './lib/businesspartner-certificate.module';
export * from './lib/model/wizards/wizard.class';
export { BP_CERTIFICATE_LAYOUT } from './lib/model/entity-info/certificate-layout.model';
export * from './lib/model/wizards/wizard.class';
export * from './lib/services/certificate-document-project-data.service';
export * from './lib/services/wizards/change-certificate-status.service';
export * from './lib/services/wizards/change-certificate-status-wizard.service';
export * from './lib/services/wizards/create-requests.service';
export * from './lib/services/layout/business-partner-certificate-layout.service';
export function getModuleInfo(): IApplicationModuleInfo {
    return BusinesspartnerCertificateModuleInfo.instance;
}