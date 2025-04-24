/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ConstructionsystemSharedModuleInfo } from './lib/model/constructionsystem-shared-module-info.class';

export * from './lib/constructionsystem-shared.module';
export * from './lib/model/entities/cos-group-entity.interface';
export * from './lib/model/entities/cos-header-entity.interface';
export * from './lib/model/entities/cos-chg-option-2-header-entity.interface';
export * from './lib/model/entities/cos-template-entity.interface';
export * from './lib/service/layouts/construction-system-shared-header-layout.service';
export * from './lib/service/lookup/construction-system-shared-template-lookup.service';
export * from './lib/service/lookup/construction-system-shared-global-parameter-value-lookup.service';
export * from './lib/service/lookup/construction-system-shared-dimension-type-lookup.service';
export * from './lib/service/lookup/construction-system-shared-object-texture-lookup.service';
export * from './lib/service/construction-system-shared-global-parameter-group-data.service';
export * from './lib/service/aggregate-type.service';
export * from './lib/model/entities/cos-global-param-group-entity.interface';
export * from './lib/model/entities/cos-global-param-entity.interface';
export * from './lib/model/entities/cos-global-param-value-entity.interface';
export * from './lib/model/enum/parameter-data-types.enum';
export * from './lib/service/layouts/construction-system-shared-parameter-layout-helper.service';
export * from './lib/service/construction-system-shared-parameter-type-helper.service';
export * from './lib/model/entities/dimension-types.interface';
export * from './lib/model/entities/instance-header-entity.interface';
export * from './lib/model/entities/instance-entity.interface';
export * from './lib/model/entities/property-key-entity.interface';
export * from './lib/model/enum/property-value-type.enum';
export * from './lib/service/lookup/construction-system-shared-property-key-lookup.service';
export * from './lib/service/construction-system-shared-parameter-validation-helper.service';
export * from './lib/model/entities/cos-parameter-group-entity.interface';
export * from './lib/model/entities/cos-parameter-entity.interface';
export * from './lib/model/entities/cos-parameter-lookup-entity.interface';
export * from './lib/model/entities/cos-parameter-value-entity.interface';
export * from './lib/service/layouts/construction-system-shared-object-template-layout.service';
export * from './lib/model/entities/cos-object-template-entity-base.interface';
export * from './lib/service/lookup/construction-system-shared-boq-root-lookup.service';
export * from './lib/service/lookup/construction-system-shared-activity-schedule-lookup.service';
export * from './lib/model/entities/script-common-lookup-entity.interface';
export * from './lib/model/entities/cos-object-template-property-entity-base.interface';
export * from './lib/model/entities/instance-2-object-entity.interface';
export * from './lib/model/entities/instance-2-object-param-entity.interface';
export * from './lib/model/entities/cos-chg-option-2-ins-entity.interface';
export * from './lib/model/entities/cos-ins-object-template-entity.interface';
export * from './lib/model/entities/instance-parameter-entity.interface';
export * from './lib/model/entities/cos-ins-object-template-property-entity.interface';
export * from './lib/service/lookup/construction-system-shared-project-instance-header-lookup.service';
export * from './lib/model/entities/cos-template-entity.interface';
export * from './lib/model/entities/construction-system-common-translation-entity.interface';

/**
 * Returns the module info object for the constructionsystem shared module.
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
	return ConstructionsystemSharedModuleInfo.instance;
}
