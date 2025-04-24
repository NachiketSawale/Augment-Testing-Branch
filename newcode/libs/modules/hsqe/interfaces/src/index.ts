/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { HsqeInterfacesModuleInfo } from './lib/model/hsqe-interfaces-module-info.class';

export * from './lib/hsqe-interfaces.module';
export * from './lib/model/checklist/checklist-lookup-provider.interface';
export * from './lib/model/entities/hsq-check-list-entity.interface';
export * from './lib/model/entities/check-list-complete.class';
export * from './lib/model/entities/hsq-check-list-2-activity-entity.interface';
export * from './lib/model/entities/hsq-check-list-document-entity.interface';
export * from './lib/model/entities/hsq-check-list-2-location-entity.interface';
export * from './lib/model/checklisttemplate/checklist-template-lookup-provider.interface';
export * from './lib/model/entities/hsq-chk-list-template-entity.interface';
export * from './lib/model/entities/hsq-check-list-group-entity.interface';
export * from './lib/model/entities/check-list-group-complete.class';
export * from './lib/model/entities/hsq-check-list-2-form-entity.interface';
export * from './lib/model/entities/hsq-chk-list-template-2form-entity.interface';
export * from './lib/model/entities/check-list-template-complete.class';
export * from './lib/model/entities/checklist-template-request-entity.interface';
export * from './lib/model/checklisttemplate/checklist-template-header-provider.model';
export * from './lib/model/checklisttemplate/checklist-template-header-provider.interface';

/**
 * Returns the module info object for the hsqe interfaces module.
 *
 * This function implements the {@link IApplicationModule.getModuleInfo} method.
 * Do not remove it.
 * It may be called by generated code.
 *
 * @return The singleton instance of the module info object.
 *
 * @see {@link IApplicationModule.getModuleInfo}
 */
export function getModuleInfo(): IApplicationModuleInfo {
	return HsqeInterfacesModuleInfo.instance;
}
