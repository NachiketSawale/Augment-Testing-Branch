/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ModelAdministrationModuleInfo } from './lib/model/model-administration-module-info.class';
export * from './lib/model-administration.module';

export * from './lib/property-keys/services/property-key-tag-helper.service';
export * from './lib/property-keys/services/property-key-lookup-provider.service';

export * from './lib/model-import';

export function getModuleInfo(): IApplicationModuleInfo {
    return ModelAdministrationModuleInfo.instance;
}