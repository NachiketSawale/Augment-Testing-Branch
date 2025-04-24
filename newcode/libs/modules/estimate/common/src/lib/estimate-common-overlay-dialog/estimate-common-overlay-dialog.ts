/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';

export class EstimateCommonOverlayDialog {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly translateService = inject(PlatformTranslateService);
	public headerText: string;

	public constructor(headerText: string /*private platformCreateUuid: PlatformCreateUuid*/) {
		this.translateService.load(['estimate.common']).then();
		this.headerText = headerText;
		this.showDialog();
	}

	// TODO : Replace platformCreateUuid function with PlatformCreateUuid implementation
	public platformCreateUuid: string = ''; // workaround
	public uniqId: string = this.platformCreateUuid;
	public viewDeleting = true;
	public displayTextMessage = `${this.translateService.instant('estimate.common.paramDeleteOverlayDialogInfo').text}`;

	public getContainerUUID() {
		return this.uniqId;
	}

	// TODO - With this overlay we need to display a loader when viewDeleting is set to true, on close it should hide the loader
	// public modalOptions = {
	// 	close : () => {
	// 		this.close();
	// 	}
	// };

	// public close(){
	// 	this.viewDeleting = false;
	// }

	public async showDialog() {
		return await this.messageBoxService.showMsgBox(this.displayTextMessage, this.headerText, 'ico-info', 'message', false);
	}

	// TODO
	// estParamComplexLookupService.onCloseOverlayDialog.register(close);
	// estParamInputLookupService.onCloseOverlayDialog.register(close);

	// public ngOnDestroy() {
	// 	// TODO
	// 	// estParamComplexLookupService.onCloseOverlayDialog.unregister(close);
	// 	// estParamInputLookupService.onCloseOverlayDialog.unregister(close);
	// }
}
