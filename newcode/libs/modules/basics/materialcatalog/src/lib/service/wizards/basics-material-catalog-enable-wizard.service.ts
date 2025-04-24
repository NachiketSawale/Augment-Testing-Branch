/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, IMaterialCatalogEntity, ISimpleActionOptions } from '@libs/basics/shared';
import { BasicsMaterialCatalogDataService } from '../../material-catalog/basics-material-catalog-data.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialCatalogEnableWizardService extends BasicsSharedSimpleActionWizardService<IMaterialCatalogEntity> {
	private readonly basicsMaterialCatalogDataService = inject(BasicsMaterialCatalogDataService);

	public onStartEnableWizard(): void {
		const doneMsg = 'basics.materialcatalog.enableDone';
		const nothingToDoMsg = 'basics.materialcatalog.alreadyEnabled';
		const questionMsg = 'cloud.common.questionEnableSelection';
		const option: ISimpleActionOptions<IMaterialCatalogEntity> = {
			headerText: 'cloud.common.enableRecord',
			codeField: 'Code',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg,
			placeholder: 'code',
		};

		this.startSimpleActionWizard(option);
	}

	public override getSelection(): IMaterialCatalogEntity[] {
		return this.basicsMaterialCatalogDataService.getSelection();
	}

	public override filterToActionNeeded(selected: IMaterialCatalogEntity[]): IMaterialCatalogEntity[] {
		const filteredSelection: IMaterialCatalogEntity[] = [];
		// Filter out the selection needed
		selected.forEach((item) => {
			if (!item.IsLive) {
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}

	public override performAction(filtered: IMaterialCatalogEntity[]): void {
		filtered.forEach((item) => {
			item.IsLive = true;
			this.basicsMaterialCatalogDataService.setModified(item);
		});
	}

	public override postProcess(): void {
	}
}
