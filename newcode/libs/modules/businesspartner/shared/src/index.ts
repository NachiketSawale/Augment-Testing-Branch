/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { BusinesspartnerSharedModuleInfo } from './lib/model/businesspartner-shared-module-info.class';

export * from './lib/business-partner-shared.module';
export * from './lib/business-partner';

export * from './lib/lookup-services';
export * from './lib/model';

export { BusinesspartnerSharedCertificateLeafDataService } from './lib/certificate/services/base-certificate-leaf-data.service';
export { BusinesspartnerSharedCertificateNodeDataService } from './lib/certificate/services/base-certificate-node-data.service';

export * from './lib/lookup-services/business-partner-agreement-lookup.service';

export { SUB_ENTITY_DATA_SERVICE_TOKEN, ISubEntityGridDialog, ISubEntityGridDialogOptions } from './lib/sub-entity-dialog/model/sub-entity-dialog.interface';
export { BusinesspartnerSharedSubEntityDialogLeafDataService } from './lib/sub-entity-dialog/services/sub-entity-dialog-leaf-data.service';
export { BusinesspartnerSharedSubEntityDialogService } from './lib/sub-entity-dialog/services/sub-entity-dialog.service';
export { BusinesspartnerSharedCertificateToSubsidiaryDataService } from './lib/certificate/services/certficate-to-subsidiary-data.service';
export { BusinesspartnerSharedCertificateGridBehavior } from './lib/certificate/behaviors/certificate-behavior.service';
export * from './lib/evaluation/model/entity-info/evaluation-entity-info.service';
export { BusinesspartnerSharedEvaluationLayoutConfigurationService } from './lib/evaluation/services/evaluation-layout-configuration.service';
export { EvaluationBaseService } from './lib/evaluation/services/evaluation-base.service';
export { BusinesspartnerSharedEvaluationDataService } from './lib/evaluation/services/evaluation-data.service';
export { MODULE_INFO } from './lib/evaluation/model/entity-info/module-info.model';

export { BusinessPartnerEvaluationSchemaIconLookupService, IBusinessPartnerEvaluationSchemaIconData } from '@libs/businesspartner/interfaces';

export * from './lib/validation-services/business-partner-logical-validator.service';

export * from './lib/activity/services/activity-data-base.service';
export * from './lib/activity/services/activity-validation.service';
export * from './lib/model/entity-info/activity-entity-info.model';

export * from './lib/validation-services/business-partner-logical-validator-factory.service';
export * from './lib/business-partner/services/businesspartner-related-lookup-provider.service';
export * from './lib/wizards/invite-portal-bidders-via-mail.service';
export * from './lib/lookup-services/frm-portal-user-group-lookup.service';
export * from './lib/wizards/shared-reactivate-or-inactive-portal-user.service';

export function getModuleInfo(): IApplicationModuleInfo {
	return BusinesspartnerSharedModuleInfo.instance;
}

export * from './lib/wizards/business-partner-shared-portal-user-management.service';

export * from './lib/services';
