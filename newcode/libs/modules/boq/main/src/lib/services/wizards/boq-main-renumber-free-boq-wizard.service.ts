import { inject, Injectable } from '@angular/core';
import { FieldType, FormDisplayMode, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { IInitializationContext } from '@libs/platform/common';
import { BoqItemDataService, BoqItemDataServiceBase } from '../boq-main-boq-item-data.service';
import { BoqWizardServiceBase } from './boq-main-wizard.service';
import { BoqWizardUuidConstants } from '@libs/boq/interfaces';

class FreeBoqRenumberOption {
	public IsRenumberCurrent?: boolean;
	public IsWithinBoq?: boolean;
}

@Injectable({providedIn: 'root'})
export abstract class BoqRenumberFreeBoqWizardService extends BoqWizardServiceBase {
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private boqItemDataService!:BoqItemDataServiceBase;

	public getUuid(): string {
		return BoqWizardUuidConstants.RenumberFreeBoqWizardUuid;
	}

	protected async exec(boqItemDataService: BoqItemDataServiceBase) {
		this.boqItemDataService = boqItemDataService;
		this.assertIsNotReadOnly(boqItemDataService).then(response => {
			if (response) {
				this.openRenumberFreeBoqDialog();
			}
		});
	}

	private freeBoqRenumberOption: FreeBoqRenumberOption = {
		IsRenumberCurrent: false,
		IsWithinBoq: true
	};

	public async openRenumberFreeBoqDialog() {
		await this.formDialogService.showDialog<FreeBoqRenumberOption>({
			id: 'renumberFreeBoqDialog',
			headerText: { key: 'boq.main.freeBoqRenumber' },
			formConfiguration: this.renumberFreeBoqFormConfig,
			entity: this.freeBoqRenumberOption,
			runtime: undefined,
			customButtons: [],
			topDescription: '',
			displayMode:FormDisplayMode.Narrow
		})?.then(result => {
			if (result?.closingButtonId === StandardDialogButtonId.Ok) {
				this.handleOk(result);
			}
		});
	}

	/**
	 * Form configuration data.
	 */
	private renumberFreeBoqFormConfig: IFormConfig<FreeBoqRenumberOption> = {
		formId: 'renumber-free-boq-form',
		showGrouping: false,
		rows: [
			{
				id: 'IsRenumberCurrent',
				label: {
					key : 'boq.main.renumberBoqScope',
				},
				type: FieldType.Radio,
				model: 'IsRenumberCurrent',
				itemsSource: {
					items: [
						{
							id: true,
							displayName: 'boq.main.renumberSelectedBoq',
						},
						{
							id: false,
							displayName: 'boq.main.renumberAllBoqs',
						},
					],
				},
			},

			{
				id: 'IsWithinBoq',
				label: {
					key : 'boq.main.renumberDependance',
				},
				type: FieldType.Radio,
				model: 'IsWithinBoq',
				itemsSource: {
					items: [
						{
							id: true,
							displayName: 'boq.main.renumberEachBoq',
						},
						{
							id: false,
							displayName: 'boq.main.renumberCurrentPrj',
						},
					],
				},
			},
		],

	};


	/**
	 * Method handles 'Ok' button functionality.
	 */
	private handleOk(result: IEditorDialogResult<FreeBoqRenumberOption>): void {
		if(!this.boqItemDataService.isFreeBoq()){
			this.messageBoxService.showMsgBox('boq.main.freeBoqWarningMessage', 'boq.main.freeBoqRenumber', 'ico-warning');
			return;
		}
		this.renumberFreeBoq(result.value?.IsRenumberCurrent, result.value?.IsWithinBoq);
	}

	private renumberFreeBoq(isRenumberCurrent?: boolean, isWithinBoq?: boolean) {
		this.http.get$('boq/main/renumberFreeBoq?boqId=' + this.boqItemDataService.getSelectedBoqHeaderId() + '&isRenumberCurrent=' + isRenumberCurrent + '&isWithinBoq=' + isWithinBoq).subscribe({
			next:(success)=>{
				console.log(success);
				this.boqItemDataService.refreshAll();
			},
			error:(error)=>{
				console.log(error);
			}
		});
	}

}

@Injectable({providedIn: 'root'})
export class BoqMainRenumberFreeBoqWizardService extends BoqRenumberFreeBoqWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(BoqItemDataService));
	}
}
