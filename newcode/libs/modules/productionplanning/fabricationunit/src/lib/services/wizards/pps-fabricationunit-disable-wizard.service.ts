
import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { IPpsFabricationUnitEntity } from '../../model/models';
import { PpsFabricationunitDataService } from '../pps-fabricationunit-data.service';

@Injectable({
	providedIn: 'root'
})
export class ProductionPlanningFabricationUnitDisableWizardService extends BasicsSharedSimpleActionWizardService<IPpsFabricationUnitEntity> {

	private readonly fabricationUnitDataService = inject(PpsFabricationunitDataService);

	public onStartDisableWizard(): void {
		const option: ISimpleActionOptions<IPpsFabricationUnitEntity> = {
			headerText: 'cloud.common.enableRecord',
			codeField: 'Code',
			doneMsg: 'productionplanning.fabricationunit.wizard.enableDisableFabricationUnitDone',
			nothingToDoMsg: 'productionplanning.fabricationunit.wizard.fabricationUnitAlreadyDisabled',
			questionMsg: 'cloud.common.questionDisableSelection'
		};
		this.startSimpleActionWizard(option);
	}

	public override filterToActionNeeded(selected: IPpsFabricationUnitEntity[]): IPpsFabricationUnitEntity[] {
		const filteredSelection: IPpsFabricationUnitEntity[] = [];
		selected.forEach(item => {
			if (item.IsLive) {
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
			item.IsLive = false;
			this.fabricationUnitDataService.setModified(item);
		});
	}

	public override postProcess(): void {
		this.fabricationUnitDataService.refreshSelected().then(

		);
	}

}