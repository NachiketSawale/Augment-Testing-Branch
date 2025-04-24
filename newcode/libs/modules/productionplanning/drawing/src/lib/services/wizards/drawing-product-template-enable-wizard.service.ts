import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { IPpsProductTemplateEntityGenerated } from '@libs/productionplanning/shared';
import { DrawingProductTemplateDataService } from '../drawing-product-template-data.service';
import { DrawingDataService } from '../drawing-data.service';

@Injectable({
	providedIn: 'root',
})
export class DrawingProductTempateEnableWizardService extends BasicsSharedSimpleActionWizardService<IPpsProductTemplateEntityGenerated> {

	private readonly ppsProductTemplateDataService = DrawingProductTemplateDataService.getInstance('6000ad4e0e934a23958349a0c3e24ba8', inject(DrawingDataService));

	public onStartEnableWizard(): void {
		const option: ISimpleActionOptions<IPpsProductTemplateEntityGenerated> = {
			headerText: 'cloud.common.enableRecord',
			codeField: 'Code',
			doneMsg: 'productionplanning.producttemplate.wizard.enableDisableProductDescDone',
			nothingToDoMsg: 'pproductionplanning.producttemplate.wizard.productDescAlreadyEnabled',
			questionMsg: 'cloud.common.questionEnableSelection'
		};
		this.startSimpleActionWizard(option);
	}

	public override filterToActionNeeded(selected: IPpsProductTemplateEntityGenerated[]): IPpsProductTemplateEntityGenerated[] {
		const filteredSelection: IPpsProductTemplateEntityGenerated[] = [];
		selected.forEach(item => {
			if (!item.IsLive) {
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
			item.IsLive = true;
			this.ppsProductTemplateDataService.setModified(item);
		});
	}

	public override postProcess(): void {
	}
}
