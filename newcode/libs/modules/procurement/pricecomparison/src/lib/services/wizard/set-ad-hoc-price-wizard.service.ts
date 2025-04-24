/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { IEditorDialogResult, StandardDialogButtonId } from '@libs/ui/common';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { RfqHeaderEntityComplete } from '@libs/procurement/rfq';
import { ProcurementPricecomparisonRfqHeaderDataService } from '../rfq-header-data.service';
import {
	ProcurementPriceComparisonSetAdHocPriceComponent
} from '../../components/set-ad-hoc-price/set-ad-hoc-price.component';


@Injectable({
	providedIn: 'root',
})

export class SetAdHocPriceWizardService extends ProcurementCommonWizardBaseService<IRfqHeaderEntity, RfqHeaderEntityComplete, IRfqHeaderEntity> {
	public constructor() {
		super({
			rootDataService: inject(ProcurementPricecomparisonRfqHeaderDataService)
		});
	}

	protected override async showWizardDialog(): Promise<IEditorDialogResult<IRfqHeaderEntity> | undefined> {
		const selHeader = this.config.rootDataService.getSelectedEntity();
		if (selHeader) {
			return this.dialogService.show({
				width: '700px',
				headerText: 'procurement.pricecomparison.itemEvaluation.headerText',
				resizeable: true,
				id: '2505c1fa36814b61af023b62a044b212',
				showCloseButton: true,
				bodyComponent: ProcurementPriceComparisonSetAdHocPriceComponent,
				buttons: [
					{
						id: 'Next',
						caption: { key: 'basics.common.button.nextStep' },
						fn(evt, info) {
							info.dialog.body.onNextBtnClicked();
						},
						isVisible: (info) => {
							return info.dialog.body.modalOptions.step === 'step1';
						},
					},
					{
						id: 'Previous',
						caption: { key: 'basics.common.button.previousStep' },
						fn(evt, info) {
							info.dialog.body.onPreviousBtnClicked();
						},
						isVisible: (info) => {
							return info.dialog.body.modalOptions.step === 'step2';
						},
					},
					{
						id: StandardDialogButtonId.Ok,
						caption: { key: 'ui.common.dialog.okBtn' },
						fn(evt, info) {
							info.dialog.body.onOKBtnClicked();
							info.dialog.close();
						},
						isVisible: (info) => {
							return info.dialog.body.modalOptions.step === 'step2';
						},
					},
					{
						id: StandardDialogButtonId.Cancel,
						caption: { key: 'ui.common.dialog.cancelBtn' },
						fn(evt, info) {
							info.dialog.close();
						}
					},
				],
			});
		}
		return undefined;
	}
}
