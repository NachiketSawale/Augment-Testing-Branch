/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EstimateModifyResourceDialogService, ModifyResourceModuleEnum } from '@libs/estimate/shared';
import { EstimateAssembliesResourceDataService } from '../containers/resource/estimate-assemblies-resource-data.service';

@Injectable({
	providedIn: 'root'
})
export class EstimateAssemblyModifyResourceWizardService {

	private readonly resourceDataService = inject(EstimateAssembliesResourceDataService);
	private readonly modifyDialogService = inject(EstimateModifyResourceDialogService);

	public openModifyResourceDialog(): void {
		const selectedResources = this.resourceDataService.getSelection();
		const selected = selectedResources && selectedResources.length > 0 ? selectedResources[0] : null;

		this.modifyDialogService.openDialog({
			SelectedResource: selected,
			ModuleType: ModifyResourceModuleEnum.Assembly
		});
	}
}