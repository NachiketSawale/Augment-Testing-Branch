import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { BusinessPartnerMainSubsidiaryDataService } from '../subsidiary-data.service';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import {
	createLookup,
	FieldType,
	FieldValidationInfo,
	IFormConfig,
	IMessageBoxOptions,
	StandardDialogButtonId,
	UiCommonFormDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import { BasicsSharedConStatusLookupService, BasicsSharedQuotationStatusLookupService } from '@libs/basics/shared';
import { HttpClient } from '@angular/common/http';
import { EntityRuntimeData, ValidationResult } from '@libs/platform/data-access';
import { BusinesspartnerPrcStructureDataService } from '../businesspartner-prcstructure-data.service';

interface IUpdatePrcStructureFromQtnAndContract{
	quoteStatusId: number | null,
	contractStatusId: number | null,
	from?: Date | null,
	to?: Date | null
}

@Injectable({
	providedIn: 'root'
})
export class UpdatePrcStructureFromQtnContractService{
	private bpMainSusidiaryDataService = inject(BusinessPartnerMainSubsidiaryDataService);
	private bpMainPrcStructureDataService = inject(BusinesspartnerPrcStructureDataService);

	private readonly translateService = inject(PlatformTranslateService);
	private readonly dialogService = inject(UiCommonMessageBoxService);
	private formDialogService = inject(UiCommonFormDialogService);
	private http = inject(HttpClient);
	protected configurationService = inject(PlatformConfigurationService);
	private msgBoxSvc = inject(UiCommonMessageBoxService);

	private updatePrcStructureFromQtnAndContractEntity: IUpdatePrcStructureFromQtnAndContract = {
		quoteStatusId: null,
		contractStatusId: null,
		from: null,
		to: null
	};
	private updatePrcContructureFormConfig: IFormConfig<IUpdatePrcStructureFromQtnAndContract> = {
		formId: 'updatePrcStructureFromQtnAndContract',
		showGrouping: false,
		rows: [
			{
				id: 'quoteStatusId',
				label: {
					text: this.translateService.instant('businesspartner.main.updatePrcStructureWizard.label.quoteStatus').text,
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({dataServiceToken: BasicsSharedQuotationStatusLookupService}),
				required: true,
				model: 'quoteStatusId',
				validator: (info: FieldValidationInfo<IUpdatePrcStructureFromQtnAndContract>):ValidationResult=>{
					if(_.isNull(info.value) || _.isEmpty(info.value)){
						this.updatePrcContructureRuntimeInfo.validationResults.push({
							field: 'quoteStatusId',
							result: {
								valid: false,
								error: 'It dont be empty',
							}
						});
						return new ValidationResult('It cannot be empty');
					}
					return new ValidationResult();
				}
			},
			{
				id: 'contractStatusId',
				label: {
					text: this.translateService.instant('businesspartner.main.updatePrcStructureWizard.label.contractStatus').text,
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({dataServiceToken: BasicsSharedConStatusLookupService}),
				required: true,
				model: 'contractStatusId',
				validator: (info: FieldValidationInfo<IUpdatePrcStructureFromQtnAndContract>):ValidationResult=>{
					if(_.isNull(info.value) || _.isEmpty(info.value)){
						this.updatePrcContructureRuntimeInfo.validationResults.push({
							field: 'contractStatusId',
							result: {
								valid: false,
								error: 'It dont be empty',
							}
						});
						return new ValidationResult('It cannot be empty');
					}
					return new ValidationResult();
				}
			},
			{
				id: 'from',
				label: {
					text: this.translateService.instant('businesspartner.main.updatePrcStructureWizard.label.from').text,
				},
				type: FieldType.Date,
				model: 'from',
			},
			{
				id: 'to',
				label: {
					text: this.translateService.instant('businesspartner.main.updatePrcStructureWizard.label.to').text,
				},
				type: FieldType.Date,
				model: 'to',
			},
		],
	};

	private updatePrcContructureRuntimeInfo: EntityRuntimeData<IUpdatePrcStructureFromQtnAndContract> = {
		readOnlyFields: [],
		validationResults: [],
		entityIsReadOnly: false
	};

	private handleOk(): void {

		const request = {
			SubsidiaryIds: _.map(this.bpMainSusidiaryDataService.getSelection(), 'Id'),
			QuoteStatusIds: [this.updatePrcStructureFromQtnAndContractEntity.quoteStatusId],
			ContractStatusIds: [this.updatePrcStructureFromQtnAndContractEntity.contractStatusId],
			DateFrom: this.updatePrcStructureFromQtnAndContractEntity.from,
			DateTo: this.updatePrcStructureFromQtnAndContractEntity.to
		};
		this.http.post(this.configurationService.webApiBaseUrl + 'businesspartner/main/businesspartnermain/updateprcstructurefromquotencontract', request).subscribe(res=>{
			const count = (res || 0) as number;
			const msgBoxOptions: IMessageBoxOptions = {
				windowClass: 'msgbox',
				width: '800px',
				bodyFlexColumn: true,
				resizeable: false,
				headerText: 'businesspartner.main.updatePrcStructureWizard.title',
				bodyText: {
					key: 'businesspartner.main.updatePrcStructureWizard.result',
					params: {count: count}
				},
				iconClass: 'ico-info',
				buttons: [{
					id: StandardDialogButtonId.Ok
				}],
			};
			this.msgBoxSvc.showMsgBox(msgBoxOptions)?.then(()=>{
				if(count > 0){
					this.bpMainPrcStructureDataService.reloadData();
				}
			});
		});
	}

	public async onUpdatePrcStructureFromQtnAndContract() {
		const selectedItems = this.bpMainSusidiaryDataService.getSelection();
		if (!_.isArray(selectedItems) || selectedItems.length === 0) {
			this.dialogService.showMsgBox(this.translateService.instant('businesspartner.main.updatePrcStructureWizard.error.selectOneBp').text,
				this.translateService.instant('businesspartner.main.updatePrcStructureWizard.title').text, 'ico-info');
			return;
		}
		const result = await this.formDialogService.showDialog<IUpdatePrcStructureFromQtnAndContract>({
			id: 'updatePrcStructureFromQtnAndContract',
			headerText: this.translateService.instant('businesspartner.main.updatePrcStructureWizard.title').text,
			formConfiguration: this.updatePrcContructureFormConfig,
			entity: this.updatePrcStructureFromQtnAndContractEntity,
			topDescription: this.translateService.instant('businesspartner.main.updatePrcStructureWizard.notification').text,
			runtime: this.updatePrcContructureRuntimeInfo,
			customButtons: [

			]
		});
		if (result?.closingButtonId === StandardDialogButtonId.Ok) {
			this.handleOk();
		}
	}
}