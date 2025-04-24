import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';

import { IPpsProductTemplateEntity } from '../../model/models';
import { PpsProductTemplateDataService } from '../pps-product-template-data.service';


@Injectable({
	providedIn: 'root'
})
export class PpsProductTemplateEnableWizardService extends BasicsSharedSimpleActionWizardService<IPpsProductTemplateEntity> {

	private readonly ppsProductTemplateDataService = inject(PpsProductTemplateDataService);

	public onStartEnableWizard(): void {
		const option: ISimpleActionOptions<IPpsProductTemplateEntity> = {
			headerText: 'cloud.common.enableRecord',
			codeField: 'Code',
			doneMsg: 'productionplanning.producttemplate.wizard.enableDisableProductDescDone',
			nothingToDoMsg: 'pproductionplanning.producttemplate.wizard.productDescAlreadyEnabled',
			questionMsg: 'cloud.common.questionEnableSelection'
		};
		this.startSimpleActionWizard(option);
	}

	public override filterToActionNeeded(selected: IPpsProductTemplateEntity[]): IPpsProductTemplateEntity[] {
		const filteredSelection: IPpsProductTemplateEntity[] = [];
		selected.forEach(item => {
			if (!item.IsLive) {
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}

	public override getSelection(): IPpsProductTemplateEntity[] {
		return this.ppsProductTemplateDataService.getSelection();
	}

	public override performAction(filtered: IPpsProductTemplateEntity[]): void {
		filtered.forEach(item => {
			item.IsLive = true;
			this.ppsProductTemplateDataService.setModified(item);
		});
	}

	public override postProcess(): void {
		this.ppsProductTemplateDataService.refreshSelected().then(

		);
	}

}