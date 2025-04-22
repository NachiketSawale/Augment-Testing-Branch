/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import {
	createLookup,
	FieldType,
	FormRow,
	IEditorDialogResult,
	IFormConfig,
	IFormDialogConfig, UiCommonFormDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import {EstimateProjectHeaderLookupService} from '@libs/estimate/project';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';
import { SalesContractContractsDataService } from '../services/sales-contract-contracts-data.service';

export interface IUpdateEstimate{
    IsLinkedBoqItems: boolean;
    IsNewLineItemForBoq: boolean;
    EstimateFk: number | null;
}
@Injectable({
    providedIn: 'root'
})
export class SalesContractUpdateEstimateWizardService {
	protected http = inject(HttpClient);
	public readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected configurationService = inject(PlatformConfigurationService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly dataService = inject(SalesContractContractsDataService);

	// Update Estimate wizard service
	public updatEstimate() {
		const selectedContract = this.dataService.getSelection()[0];
		if (!selectedContract && selectedContract == undefined) {
			this.messageBoxService.showInfoBox('Please select a record first', 'info', true);
			return;
		}
       this.prepareFormData(selectedContract);
	}

	public estimateId: IUpdateEstimate = {
       IsLinkedBoqItems: true,
       IsNewLineItemForBoq: true,
       EstimateFk: 1011344,
	};


	private prepareFormData(selections: IOrdHeaderEntity) {

		const mainEntity = this.dataService.getSelection()[0];

		const config: IFormDialogConfig<IUpdateEstimate> = {
			headerText: {text: 'Update Estimate'},
			formConfiguration: this.generateEditOptionRows(),
			customButtons: [],
			entity: this.estimateId
		};

		this.formDialogService.showDialog(config)?.then((result: IEditorDialogResult<IUpdateEstimate>) => {
          if (result.closingButtonId === 'ok') {
              if (result.value) {
                  const dataItem = result.value;
                  const postData = {
                      EstimateFk: dataItem.EstimateFk,
                      IsLinkedBoqItems: dataItem.IsLinkedBoqItems,
                      IsNewLineItemForBoq: dataItem.IsNewLineItemForBoq,
                      OrdHeaderFk: mainEntity.Id
                  };
                  const url = this.configurationService.webApiBaseUrl + 'sales/contract/updateestimate';
                  this.http.post(url, postData).subscribe((res) => {
                      this.messageBoxService.showInfoBox('Estimate Updated Successfully!', 'info', true);
                      return;
                  });
              }
          }
		});
	}

	private generateEditOptionRows(): IFormConfig<IUpdateEstimate> {
		let formRows: FormRow<IUpdateEstimate>[] = [];
		formRows = [
			{
				id: 'IsLinkedBoqItems',
				label: {
					text: 'Is Linked Boq Item',
				},
				type: FieldType.Boolean,
				model: 'IsLinkedBoqItems'
			},
			{
				id: 'IsNewLineItemForBoq',
				label: {
					text: 'Is Line Item For New BoQ',
				},
				type: FieldType.Boolean,
				model: 'IsNewLineItemForBoq'
			},
			{
				id: 'EstimateFk',
				label: {
					text: 'Estimate',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: EstimateProjectHeaderLookupService,
					showClearButton: true
				}),
				model: 'EstimateFk'
			}
		];
		const formConfig: IFormConfig<IUpdateEstimate> = {
			formId: 'editorOption',
			showGrouping: false,
			addValidationAutomatically: true,
			rows: formRows
		};
		return formConfig;
	}
}