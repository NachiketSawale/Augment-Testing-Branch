import { IApplicationModuleInfo } from '@libs/platform/common';
import { QtoMainModuleInfo } from './lib/model/qto-main-module-info.class';

export * from './lib/modules-qto-main.module';
export { QtoMainWizardRebExportService } from './lib/wizards/qto-reb/qto-main-wizard-reb-export.service';
export { QtoMainWizardRebImportService } from './lib/wizards/qto-reb/qto-main-wizard-reb-import.service';

export { QtoMainRenumberQtoLinesWizard } from './lib/wizards/renumber-QTO-lines/qto-main-renumber-qto-lines-wizard.class';
export { QtoMainChangeStatusWizardService } from './lib/wizards/change-status/qto-main-change-status-wizard.service';
export { QtoMainDetailChangeStatusWizardService } from './lib/wizards/change-status/qto-main-detail-change-status-wizard.service';
export { QtoMainEnableDisableRecordWizardService } from './lib/wizards/qto-main-enable-disable-record-wizard.service';
export { QToMainCreateUpdateUpdatePesWizardService } from './lib/wizards/create-pes/qto-main-create-update-pes-wizard.service';

export { QtoMainUpdateAqWqToBoqWizardService } from './lib/wizards/qto-main-update-aq-wq-to-boq-wizard.service';

export function getModuleInfo(): IApplicationModuleInfo {
	return QtoMainModuleInfo.instance;
}
