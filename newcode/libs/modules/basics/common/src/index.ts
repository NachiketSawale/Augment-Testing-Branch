/*
 * Copyright(c) RIB Software GmbH
 */

import {IApplicationModuleInfo} from '@libs/platform/common';
import {BasicsCommonModuleInfo} from './lib/models/basics-common-module-info.class';

export * from './lib/basics-common.module';

export * from './lib/access-scope/index';

export function getModuleInfo(): IApplicationModuleInfo {
    return BasicsCommonModuleInfo.instance;
}

export * from './lib/services/basics-common-historical-price-for-item-data.service';
export * from './lib/services/basics-common-historical-price-for-item-layout.service';
export * from './lib/models/basics-common-historical-price-for-item-entity.interface';
export * from './lib/models/enum/item-type-for-historical-price.enum';
export * from './lib/models/interfaces/script-error.interface';
export * from './lib/models/interfaces/historical-price-for-item-parameter.interface';

export * from './lib/services/simple-upload.service';
