/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { TimekeepingRecordingWizardService } from '../../services/wizards/timekeeping-recording-wizard.service';
import { TimekeepingRecordingReportStatusWizardService } from '../../services/wizards/timekeeping-recording-report-status-wizard.service';
import { TimekeepingRecordingSheetStatusWizardService } from '../../services/wizards/timekeeping-recording-sheet-status-wizard.service';
import { TimekeepingRecordingResultStatusWizardService } from '../../services/wizards/timekeeping-recording-result-status-wizard.service';
import { TimekeepingRecordingReportEnableWizardService } from '../../services/wizards/timekeeping-recording-report-enable-wizard.service';
import { TimekeepingRecordingReportDisableWizardService } from '../../services/wizards/timekeeping-recording-report-disable-wizard.service';
import { TimekeepingRecordingUnlockTransactionWizardService } from '../../services/wizards/timekeeping-recording-unlock-transaction-wizard.service';
import { TimekeepingRecordingDerivationsWizardService } from '../../services/wizards/timekeeping-recording-derivations-wizard.service';
import { TimekeepingRecordingCalculateOvertimeWizard } from '../../services/wizards/timekeeping-recording-calculate-overtime-wizard.service';
export class TimekeepingRecordingWizardClass {

	public setRecordingStatus(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingRecordingWizardService);
		service.onStartChangeStatusWizard();
	}
	public setReportStatus(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingRecordingReportStatusWizardService);
		service.onStartChangeStatusWizard();
	}
	public setSheetStatus(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingRecordingSheetStatusWizardService);
		service.onStartChangeStatusWizard();
	}
	public setResultStatus(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingRecordingResultStatusWizardService);
		service.onStartChangeStatusWizard();
	}

	public enableReports(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingRecordingReportEnableWizardService);
		service.onStartEnableWizard();
	}

	public disableReports(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingRecordingReportDisableWizardService);
		service.onStartDisableWizard();
	}
	public unlockUsedForTransaction(context: IInitializationContext) {
		 const service = context.injector.get(TimekeepingRecordingUnlockTransactionWizardService);
		 service.unlockUsedForTransaction();
	}
	public calculateOtherDerivations(context: IInitializationContext) {
		 const service = context.injector.get(TimekeepingRecordingDerivationsWizardService);
		 service.calculateOtherDerivations();
	}
	public calculateOvertime(context: IInitializationContext) {
		 const service = context.injector.get(TimekeepingRecordingCalculateOvertimeWizard);
		 service.calculateOvertime();
	}



}