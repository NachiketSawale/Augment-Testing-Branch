/* eslint-disable prefer-const */
/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, inject } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { BoqItemDataService, BoqItemDataServiceBase } from '../boq-main-boq-item-data.service';
import { BoqUpdateData } from './boq-main-wic-wizard.service';
import { BoqWizardServiceBase } from './boq-main-wizard.service';
import { BoqWizardUuidConstants } from '@libs/boq/interfaces';

export abstract class BoqUpdateWizardService extends BoqWizardServiceBase {

	public getUuid(): string {
		return BoqWizardUuidConstants.UpdateBoqWizardUuid;
	}

	private readonly formDialogService = inject(UiCommonFormDialogService);

	private formConfig: IFormConfig<BoqUpdateData> = {
	formId: 'cloud.common.dialog.default.form',
	showGrouping: false,
	addValidationAutomatically: true,
	groups: [],
	rows: [
		{
			id: 'radio',
			label: { key : 'boq.main.wizard.baseOn' },
			type: FieldType.Radio,
			model: 'recalculationForBoqScope',
			itemsSource: {
			items: [
				{
					id: 1,
					displayName: { key : 'boq.main.Price'}
				},
				{
					id: 0,
					displayName: { key : 'boq.main.Pricegross'}
				}
				],
			},
		},
		]
	};

	private updateBoqEntity: BoqUpdateData = {
		ProjectId: 0,
		BoqHeaderId: 0,
		Module: 'boq.main',
		HeaderId:1,
		ExchangeRate: 0,
		IsBaseOnCorrectedUPGross: false,
		IsReCalculateBoqPriceconditions: false
	};

	//TODO-BOQ-DEV-6915: it is called from Sales & Procurement modules. Other module have to inject "updateBoqWizardService" into thier module.
	protected async exec(boqItemDataService: BoqItemDataServiceBase) {
		this.assertIsNotReadOnly(boqItemDataService).then(response => {
			if (response) {
				// TODO-BOQ: eslint any (deactivated)
				// let commonBoqDataService: any = null;
				// let headerData: { Module: string; HeaderId: number; ExchangeRate: number; } = { Module: 'boq.main',HeaderId : 0, ExchangeRate: 0};

				this.formDialogService.showDialog<BoqUpdateData>({
					id: 'updateBoq',
					headerText: { key: 'boq.main.wizard.updateBoq' },
					formConfiguration: this.formConfig,
					entity: this.updateBoqEntity,
					runtime: undefined,
					customButtons: [],
					topDescription: '',
				})?.then(result => {
					if (result?.closingButtonId === StandardDialogButtonId.Ok) {
						// TODO-BOQ: eslint any (deactivated) this.handleOk(boqItemDataService, commonBoqDataService, headerData);
					} else {
						this.handleCancel(result);
					}
				});
			}
		});
	}

	/**
	 * Method handles 'Ok' button functionality.
	 * @param {IFormDialogResultInterface<IBoqUpdateDataEntity>} result Dialog result.
	 */
	// TODO-BOQ: eslint any (deactivated)
	/*
	private handleOk(boqItemDataService: BoqItemDataServiceBase, commonBoqDataService: any, headerData: { Module: string; HeaderId: number; ExchangeRate: number; }) : void {
		let boqHeaderId = boqItemDataService.getSelectedBoqHeaderId();
		let projectId   = boqItemDataService.getSelectedProjectId();
		let postData :BoqUpdateData = {
			ProjectId: projectId,
			BoqHeaderId: boqHeaderId,
			Module:       headerData ? headerData.Module : 'boq.main',
			HeaderId:     headerData ? headerData.HeaderId : projectId || -1,
			ExchangeRate: headerData ? headerData.ExchangeRate : boqItemDataService.getSelectedExchangeRate(),
			IsBaseOnCorrectedUPGross: false
		};
		this.http.post$('boq/main/updateboq', postData).subscribe( ()=> {
			if( commonBoqDataService && _.isFunction(commonBoqDataService.refresh)){
				commonBoqDataService.refresh();
			}else {
				boqItemDataService.refreshAll();
			}
		});
	}
	*/

	/**
	* Method handles 'Cancel' button functionality.
	*
	* @param {IFormDialogResultInterface<BoqUpdateData>} result Dialog result.
	*/
	private handleCancel(result?: IEditorDialogResult<BoqUpdateData>): void {
	//TODO-BOQ-DEV-6915:Operations to be carried out on cancel click.
	}
}

@Injectable({providedIn: 'root'})
export class BoqMainBoqUpdateWizardService extends BoqUpdateWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(BoqItemDataService));
	}
}
