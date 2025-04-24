/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { BasicsProcurementStructureDataService } from '../../procurement-structure/basics-procurement-structure-data.service';
import { IPrcStructureEntity } from '@libs/basics/interfaces';

@Injectable({
    providedIn: 'root'
})
/**
 * Procurement Structure Disable Wizard Service.
 */
export class ProcurementStructureDisableWizardService extends BasicsSharedSimpleActionWizardService<IPrcStructureEntity> {

	private readonly procurementStructureDataService = inject(BasicsProcurementStructureDataService);

	public onStartDisableWizard(): void {
		const doneMsg = 'basics.procurementstructure.disableDone';
		const nothingToDoMsg = 'basics.procurementstructure.alreadyDisabled';
		const questionMsg = 'cloud.common.questionDisableSelection';
		const option: ISimpleActionOptions<IPrcStructureEntity> = {
			headerText: 'cloud.common.disableRecord',
			codeField: 'Code',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg,
			placeholder:'code'
		};

		this.startSimpleActionWizard(option);
	}

	public override getSelection(): IPrcStructureEntity[]{
		return this.procurementStructureDataService.getSelection();
	}

	public override filterToActionNeeded(selected: IPrcStructureEntity[]): IPrcStructureEntity[]{
		const filteredSelection: IPrcStructureEntity[] = [];
		// Filter out the selection needed
		selected.forEach(item => {
				if(item.IsLive){
					filteredSelection.push(item);
				}
		});
		return filteredSelection;
	}

	public override performAction(filtered: IPrcStructureEntity[]): void{
		filtered.forEach(item => {
			item.IsLive = false;
			this.procurementStructureDataService.setModified(item);
		});
	}

	public override postProcess(): void {
		//Todo: Check, if something is needed here
	}
}