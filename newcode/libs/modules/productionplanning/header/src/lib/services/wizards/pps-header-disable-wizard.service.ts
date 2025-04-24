
import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';

import { IPpsHeaderEntity } from '@libs/productionplanning/shared';
import { PpsHeaderDataService } from '../pps-header-data.service';


@Injectable({
	providedIn: 'root'
})
export class PpsHeaderDisableWizardService extends BasicsSharedSimpleActionWizardService<IPpsHeaderEntity> {

	private readonly ppsHeaderDataService = inject(PpsHeaderDataService);

	public onStartDisableWizard(): void {
		const option: ISimpleActionOptions<IPpsHeaderEntity> = {
			headerText: 'cloud.common.enableRecord',
			codeField: 'Code',
			doneMsg: 'productionplanning.common.header.wizard.enableDisableHeaderDone',
			nothingToDoMsg: 'productionplanning.common.header.wizard.headerAlreadyDisabled',
			questionMsg: 'cloud.common.questionDisableSelection'
		};
		this.startSimpleActionWizard(option);
	}

	public override filterToActionNeeded(selected: IPpsHeaderEntity[]): IPpsHeaderEntity[] {
		const filteredSelection: IPpsHeaderEntity[] = [];
		selected.forEach(item => {
			if (item.IsLive) {
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}

	public override getSelection(): IPpsHeaderEntity[] {
		return this.ppsHeaderDataService.getSelection();
	}

	public override performAction(filtered: IPpsHeaderEntity[]): void {
		filtered.forEach(item => {
			item.IsLive = false;
			this.ppsHeaderDataService.setModified(item);
		});
	}

	public override postProcess(): void {
		this.ppsHeaderDataService.refreshSelected().then(

		);
	}

}