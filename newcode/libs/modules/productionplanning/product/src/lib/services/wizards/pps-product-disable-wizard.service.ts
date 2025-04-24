
import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';

import { IPpsProductEntity } from '../../model/models';
import { PpsProductDataService } from '../pps-product-data.service';


@Injectable({
	providedIn: 'root'
})
export class ProductionPlanningProductDisableWizardService extends BasicsSharedSimpleActionWizardService<IPpsProductEntity> {

	private readonly ppsProductDataService = inject(PpsProductDataService);

	public onStartDisableWizard(): void {
		const option: ISimpleActionOptions<IPpsProductEntity> = {
			headerText: 'cloud.common.enableRecord',
			codeField: 'Code',
			doneMsg: 'productionplanning.common.product.wizard.disableProductDone',
			nothingToDoMsg: 'productionplanning.common.product.wizard.productAlreadyDisabled',
			questionMsg: 'cloud.common.questionDisableSelection'
		};
		this.startSimpleActionWizard(option);
	}

	public override filterToActionNeeded(selected: IPpsProductEntity[]): IPpsProductEntity[] {
		const filteredSelection: IPpsProductEntity[] = [];
		selected.forEach(item => {
			if (item.IsLive) {
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}

	public override getSelection(): IPpsProductEntity[] {
		return this.ppsProductDataService.getSelection();
	}

	public override performAction(filtered: IPpsProductEntity[]): void {
		filtered.forEach(item => {
			item.IsLive = false;
			this.ppsProductDataService.setModified(item);
		});
	}

	public override postProcess(): void {
		this.ppsProductDataService.refreshSelected().then(

		);
	}

}