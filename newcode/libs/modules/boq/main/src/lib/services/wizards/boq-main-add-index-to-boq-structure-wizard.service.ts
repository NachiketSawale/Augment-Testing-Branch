import { Injectable } from '@angular/core';
import { StandardDialogButtonId } from '@libs/ui/common';
import { BoqItemDataService, BoqItemDataServiceBase } from '../boq-main-boq-item-data.service';
import { IInitializationContext } from '@libs/platform/common';
import { BoqWizardServiceBase } from './boq-main-wizard.service';

@Injectable({
	providedIn: 'root'
})
export abstract class BoqAddIndexToBoqStructureWizardService extends BoqWizardServiceBase{
	private boqItemDataService!: BoqItemDataServiceBase;
	public static readonly uuid = '5bc822ff12234ed69696fa438376643b';
	public getUuid(): string {
		return BoqAddIndexToBoqStructureWizardService.uuid;
	}
	protected async exec(boqItemDataService: BoqItemDataServiceBase) {
		this.boqItemDataService = boqItemDataService;
		this.addIndexToBoqStructure();
	}

	public addIndexToBoqStructure() {
		const selectedBoqHeaderId = this.boqItemDataService.getSelectedBoqHeaderId();
		if(selectedBoqHeaderId == undefined){
			this.messageBoxService.showInfoBox('boq.main.gaebImportBoqMissing', 'info', false);
			return;
		}
		this.messageBoxService.showYesNoDialog({
				headerText: 'boq.main.addIndexToBoqStructureTitle',
				bodyText: 'boq.main.addIndexToBoqStructureTitle',
				defaultButtonId: StandardDialogButtonId.Yes
			})
			?.then((result) => {
				if (result.closingButtonId === StandardDialogButtonId.Yes) {
					this.http.post$(`boq/main/addindextoboqstructure?boqHeaderId=${selectedBoqHeaderId}`, null).subscribe(() => {
						this.boqItemDataService.refreshAll();
				});
			}
		});
	}
}

@Injectable({providedIn: 'root'})
export class BoqMainAddIndexToBoqStructureWizardService extends BoqAddIndexToBoqStructureWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(BoqItemDataService));
	}
}
