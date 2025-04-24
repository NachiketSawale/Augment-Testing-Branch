/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { BasicsAssetMasterGridDataService } from '../services/basics-asset-master-grid-data.service';
import { IAssetMasterEntity } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root',
})
/**
 * Basics Asset Master Enable Wizard Service.
 */
export class BasicsAssetMasterEnableWizard extends BasicsSharedSimpleActionWizardService<IAssetMasterEntity> {
	/**
	 *  Basics Asset Master Grid Data Service
	 */
	private readonly basicsAssetMasterDataService = inject(BasicsAssetMasterGridDataService);

	/**
	 * Enable wizard record for Basics Asset Master
	 */
	public onStartEnableWizard(): void {
		const doneMsg = 'basics.assetmaster.enableDone';
		const nothingToDoMsg = 'basics.assetmaster.alreadyEnabled';
		const questionMsg = 'cloud.common.questionEnableSelection';
		const option: ISimpleActionOptions<IAssetMasterEntity> = {
			headerText: 'cloud.common.enableRecord',
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
	public override getSelection(): IAssetMasterEntity[] {
		return this.basicsAssetMasterDataService.getSelection();
	}

	/**
	 * Filter the selection to the items that need an action
	 * @param selected
	 */
	public override filterToActionNeeded(selected: IAssetMasterEntity[]): IAssetMasterEntity[] {
		const filteredSelection: IAssetMasterEntity[] = [];
		// Filter out the selection needed
		selected.forEach((item) => {
			if (!item.IsLive) {
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}

	/**
	 * Perform the action on the filtered selection
	 * @param filtered
	 */
	public override performAction(filtered: IAssetMasterEntity[]): void {
		filtered.forEach((item) => {
			item.IsLive = true;
			this.basicsAssetMasterDataService.setModified(item);
		});
	}

	/**
	 * Post process the action
	 */
	public override postProcess(): void {
		this.basicsAssetMasterDataService
			.refreshSelected()
			.then
			//Todo: Check, if something is needed here
			();
	}
}
