/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ItemType } from '@libs/ui/common';
import { PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedUserFormService, UserFormDisplayMode } from '@libs/basics/shared';
import { EntityContainerCommand, IEntityContainerBehavior, IFormContainerLink } from '@libs/ui/business-base';
import { ICosTestInputEntity, ICosScriptEntity } from '../model/models';
import { ConstructionSystemMasterScriptDataService } from '../services/construction-system-master-script-data.service';
import { ConstructionSystemMasterTestParameterInputDataService } from '../services/construction-system-master-test-parameter-input-data.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterTestInputBehaviorService implements IEntityContainerBehavior<IFormContainerLink<ICosTestInputEntity>, ICosTestInputEntity> {
	private readonly dataService = inject(ConstructionSystemMasterTestParameterInputDataService);
	private readonly cosScriptDataService = inject(ConstructionSystemMasterScriptDataService);
	private readonly http = inject(PlatformHttpService);

	public onCreate(containerLink: IFormContainerLink<ICosTestInputEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.First, EntityContainerCommand.Previous, EntityContainerCommand.Next, EntityContainerCommand.Last]);

		containerLink.uiAddOns.toolbar.addItems(
			[
				{
					id: 'execute',
					sort: 0,
					caption: { key: 'constructionsystem.master.taskBarExecute' },
					hideItem: false,
					iconClass: 'tlb-icons ico-instance-calculate',
					type: ItemType.Item,
					fn: this.dataService.execute,
					disabled: () => {
						return !this.dataService.getSelectedParent() || !this.dataService.canExecute;
					},
				},
				{
					id: 'updateParameter',
					sort: 1,
					caption: 'constructionsystem.master.taskBarUpdate',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-refresh',
					fn: this.refreshUI,
					disabled: false,
				},
				{
					id: 'edit',
					sort: 2,
					caption: 'constructionsystem.master.taskBarEdit',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-preview-data',
					fn: this.onEditForm,
					disabled: () => {
						const selectedParent = this.dataService.getSelectedParent();
						// Disable when no cosHeader selected while initializing
						// Disable when BasFormFk is null
						return !selectedParent?.BasFormFk;
					},
				},
			],
			EntityContainerCommand.RecordNavigationGroup,
		);

		this.dataService.listChanged$.subscribe(() => {
			this.refreshUI();
		});
		this.refreshUI();
	}

	private async onEditForm() {
		const selectedParent = this.dataService.getSelectedParent();
		if (selectedParent && selectedParent.BasFormFk) {
			const options = {
				formId: selectedParent.BasFormFk,
				formDataId: selectedParent.BasFormDataFk ?? undefined, // If BasFormDataFk is null, use undefined as the parameter.
				editable: true,
				isReadonly: false,
				modal: true,
				displayMode: UserFormDisplayMode.Window,
			};

			const userFormService = ServiceLocator.injector.get(BasicsSharedUserFormService);
			const value = await userFormService.show(options);
			value.registerFormSaved((data) => {
				if (data.FormDataId) {
					this.onFormSaved(data.FormDataId);
				}
			});
		}
	}

	private async onFormSaved(basFormDataId: number) {
		const selectedParent = this.dataService.getSelectedParent();
		if (!selectedParent) {
			return;
		}

		// todo: remove the server side validation for parameters input by user form temporarily, defect 75218
		if (!selectedParent.BasFormDataFk) {
			selectedParent.BasFormDataFk = basFormDataId;
		}

		const request = {
			CosHeaderId: selectedParent.Id,
			FormDataId: basFormDataId,
		};
		await this.http.post('constructionsystem/master/testinput/updatebyformdata', request);
		// reload data from server
		const response = await this.http.post<ICosScriptEntity[]>('constructionsystem/master/script/listorcreate', {
			mainItemId: selectedParent.Id,
		});
		if (response && response.length > 0) {
			this.cosScriptDataService.currentItem = response[0];
		}
		const reloadedParent = this.dataService.getSelectedParent();
		if (reloadedParent) {
			await this.dataService.load({ id: reloadedParent.Id });
			await this.dataService.execute();
		}
	}

	// todo-allen:
	//  The refreshUI function is used to dynamically add columns to the form container based on the selected parent entity.
	//  How can dynamic columns be implemented?
	private refreshUI() {
		// $timeout(function () {
		// 	$scope.currentItem = constructionSystemMasterTestDataService.getCurrentEntity();
		// 	constructionSystemMasterTestInputUIStandardHelperService.GenerateNewUIStandard(constructionSystemMasterTestDataService.getParameterGroups() || [],
		// 		constructionSystemMasterTestDataService.getParameterList() || []);
		// 	$scope.$broadcast('form-config-updated');
		// }, 0);
	}
}
