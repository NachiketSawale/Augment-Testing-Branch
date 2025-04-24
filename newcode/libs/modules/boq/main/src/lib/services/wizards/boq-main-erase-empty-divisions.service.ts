import { Injectable } from '@angular/core';
import { BoqItemDataService, BoqItemDataServiceBase } from '../../services/boq-main-boq-item-data.service';
import { IInitializationContext } from '@libs/platform/common';
import { BoqWizardServiceBase } from './boq-main-wizard.service';
import { BoqWizardUuidConstants } from '@libs/boq/interfaces';

@Injectable({providedIn: 'root'})
export abstract class BoqEraseEmptyDivisionsService extends BoqWizardServiceBase {
	private boqItemDataService!:BoqItemDataServiceBase;
	public getUuid(): string {
		return BoqWizardUuidConstants.EraseEmptyDivisionsWizardUuid;
	}
	protected async exec(boqItemDataService: BoqItemDataServiceBase) {
		this.boqItemDataService = boqItemDataService;
		this.assertIsNotReadOnly(boqItemDataService).then(response => {
			if (response) {
				const selectedBoqHeaderId = this.boqItemDataService.getSelectedBoqHeaderId();

				this.http.get$( 'boq/main/eraseemptydivisions?boqheaderid=' + selectedBoqHeaderId).subscribe(success => {
					this.messageBoxService.showMsgBox(this.translateService.instant({ key: 'boq.main.emptyDivisionErasureResult' }).text + success, this.translateService.instant({ key: 'boq.main.emptyDivisionErasure' }).text, 'ico-info');
					this.boqItemDataService.refreshAll();
				});
			}
		});
	}
}

@Injectable({providedIn: 'root'})
export class BoqMainEraseEmptyDivisionsServiceWizardService extends BoqEraseEmptyDivisionsService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(BoqItemDataService));
	}
}