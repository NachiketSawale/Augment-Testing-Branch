/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementRfqHeaderMainDataService } from '../services/procurement-rfq-header-main-data.service';
import { ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { IEditorDialogResult, StandardDialogButtonId } from '@libs/ui/common';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { RfqHeaderEntityComplete } from '../model/entities/rfq-header-entity-complete.class';
import { ImportBusinessPartnerComponent } from '../components/import-business-partner/import-business-partner.component';

@Injectable({
	providedIn: 'root',
})

export class ImportBusinessPartnerWizardService extends ProcurementCommonWizardBaseService<IRfqHeaderEntity, RfqHeaderEntityComplete, IRfqHeaderEntity> {
	public constructor() {
		super({
			rootDataService: inject(ProcurementRfqHeaderMainDataService),
		});
	}

	protected override async showWizardDialog(): Promise<IEditorDialogResult<IRfqHeaderEntity> | undefined> {
		const selHeader = this.config.rootDataService.getSelectedEntity();
		if (selHeader) {
			return this.dialogService.show({
				width: '700px',
				headerText: 'procurement.rfq.importBp.title',
				resizeable: true,
				id: '2505c1fa36814b61af023b62a044b212',
				showCloseButton: true,
				bodyComponent: ImportBusinessPartnerComponent,
				buttons: [
					{
						id: StandardDialogButtonId.Ok,
						caption: { key: 'ui.common.dialog.okBtn' },
						fn(evt, info) {
							info.dialog.body.onOKBtnClicked();
							info.dialog.close();
						},
						isDisabled: (info) => info.dialog.body.okBtnDisabled(),
					},
					{ id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } },
				],
			});
		}
		return undefined;
	}
}
