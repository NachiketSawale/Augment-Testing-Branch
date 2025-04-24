/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { ProcurementPackageHeaderDataService } from '../../services/package-header-data.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageDisableWizard extends BasicsSharedSimpleActionWizardService<IPrcPackageEntity>{
	/**
	 *  ProcurementPackageHeaderDataService
	 */
	private readonly ProcurementPackageHeaderDataService = inject(ProcurementPackageHeaderDataService);

	/**
	 * Disable wizard record for procurement package
	 */
	public onStartDisableWizard(): void {
		const doneMsg = 'procurement.package.disableDone';
		const nothingToDoMsg = 'procurement.package.alreadyDisabled';
		const questionMsg = 'cloud.common.questionDisableSelection';
		const option: ISimpleActionOptions<IPrcPackageEntity> = {
			headerText: 'cloud.common.disableRecord',
			codeField: 'Code',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg,
			placeholder:'code'
		};

		this.startSimpleActionWizard(option);
	}

	/**
	 * get Selected items
	 */
	public override getSelection(): IPrcPackageEntity[]{
		return this.ProcurementPackageHeaderDataService.getSelection();
	}

	/**
	 * Filter the selection to the items that need an action
	 * @param selected
	 */
	public override filterToActionNeeded(selected: IPrcPackageEntity[]): IPrcPackageEntity[]{
		const filteredSelection: IPrcPackageEntity[] = [];
		// Filter out the selection needed
		selected.forEach(item => {
			if(item.IsLive){
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}


	/**
	 * Perform the action on the filtered selection
	 * @param filtered
	 */
	public override performAction(filtered: IPrcPackageEntity[]): void{
		filtered.forEach(item => {
			item.IsLive = false;
			this.ProcurementPackageHeaderDataService.setModified(item);
		});
	}

	/**
	 * Post process the action
	 */
	public override postProcess(): void {
		//ToDo: Check, if something is needed here
	}
}