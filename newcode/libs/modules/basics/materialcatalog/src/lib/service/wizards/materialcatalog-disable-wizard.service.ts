/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, IMaterialCatalogEntity, ISimpleActionOptions } from '@libs/basics/shared';
import { BasicsMaterialCatalogDataService } from '../../material-catalog/basics-material-catalog-data.service';

@Injectable({
	providedIn: 'root',
})
export class MaterialCatalogDisableWizard extends BasicsSharedSimpleActionWizardService<IMaterialCatalogEntity> {
	/**
	 *  BasicsMaterialCatalogDataService
	 */
	private readonly BasicsMaterialCatalogDataService = inject(BasicsMaterialCatalogDataService);

	/**
	 * Disable wizard record for material catalog
	 */
	public onStartDisableWizard(): void {
		const doneMsg = 'basics.materialcatalog.disableDone';
		const nothingToDoMsg = 'basics.materialcatalog.alreadyDisabled';
		const questionMsg = 'cloud.common.questionDisableSelection';
		const option: ISimpleActionOptions<IMaterialCatalogEntity> = {
			headerText: 'cloud.common.disableRecord',
			codeField: 'Code',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg,
			placeholder: 'code',
		};

		this.startSimpleActionWizard(option);
	}

	/**
	 * get Selected items
	 */
	public override getSelection(): IMaterialCatalogEntity[] {
		return this.BasicsMaterialCatalogDataService.getSelection();
	}

	/**
	 * Filter the selection to the items that need an action
	 * @param selected
	 */
	public override filterToActionNeeded(selected: IMaterialCatalogEntity[]): IMaterialCatalogEntity[] {
		const filteredSelection: IMaterialCatalogEntity[] = [];
		// Filter out the selection needed
		selected.forEach((item) => {
			if (item.IsLive) {
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}

	/**
	 * Perform the action on the filtered selection
	 * @param filtered
	 */
	public override performAction(filtered: IMaterialCatalogEntity[]): void {
		filtered.forEach((item) => {
			item.IsLive = false;
			this.BasicsMaterialCatalogDataService.setModified(item);
		});
	}

	/**
	 * Post process the action
	 */
	public override postProcess(): void {

	}
}
