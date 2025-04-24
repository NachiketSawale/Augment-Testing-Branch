/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ProcurementCommonWizardBaseService } from './procurement-common-wizard-base.service';
import { IEditorDialogResult, StandardDialogButtonId } from '@libs/ui/common';
import { ProcurementCommonMaintainPaymentScheduleVersionComponent } from '../../components/maintain-payment-schedule-version/maintain-payment-schedule-version.component';
import { firstValueFrom, forkJoin } from 'rxjs';
import { IPrcCommonReadonlyService, IPrcHeaderDataService } from '../../model/interfaces';
import { DataServiceFlatRoot, DataServiceHierarchicalRoot } from '@libs/platform/data-access';
import { IProcurementCommonWizardConfig } from '../../model/interfaces/procurement-common-wizard-config.interface';
import { IProcurementCommonMainPaymentScheduleVersion, IProcurementCommonMaintainPaymentScheduleVersionResult, MAIN_PAYMENT_SCHEDULE_DIALOG_OPTIONS } from '../../model/interfaces/wizard/prc-common-maintain-payment-shedule-wizard.interface';


interface IProcurementCommonMaintainPaymentScheduleVersionWizardConfig<T extends IEntityIdentification, U extends CompleteIdentification<T>> extends IProcurementCommonWizardConfig<T, U> {
	rootDataService: IPrcHeaderDataService<T, U> & IPrcCommonReadonlyService<T> & (DataServiceHierarchicalRoot<T, U> | DataServiceFlatRoot<T, U>);
}

export class ProcurementCommonMaintainPaymentScheduleVersionWizardService<T extends IEntityIdentification, U extends CompleteIdentification<T>>
	extends ProcurementCommonWizardBaseService<T, U,IProcurementCommonMaintainPaymentScheduleVersionResult> {
	public constructor(protected override readonly config: IProcurementCommonMaintainPaymentScheduleVersionWizardConfig<T, U>) {
		super(config);
	}

	protected getHeaderContext() {
		return this.config.rootDataService.getHeaderContext();
	}

	protected override async showWizardDialog(): Promise<IEditorDialogResult<IProcurementCommonMaintainPaymentScheduleVersionResult> | undefined> {
		const selHeader = this.config.rootDataService.getSelectedEntity();
		const header = this.getHeaderContext();
		if (selHeader) {
			const resp = await this.getPaymentScheduleVersion();
			return this.dialogService.show({
				width: '800px',
				headerText: 'procurement.common.wizard.maintainPaymentScheduleVersion',
				resizeable: true,
				showCloseButton: true,
				bodyComponent: ProcurementCommonMaintainPaymentScheduleVersionComponent,
				bodyProviders: [{
					provide: MAIN_PAYMENT_SCHEDULE_DIALOG_OPTIONS, useValue: {
						paymentScheduleVersions: resp,
						mainItemId: header.prcHeaderFk
					}
				}],
				customButtons: [
					{
						id: 'delete',
						caption: {key: 'procurement.common.wizard.deleteHighlightedVersion'},
						fn(evt, info) {
							info.dialog.body.delete();
							return undefined;
						},
						isDisabled: info => !info.dialog.body.gridSelected
					},
				],
				buttons: [
					{
						id: 'restore',
						caption: {key: 'procurement.common.wizard.restroeFromVersion'},
						fn(evt, info) {
							info.dialog.body.restore();
							return undefined;
						},
						isDisabled: info => !info.dialog.body.gridSelected
					},
					{
						id: StandardDialogButtonId.Ok,
						caption: {key: 'ui.common.dialog.okBtn'},
						fn(evt, info) {
							info.dialog.body.ok();
							return undefined;
						}
					},
					{id: StandardDialogButtonId.Cancel, caption: {key: 'ui.common.dialog.cancelBtn'}},
				]
			});
		}
		return undefined;
	}

	public async getPaymentScheduleVersion() {
		const header = this.getHeaderContext();
		const resp = await this.http.get('procurement/common/prcpaymentschedule/paymentscheduleversion', {
				params: {MainItemId: header.prcHeaderFk},
			});
		return resp as IProcurementCommonMainPaymentScheduleVersion[];
	}

	protected override async doExecuteWizard(dialogResult: IProcurementCommonMaintainPaymentScheduleVersionResult) {
		const responses = await firstValueFrom(forkJoin([
			this.http.post$('procurement/common/prcpaymentschedule/savepaymentscheduleversion', dialogResult.createItems),
			this.http.post$('procurement/common/prcpaymentschedule/deletepaymentscheduleversion', {
				MainItemId: dialogResult.mainItemId,
				VersionInfos: dialogResult.versionInfos
			})]));
		if (responses) {
			//todo reload payment schedule container
			//paymentScheduleService.load();
		}
		return true;
	}

}