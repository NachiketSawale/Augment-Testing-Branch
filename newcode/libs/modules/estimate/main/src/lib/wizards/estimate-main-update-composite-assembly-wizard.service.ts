/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IYesNoDialogOptions, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { EstimateMainService } from '../containers/line-item/estimate-main-line-item-data.service';
import { EstimateMainContextService } from '@libs/estimate/shared';

@Injectable({ providedIn: 'root' })
export class EstimateMainUpdateCompositeAssemblyWizardService {
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly estimateMainService = inject(EstimateMainService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);

	/**
	 * show yes or no dialog
	 */
	public showDialog() {
		const modalOptions: IYesNoDialogOptions = {
			defaultButtonId: StandardDialogButtonId.Yes,
			id: 'YesNoModal',
			dontShowAgain: true,
			showCancelButton: true,
			headerText: 'estimate.main.estimate',
			bodyText: 'estimate.main.updateCompositeAssemblyFromMasterData',
		};
		this.messageBoxService.showYesNoDialog(modalOptions)?.then((result) => {
			if (result?.closingButtonId === 'yes') {
				const postData = {
					EstHeaderId: this.estimateMainContextService.getSelectedEstHeaderId(),
					ProjectId: this.estimateMainContextService.getSelectedProjectId(),
				};

				this.http.post(this.configService.webApiBaseUrl + 'estimate/main/lineitem/updatecompositeassembly', postData).subscribe((res) => {
					if (res) {
						this.estimateMainService.refreshAll();
					}
				});
			}
		});
	}
}
