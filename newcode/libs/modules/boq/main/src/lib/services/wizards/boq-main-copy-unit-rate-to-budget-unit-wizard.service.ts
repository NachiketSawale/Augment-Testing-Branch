import { Injectable } from '@angular/core';
import { BoqItemDataService, BoqItemDataServiceBase } from '../boq-main-boq-item-data.service';
import { StandardDialogButtonId } from '@libs/ui/common';
import { IInitializationContext } from '@libs/platform/common';
import { BoqWizardServiceBase } from './boq-main-wizard.service';

@Injectable({
	providedIn: 'root'
})
export abstract class BoqCopyUnitRateToBudgetUnitWizardService extends BoqWizardServiceBase{
	private boqItemDataService! : BoqItemDataServiceBase;
	public static readonly uuid = '4f7c3463682c48e9bd91c2212a61cad8';
	public getUuid(): string {
		return BoqCopyUnitRateToBudgetUnitWizardService.uuid;
	}
	protected async exec(boqItemDataService: BoqItemDataServiceBase) {
		this.boqItemDataService = boqItemDataService;
		this.copyUnitRateToBudgetUnit();
	}

	// TODO-BOQ-DEV-6921: Wizard belongs to Proc Package Module. Added the necessary method in boq main wizard service. Added TODO comments for missing functionality.
	public copyUnitRateToBudgetUnit() {
		const selectedBoqHeaderId = this.boqItemDataService.getSelectedBoqHeaderId();
		if(selectedBoqHeaderId == undefined){
			this.messageBoxService.showInfoBox('boq.main.gaebImportBoqMissing', 'info', false);
			return;
		}
		this.messageBoxService.showYesNoDialog({
			headerText: 'boq.main.copyUnitRateToBudgetUnitWizard.title',
			bodyText: 'boq.main.copyUnitRateToBudgetUnitWizard.continueQuestion',
			defaultButtonId: StandardDialogButtonId.Yes
		})
			?.then((result) => {
				if (result.closingButtonId === StandardDialogButtonId.Yes) {
					this.http.post$(`boq/main/copyunitratetobudgetunit?boqHeaderId=${selectedBoqHeaderId}`, null).subscribe(() => {
						this.boqItemDataService.refreshAll();
					});
				}
			});
		}
}

@Injectable({providedIn: 'root'})
export class BoqMainCopyUnitRateToBudgetUnitWizardService extends BoqCopyUnitRateToBudgetUnitWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(BoqItemDataService));
	}
}
