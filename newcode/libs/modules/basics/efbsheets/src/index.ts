import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsEfbSheetsModuleInfo } from './lib/model/entities/basics-efbsheets-module-info.class';
export * from './lib/modules-basics-efbsheets.module';
export * from './lib/model/wizard.class';
export * from './lib/model/entities/basics-efbsheets-module-info.class';
export * from './lib/model/entities/basics-efbsheets-complete.interface';
export * from './lib/services/basics-efbsheets-crew-mix-main-layout.service';
export * from './lib/model/entities/basics-efbsheets-crew-mix-cost-code-complete.interface';
export * from './lib/model/entities/basics-efbsheets-crew-mix-af-complete.class';
export * from './lib/services/layout/basics-efbsheets-crew-mix-af-layout.service';
export * from './lib/services/basics-efbsheets-average-wage-data.service';
export * from './lib/services/basics-efbsheets-data.service';
export * from './lib/services/basics-efbsheets-common.service';
export * from './lib/services/layout/basics-efbsheest-crew-mix-average-wage-layout.service';
export * from './lib/services/basics-efb-sheets-copy-master-crew-mix.service';
export * from './lib/services/layout/basics-efbsheets-crew-mix-afsn-layout.service';
export function getModuleInfo(): IApplicationModuleInfo {
    return BasicsEfbSheetsModuleInfo.instance;
}   