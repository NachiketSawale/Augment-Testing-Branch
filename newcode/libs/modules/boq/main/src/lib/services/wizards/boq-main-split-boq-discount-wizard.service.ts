import { Injectable } from '@angular/core';
import { StandardDialogButtonId } from '@libs/ui/common';
import { BoqItemDataServiceBase, BoqItemDataService } from '../boq-main-boq-item-data.service';
import { IInitializationContext, PostHttpOptions } from '@libs/platform/common';
import { BoqWizardServiceBase } from './boq-main-wizard.service';

//TODO: This wizard is part of 'Procurement.Quote'.
@Injectable({providedIn: 'root'})
export abstract class BoqSplitBoqDiscountWizardService extends BoqWizardServiceBase{
	public static readonly uuid = 'a85708b3bbde4bdf91672a7236fa57ad';
	public getUuid(): string {
		return BoqSplitBoqDiscountWizardService.uuid;
	}

	protected async exec(boqItemDataService: BoqItemDataServiceBase) {
		this.splitDiscountWizard(boqItemDataService);
	}

	//TODO-BOQ-DEV-6903: This method is used in prc quote
	public splitDiscountWizard(boqItemDataService : BoqItemDataServiceBase){
		const boqHeaderId = boqItemDataService.getSelectedBoqHeaderId();
		if (!boqHeaderId) {
			this.messageBoxService.showInfoBox('boq.main.gaebImportBoqMissing','ico-info', false);
			return;
		}
		this.messageBoxService.showYesNoDialog({
			headerText: 'boq.main.SplitDiscountTitle',
			bodyText: 'boq.main.SplitDiscountText',
			defaultButtonId: StandardDialogButtonId.Yes
		})?.then((result) => {
			if (result.closingButtonId === StandardDialogButtonId.Yes) {
				const httpOtions: PostHttpOptions = { observe: 'body', responseType: 'text' as 'json' };
				this.http.post$<string>('boq/main/splitdiscount' + '?boqHeaderId=' + boqHeaderId, null, httpOtions)
					.subscribe(data => {
						boqItemDataService.refreshAll();
						let responseData = JSON.stringify(data);
						responseData =  responseData.replace(/"/g, '');
						this.messageBoxService.showMsgBox(responseData, 'cloud.common.infoBoxHeader', 'ico-info');
					});
			}
		});
	}
}

@Injectable({providedIn: 'root'})
export class BoqMainSplitBoqDiscountWizardService extends BoqSplitBoqDiscountWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(BoqItemDataService));
	}
}
