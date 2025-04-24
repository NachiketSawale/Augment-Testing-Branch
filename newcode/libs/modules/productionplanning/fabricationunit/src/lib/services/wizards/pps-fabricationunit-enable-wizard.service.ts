import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';

import { IPpsFabricationUnitEntity } from '../../model/models';
import { PpsFabricationunitDataService } from '../pps-fabricationunit-data.service';

@Injectable({
	providedIn: 'root'
})
export class ProductionPlanningFabricationUnitEnableWizardService extends BasicsSharedSimpleActionWizardService<IPpsFabricationUnitEntity> {

	private readonly fabricationUnitDataService = inject(PpsFabricationunitDataService);

	public onStartEnableWizard(): void {
		const option: ISimpleActionOptions<IPpsFabricationUnitEntity> = {
			headerText: 'cloud.common.enableRecord',
			codeField: 'Code',
			doneMsg: 'productionplanning.fabricationunit.wizard.enableDisableFabricationUnitDone',
			nothingToDoMsg: 'productionplanning.fabricationunit.wizard.fabricationUnitAlreadyEnabled',
			questionMsg: 'cloud.common.questionEnableSelection'
		};
		this.startSimpleActionWizard(option);
	}

	public override filterToActionNeeded(selected: IPpsFabricationUnitEntity[]): IPpsFabricationUnitEntity[] {
		const filteredSelection: IPpsFabricationUnitEntity[] = [];
		selected.forEach(item => {
			if (!item.IsLive) {
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}

	public override getSelection(): IPpsFabricationUnitEntity[] {
		return this.fabricationUnitDataService.getSelection();
	}

	public override performAction(filtered: IPpsFabricationUnitEntity[]): void {
		filtered.forEach(item => {
			item.IsLive = true;
			this.fabricationUnitDataService.setModified(item);
		});
	}

	public override postProcess(): void {
		this.fabricationUnitDataService.refreshSelected().then(

		);
	}

}