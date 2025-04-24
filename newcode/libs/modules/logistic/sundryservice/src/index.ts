import { IApplicationModuleInfo } from '@libs/platform/common';
import { LogisticSundryServiceModuleInfo } from './lib/model/logistic-sundryservice-module-info.class';

export { LogisticSundryServiceDataService } from './lib/services/logistic-sundry-service-data.service';
export * from './lib/logistic-sundry-service.module';


export function getModuleInfo(): IApplicationModuleInfo {
    return LogisticSundryServiceModuleInfo.instance;
}