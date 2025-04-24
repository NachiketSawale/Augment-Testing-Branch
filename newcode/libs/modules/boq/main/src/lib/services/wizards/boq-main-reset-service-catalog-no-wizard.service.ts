import { inject, Injectable } from '@angular/core';
import { FieldType,	IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { BoqItemDataService, BoqItemDataServiceBase } from '../boq-main-boq-item-data.service';
import { IInitializationContext } from '@libs/platform/common';
import { BoqWizardServiceBase } from './boq-main-wizard.service';
import { BoqWizardUuidConstants, IBoqItemEntity } from '@libs/boq/interfaces';

class ResetServiceCatalogNoOption {
	public ResetMode?: number;
}

@Injectable({providedIn: 'root'})
export abstract class BoqResetServiceCatalogNoWizardService extends BoqWizardServiceBase {
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private boqItemDataService!:BoqItemDataServiceBase | null;
	public constructor() {
		super();
		this.boqItemDataService = null;
	}
	public getUuid(): string {
		return BoqWizardUuidConstants.ResetServiceCatalogNoWizardUuid;
	}
	protected async exec(boqItemDataService: BoqItemDataServiceBase) {
		this.boqItemDataService = boqItemDataService;
		this.assertIsNotReadOnly(boqItemDataService).then(response => {
			if (response) {
				this.openResetServiceCatalogNoDialog(this.boqItemDataService);
			}
		});
	}

	public resetServiceCatalogNoOption: ResetServiceCatalogNoOption = {
		ResetMode: 1,// 1: reset service catalog no of whole boq; 2: reset service catalog no of currently selected items and their children
	};

	public async openResetServiceCatalogNoDialog(boqItemDataService:BoqItemDataServiceBase | null) {
		this.boqItemDataService = boqItemDataService;
		const currentBoqHeaderId = boqItemDataService?.getSelectedBoqHeaderId();
		if(currentBoqHeaderId == undefined){
			this.messageBoxService.showMsgBox(this.translateService.instant({ key: 'boq.main.gaebImportBoqMissing' }).text, this.translateService.instant({ key: 'boq.main.warning' }).text, 'ico-warning');
			return;
		}

		await this.formDialogService.showDialog<ResetServiceCatalogNoOption>({
			id: 'resetServiceCatalogNoDialog',
			headerText: { key: 'boq.main.boqResetServiceCatalogNo' },
			formConfiguration: this.resetServiceCatalogNoFormConfig,
			entity: this.resetServiceCatalogNoOption,
			runtime: undefined,
			customButtons: [],
			topDescription: '',
		})?.then(result => {
			if (result?.closingButtonId === StandardDialogButtonId.Ok) {
				this.handleOk(result);
			}
		});
	}

	/**
	 * Form configuration data.
	 */
	private resetServiceCatalogNoFormConfig: IFormConfig<ResetServiceCatalogNoOption> = {
		formId: 'reset-service-catalog-no',
		showGrouping: false,
		rows: [
			{
				id: 'ResetMode',
				label: {
					key : 'boq.main.resetServiceCatalogNoSelection',
				},
				type: FieldType.Radio,
				model: 'ResetMode',
				itemsSource: {
					items: [
						{
							id: 1,
							displayName: 'boq.main.resetServiceCataLogNoModeAll',
						},
						{
							id: 2,
							displayName: 'boq.main.resetServiceCataLogNoModeSelected',
						},
					],
				},
			},
		],
	};

	/**
	 * Method handles 'Ok' button functionality.
	 */
	private handleOk(result: IEditorDialogResult<ResetServiceCatalogNoOption>): void {
		let selectedBoqItems: IBoqItemEntity[] | undefined;
		if(result.value?.ResetMode == 2){
			if (!this.boqItemDataService?.hasSelection()){
				this.messageBoxService.showMsgBox('boq.main.resetServiceCatalogNoNoValidSelection', 'boq.main.resetServiceCatalogNoInvalidSelection', 'ico-error' );
			}
		}

		this.resetServiceCatalogNoForBoqItems(selectedBoqItems).then(resetSucceeded => {
			if (!resetSucceeded) {
				this.messageBoxService.showMsgBox('boq.main.resetServiceCatalogNoFailed', 'boq.main.resetServiceCatalogNoAborted', 'ico-error');
			}
		});
	}

	private resetServiceCatalogNoForBoqItems(selectedBoqItems: IBoqItemEntity[] | undefined) {
		const data = {
			BoqHeaderFk: this.boqItemDataService?.getSelectedBoqHeaderId(),
			SelectedBoqItems:selectedBoqItems,
		};
	   return (this.http.post<boolean>('boq/main/resetservicecatalogno', data)).then(
			success=>{
				console.log(success);
				if(success){
					this.boqItemDataService?.refreshAll();
				}
				return success;
			}
		).catch(error=>{
		   console.log(error);
		   return false;
	   });
	}
}

@Injectable({providedIn: 'root'})
export class BoqMainResetServiceCatalogNoWizardService extends BoqResetServiceCatalogNoWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(BoqItemDataService));
	}
}

