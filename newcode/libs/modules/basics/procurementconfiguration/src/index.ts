import {IApplicationModuleInfo} from '@libs/platform/common';
import {BasicsProcurementconfigurationModuleInfo} from './lib/model/basics-procurementconfiguration-module-info.class';

export * from './lib/basics-procurementconfiguration.module';

export * from './lib/services/lookup-layout';

export function getModuleInfo(): IApplicationModuleInfo {
    return BasicsProcurementconfigurationModuleInfo.instance;
}


export * from './lib/model/entities/prc-total-type-entity.interface';
export * from './lib/model/entities/prc-config-header-entity.interface';
export * from './lib/model/entities/prc-configuration-entity.interface';