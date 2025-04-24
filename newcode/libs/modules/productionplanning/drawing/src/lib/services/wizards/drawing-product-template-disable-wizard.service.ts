
import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';

import { DrawingProductTemplateDataService } from '../drawing-product-template-data.service';
import { IPpsProductTemplateEntityGenerated } from '@libs/productionplanning/shared';
import { DrawingDataService } from '../drawing-data.service';


@Injectable({
	providedIn: 'root'
})
export class DrawingProductTemplateDisableWizardService extends BasicsSharedSimpleActionWizardService<IPpsProductTemplateEntityGenerated> {

	private readonly ppsProductTemplateDataService = DrawingProductTemplateDataService.getInstance('6000ad4e0e934a23958349a0c3e24ba8', inject(DrawingDataService));

	public onStartDisableWizard(): void {
		const option: ISimpleActionOptions<IPpsProductTemplateEntityGenerated> = {
			headerText: 'cloud.common.enableRecord',
			codeField: 'Code',
			doneMsg: 'productionplanning.producttemplate.wizard.enableDisableProductDescDone',
			nothingToDoMsg: 'productionplanning.producttemplate.wizard.productDescAlreadyDisabled',
			questionMsg: 'cloud.common.questionDisableSelection'
		};
		this.startSimpleActionWizard(option);
	}

	public override filterToActionNeeded(selected: IPpsProductTemplateEntityGenerated[]): IPpsProductTemplateEntityGenerated[] {
		const filteredSelection: IPpsProductTemplateEntityGenerated[] = [];
		selected.forEach(item => {
			if (item.IsLive) {
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}

	public override getSelection(): IPpsProductTemplateEntityGenerated[] {
		return this.ppsProductTemplateDataService.getSelection();
	}

	public override performAction(filtered: IPpsProductTemplateEntityGenerated[]): void {
		filtered.forEach(item => {
			item.IsLive = false;
			this.ppsProductTemplateDataService.setModified(item);
		});
	}

	public override postProcess(): void {
	}

}