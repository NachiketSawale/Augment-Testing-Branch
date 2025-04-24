/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ConstructionsystemCommonModuleInfo } from './lib/model/constructionsystem-common-module-info.class';

export * from './lib/constructionsystem-common.module';
export * from './lib/service/filter-construct/services/filter-structure-data-service-manager.service';
export * from './lib/service/filter-construct/model/filter-structure-entity-info-factory';
export * from './lib/model/entities/construction-system-common-script-error-entity.interface';
export * from './lib/components/filter-editor/filter-editor.component';
export * from './lib/service/layouts/construction-system-common-output-layout.service';
export * from './lib/service/lookup/construction-system-master-parameter-lookup.service';
export * from './lib/service/layouts/construction-system-common-instance2-object-param-layout.service';
export * from './lib/service/construction-system-common-output-data.service';
export * from './lib/behaviors/construction-system-common-output-behavior.service';
export * from './lib/components/selection-statement/main-filter/main-filter.component';
export * from './lib/model/entities/selection-statement/option.interface';
export * from './lib/service/selection-statement/construction-system-common-selection-statement-container-factory.service';
export * from './lib/service/lookup/constuction-system-common-property-name-lookup.service';
export * from './lib/components/quantity-query-editor/quantity-query-editor.component';
export * from './lib/service/quantity-query-editor/quantity-query-editor.service';
export * from './lib/model/enums/quantity-query-editor/type-flag.enum';
export * from './lib/model/enums/cos-default-type.enum';

/**
 * Returns the module info object for the constructionsystem common module.
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
	return ConstructionsystemCommonModuleInfo.instance;
}
