import { Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { PpsProductionPlaceDataService } from '../pps-production-place-data.service';
import { PpsProductionPlaceEntity } from '@libs/productionplanning/shared';

@Injectable({
	providedIn: 'root',
})
export class PpsProductionPlaceEnableWizardService extends BasicsSharedSimpleActionWizardService<PpsProductionPlaceEntity> {
	public constructor(private readonly ppsProductionPlaceDataService: PpsProductionPlaceDataService) {
		super();
	}

	public onStartEnableWizard(): void {
		const option: ISimpleActionOptions<PpsProductionPlaceEntity> = {
			headerText: 'productionplanning.productionplace.wizard.enableTitle',
			codeField: 'Code',
			doneMsg: 'productionplanning.productionplace.wizard.enableDisableDone',
			nothingToDoMsg: 'productionplanning.productionplace.wizard.alreadyEnabled',
			questionMsg: 'cloud.common.questionEnableSelection',
		};
		this.startSimpleActionWizard(option);
	}

	public override filterToActionNeeded(selected: PpsProductionPlaceEntity[]): PpsProductionPlaceEntity[] {
		const filteredSelection: PpsProductionPlaceEntity[] = [];
		selected.forEach((item) => {
			if (!item.IsLive) {
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
			item.IsLive = true;
			this.ppsProductionPlaceDataService.setModified(item);
		});
	}

	public override postProcess(): void {
		this.ppsProductionPlaceDataService.refreshSelected();
	}
}
