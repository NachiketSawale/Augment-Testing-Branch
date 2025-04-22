/*
 * Copyright(c) RIB Software GmbH
 */

import { getCustomDialogDataToken, StandardDialogButtonId, UiCommonModule } from '@libs/ui/common';
import { Component, inject } from '@angular/core';
import { PlatformCommonModule } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';
import { IPrcContractCreatePesOption, PRC_CONTRACT_CREATE_PES_OPTIONS } from '../../../model/interfaces/wizards/prc-contract-create-pes-wizard.interface';
import { NgIf } from '@angular/common';

@Component({
	selector: 'procurement-contract-create-pes-cover-confirm-page',
	templateUrl: './cover-confirm-page.component.html',
	imports: [
		UiCommonModule,
		PlatformCommonModule,
		FormsModule,
		NgIf
	],
	standalone: true
})
export class PrcConCreatePesCoverConfirmComponent {
	public createPesOption: IPrcContractCreatePesOption = inject(PRC_CONTRACT_CREATE_PES_OPTIONS);
	private readonly dialogWrapper = inject(getCustomDialogDataToken<IPrcContractCreatePesOption, PrcConCreatePesCoverConfirmComponent>());

	public onYesBtnClicked() {
		this.updateDialogWrapper(this.createPesOption?.isIncluded || false);
	}

	public updateDialogWrapper(isIncluded: boolean) {
		this.dialogWrapper.value = {
			mainItemId: this.createPesOption.mainItemId,
			isIncluded: isIncluded
		};
		this.dialogWrapper.close(StandardDialogButtonId.Ok);
	}


}