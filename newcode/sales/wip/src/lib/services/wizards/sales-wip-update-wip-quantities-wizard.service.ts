/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { FieldType, FormRow, IEditorDialogResult, IFormConfig, IFormDialogConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import {HttpClient} from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { SalesWipWipsDataService } from '../sales-wip-wips-data.service';
import { WipHeaderComplete } from '../../model/wip-header-complete.class';

@Injectable({
	providedIn: 'root'
})
export class SalesWipUpdateWipQuantitiesWizardService {

	protected readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected http = inject(HttpClient);
	protected configService = inject(PlatformConfigurationService);
	public headerDataService: SalesWipWipsDataService = inject(SalesWipWipsDataService);
	private isSchedule: boolean = false;
	private isPes: boolean = false;


	public updateWipQuantities() {
		this.showUpdateWipQuantityDialog();
	}

	public async showUpdateWipQuantityDialog(): Promise<boolean> {

		const selectedEntity = this.headerDataService.getSelectedEntity();
		if(!selectedEntity) {
			this.messageBoxService.showMsgBox(this.translateService.instant('cloud.common.noCurrentSelection').text, this.translateService.instant('Update WIP Quantities').text, 'ico-warning');
			return false;
		}

		const entity: ISalesChangeCodeEntity = {
			selectedItem: 1,
			isUpdateLineItem:false
		};

		const config: IFormDialogConfig<ISalesChangeCodeEntity> = {
			headerText: 'sales.wip.wizard.updateWipIQ',
			formConfiguration: this.generateFormConfig(),
			customButtons: [],
			entity: entity
		};

		const ret = false;
		this.formDialogService.showDialog(config)?.then(async (result: IEditorDialogResult<ISalesChangeCodeEntity>) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
				const queryPath = this.configService.webApiBaseUrl + 'sales/wip/boq/updatewipquantity';
				const postData = new WipHeaderComplete();
				const selectedWip = this.headerDataService.getSelection()[0];
				if(result.value.selectedItem === 1) {
					this.isSchedule = true;
				}else{
					this.isPes = true;
				}
				const params = {
					IsPes: this.isPes,
					IsSchedule: this.isSchedule,
					IsUpdateLineItem: result.value.isUpdateLineItem,
					WipHeaderIds: [selectedWip.Id],
				};
				if (postData.WipHeader) {
					this.http.post(queryPath, params).subscribe((res) => {
						this.messageBoxService.showMsgBox('Done Successfully', this.translateService.instant('sales.wip.wizard.updatedQuantity').text, 'ico-info');
						this.headerDataService.refreshSelected();
						return;
					});
				}
			}
		});

		return ret;
	}

	private generateFormConfig(): IFormConfig<ISalesChangeCodeEntity> {
		const formRows: FormRow<ISalesChangeCodeEntity>[] = [
			{
				id: 'selectedItem',
				label: 'Update Wip Quantity',
				type: FieldType.Radio,
				model: 'selectedItem',
				itemsSource: {
					items: [
						{id: 1, displayName: this.translateService.instant('sales.wip.wizard.schedule')},
						{id: 2, displayName: this.translateService.instant('sales.wip.wizard.pes')}
					]
				},
			},
			{
				id: 'isUpdateLineItem',
				label: 'Update Line Item',
				type: FieldType.Boolean,
				model: 'isUpdateLineItem',
			},
		];
		return {
			formId: 'change.code.form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: formRows,
		};
	}
}

export interface ISalesChangeCodeEntity {
	selectedItem: number;
	isUpdateLineItem: boolean;
}