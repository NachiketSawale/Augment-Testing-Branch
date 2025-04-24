/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { ITimeSymbolEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingTimeSymbolsDataService } from '../timekeeping-time-symbols-data.service';

@Injectable({
	providedIn: 'root'
})
export class TimekeepingTimeSymbolDisableWizardService extends BasicsSharedSimpleActionWizardService<ITimeSymbolEntity>{

	private readonly timekeepingTimeSymbolsDataService = inject(TimekeepingTimeSymbolsDataService);


	public onStartDisableWizard(): void {
		const doneMsg = 'timekeeping.timesymbols.disableDone';
		const nothingToDoMsg = 'timekeeping.timesymbols.alreadyDisabled';
		const questionMsg = 'cloud.common.questionDisableSelection';
		const option: ISimpleActionOptions<ITimeSymbolEntity> = {
			headerText: 'cloud.common.disableRecord',
			codeField: 'Code',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg
		};

		this.startSimpleActionWizard(option);
	}


	public override getSelection(): ITimeSymbolEntity[]{
		return this.timekeepingTimeSymbolsDataService.getSelection();
	}

	public override filterToActionNeeded(selected: ITimeSymbolEntity[]): ITimeSymbolEntity[]{
		const filteredSelection: ITimeSymbolEntity[] = [];
		// Filter out the selection needed
		selected.forEach(item => {
			if(item.IsLive){
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}


	public override performAction(filtered: ITimeSymbolEntity[]): void{
		filtered.forEach(item => {
			item.IsLive = false;
			this.timekeepingTimeSymbolsDataService.setModified(item);
		});
	}


	public override postProcess(): void {
		this.timekeepingTimeSymbolsDataService.refreshAll();
	}
}