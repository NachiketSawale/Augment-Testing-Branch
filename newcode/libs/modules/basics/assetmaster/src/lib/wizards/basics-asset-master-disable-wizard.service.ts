/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { IAssetMasterEntity } from '@libs/basics/interfaces';
import { BasicsAssetMasterGridDataService } from '../services/basics-asset-master-grid-data.service';

/**
 * Basics Asset Master Disable Wizard Service.
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsAssetMasterDisableWizard extends BasicsSharedSimpleActionWizardService<IAssetMasterEntity> {
	/**
	 *  Basics Asset Master Data Service
	 */
	private readonly basicsAssetMasterDataService = inject(BasicsAssetMasterGridDataService);

	/**
	 * Disable wizard record for basics asset master
	 */
	public onStartDisableWizard(): void {
		const doneMsg = 'basics.assetmaster.disableDone';
		const nothingToDoMsg = 'basics.assetmaster.alreadyDisabled';
		const questionMsg = 'cloud.common.questionDisableSelection';
		const option: ISimpleActionOptions<IAssetMasterEntity> = {
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
	public override performAction(filtered: IAssetMasterEntity[]): void {
		filtered.forEach((item) => {
			item.IsLive = false;
			this.basicsAssetMasterDataService.setModified(item);
		});
	}

	/**
	 * Post process the action
	 */
	public override postProcess(): void {
			//ToDo: Check, if something is needed here
	}
}
