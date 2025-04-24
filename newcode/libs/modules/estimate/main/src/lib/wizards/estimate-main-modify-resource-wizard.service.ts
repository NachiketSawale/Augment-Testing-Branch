/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EstimateMainResourceService } from '../containers/resource/estimate-main-resource-data.service';
import { EstimateModifyResourceDialogService, ModifyResourceModuleEnum } from '@libs/estimate/shared';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainModifyResourceWizardService {

	private readonly resourceDataService = inject(EstimateMainResourceService);
	private readonly modifyDialogService = inject(EstimateModifyResourceDialogService);

	public openModifyResourceDialog(): void {
		const selectedResources = this.resourceDataService.getSelection();
		const selected = selectedResources && selectedResources.length > 0 ? selectedResources[0] : null;

		this.modifyDialogService.openDialog({
			SelectedResource: selected,
			ModuleType: ModifyResourceModuleEnum.Estimate
		});
	}
}