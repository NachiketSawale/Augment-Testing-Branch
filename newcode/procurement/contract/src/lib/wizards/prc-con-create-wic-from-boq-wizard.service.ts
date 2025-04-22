/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
import { IDialogErrorInfo, IEditorDialogResult, StandardDialogButtonId } from '@libs/ui/common';
import { PrcConCreateWicFromBoqComponent } from '../components/prc-con-create-wic-from-boq/prc-con-create-wic-from-boq.component';

interface ICreateOrUpdateOptions {
	BoqItemFk?: number;
	BoqHeaderFk?: number;
	WicGroupFk?: number;
	ReferenceNo?: number;
	OutlineSpec?: number;
}

@Injectable({
	providedIn: 'root',
})
export class PrcConCreateWicFromBoqWizardService extends ProcurementCommonWizardBaseService<IConHeaderEntity, ContractComplete, ICreateOrUpdateOptions> {
	public constructor() {
		super({
			rootDataService: inject(ProcurementContractHeaderDataService),
		});
	}

	protected override async showWizardDialog(): Promise<IEditorDialogResult<ICreateOrUpdateOptions> | undefined> {
		const selHeader = this.config.rootDataService.getSelectedEntity();
		if (selHeader) {
			return this.dialogService.show({
				width: '700px',
				headerText: 'procurement.common.createWicFromBoqWizardTitle',
				resizeable: true,
				id: 'fd308c3dd8494cbabee281e8fa2d81c8',
				showCloseButton: true,
				bodyComponent: PrcConCreateWicFromBoqComponent,
				buttons: [
					{
						id: StandardDialogButtonId.Ok,
						caption: { key: 'ui.common.dialog.okBtn' },
						fn(evt, info) {
							info.dialog.body.onOKBtnClicked();
							return undefined;
						},
						isDisabled: (info) => info.dialog.body.okBtnDisabled(),
					},
					{ id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } },
				],
			});
		}

		return undefined;
	}

	protected override async onFinishWizard(opt: ICreateOrUpdateOptions): Promise<void> {
		try {
			this.wizardUtilService.showLoadingDialog('cloud.common.informationDialogHeader');
			const requestParam = {
				BoqItemFk: opt.BoqItemFk,
				BoqHeaderFk: opt.BoqHeaderFk,
				WicGroupFk: opt.WicGroupFk,
				ReferenceNo: opt.ReferenceNo,
				OutlineSpec: opt.OutlineSpec,
			};
			const responseData = await this.http.post('procurement/common/wizard/createorupdatewicfromboqofqtn', requestParam);
			if (responseData) {
				await this.messageBoxService.showMsgBox('procurement.pricecomparison.noBoqItemsOfSelectedQtn', 'cloud.common.informationDialogHeader', 'ico-info');
			}
		} catch (e) {
			await this.messageBoxService.showErrorDialog(e as unknown as IDialogErrorInfo);
		} finally {
			this.wizardUtilService.closeLoadingDialog();
		}
	}
}
