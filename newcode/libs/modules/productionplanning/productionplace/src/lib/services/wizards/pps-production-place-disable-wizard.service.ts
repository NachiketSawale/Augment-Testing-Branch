import { Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { PpsProductionPlaceDataService } from '../pps-production-place-data.service';
import { PpsProductionPlaceEntity } from '@libs/productionplanning/shared';

@Injectable({
	providedIn: 'root',
})
export class PpsProductionPlaceDisableWizardService extends BasicsSharedSimpleActionWizardService<PpsProductionPlaceEntity> {
	public constructor(private readonly ppsProductionPlaceDataService: PpsProductionPlaceDataService) {
		super();
	}

	public onStartDisableWizard(): void {
		const option: ISimpleActionOptions<PpsProductionPlaceEntity> = {
			headerText: 'productionplanning.productionplace.wizard.disableTitle',
			codeField: 'Code',
			doneMsg: 'productionplanning.productionplace.wizard.enableDisableDone',
			nothingToDoMsg: 'productionplanning.productionplace.wizard.alreadyDisabled',
			questionMsg: 'cloud.common.questionDisableSelection',
		};
		this.startSimpleActionWizard(option);
	}

	public override filterToActionNeeded(selected: PpsProductionPlaceEntity[]): PpsProductionPlaceEntity[] {
		const filteredSelection: PpsProductionPlaceEntity[] = [];
		selected.forEach((item) => {
			if (item.IsLive) {
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}

	public override getSelection(): PpsProductionPlaceEntity[] {
		return this.ppsProductionPlaceDataService.getSelection();
	}

	public override performAction(filtered: PpsProductionPlaceEntity[]): void {
		filtered.forEach((item) => {
			item.IsLive = false;
			this.ppsProductionPlaceDataService.setModified(item);
		});
	}

	public override postProcess(): void {
		this.ppsProductionPlaceDataService.refreshSelected();
	}
}
