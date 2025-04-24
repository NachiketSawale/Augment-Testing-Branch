/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as _ from 'lodash';
import {
	createLookup,
	FieldType,
	FormRow,
	IEditorDialogResult, IFieldValueChangeInfo,
	IFormConfig,
	IFormDialogConfig,
	StandardDialogButtonId,
	UiCommonFormDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import {PlatformConfigurationService, PlatformTranslateService, PropertyType} from '@libs/platform/common';
import {
	BasicsSharedOrderTypeLookupService,
	BasicsSharedProcurementConfigurationLookupService,
	BasicsSharedRubricCategoryLookupService
} from '@libs/basics/shared';
import {ISalesConfigurationHeaderEntity} from '@libs/sales/shared';
import {ProcurementShareProjectChangeLookupService} from '@libs/procurement/shared';
import { SalesContractContractsDataService } from '../services/sales-contract-contracts-data.service';
import { salesContractContractLookupService } from '../lookup-services/sales-contract-contract-looup.service';

@Injectable({
	providedIn: 'root'
})
export class SalesContractChangeConfigurationWizardService {

	protected readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected http = inject(HttpClient);
	protected configService = inject(PlatformConfigurationService);
	public headerDataService: SalesContractContractsDataService = inject(SalesContractContractsDataService);
	protected formConfig: IFormConfig<ISalesChangeContractConfigEntity> = { rows: [] };
	private contractTypeLookupService =  inject(BasicsSharedOrderTypeLookupService);

	public changeContractConfiguration() {
		this.showChangeContractConfigurationDialog();
	}

	public async showChangeContractConfigurationDialog(): Promise<boolean> {

		const selectedEntity = this.headerDataService.getSelectedEntity();
		if(!selectedEntity) {
			this.messageBoxService.showMsgBox(this.translateService.instant('cloud.common.noCurrentSelection').text, this.translateService.instant('Change contract configuration / Type').text, 'ico-warning');
			return false;
		}

		const entity: ISalesChangeContractConfigEntity = {
			ChangeEntityFk: selectedEntity.PrjChangeFk ?? null,
			TypeFk: selectedEntity.TypeFk ?? 0,
			RubricCategoryFk: selectedEntity.RubricCategoryFk ?? 0,
			ConfigurationFk: selectedEntity.ConfigurationFk ?? null,
			OrdHeaderFk: selectedEntity.OrdHeaderFk ?? null
		};

		this.formConfig = this.generateFormConfig();

		const TypeRow = _.find(this.formConfig.rows, { id: 'TypeFk' });
		if(TypeRow){
			const changeInfo: IFieldValueChangeInfo<ISalesChangeContractConfigEntity, PropertyType> = {
				oldValue: selectedEntity.TypeFk ?? 0,
				newValue: selectedEntity.TypeFk ?? 0,
				field: TypeRow,
				entity: entity
			};
			this.updateRowConfig(changeInfo);
		}

		const config: IFormDialogConfig<ISalesChangeContractConfigEntity> = {
			headerText: 'Change contract configuration / Type',
			formConfiguration: this.formConfig,
			customButtons: [],
			entity: entity
		};

		const ret = false;
		this.formDialogService.showDialog(config)?.then(async (result: IEditorDialogResult<ISalesChangeContractConfigEntity>) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
				const postData = {
					BidHeaderFk: null,
					ChangeEntityFk: result.value.ChangeEntityFk,
					ConfigurationFk: result.value.ConfigurationFk,
					ContractId: selectedEntity.Id,
					OrdHeaderFk: null,
					RubricCategoryFk: result.value.RubricCategoryFk,
					TypeFk: result.value.TypeFk
				};
				const url = this.configService.webApiBaseUrl + 'sales/contract/changesalestypeorconfiguration';
				this.http.post(url, postData).subscribe((res) => {
					if(Object(res).IsSuccess){
						selectedEntity.PrjChangeFk = result.value?.ChangeEntityFk;
						selectedEntity.ConfigurationFk = result.value?.ConfigurationFk;
						selectedEntity.TypeFk = result.value?.TypeFk;
						selectedEntity.RubricCategoryFk = result.value?.RubricCategoryFk;
						const updatedPayload = {
							OrdHeader: selectedEntity
						};
						this.http.post(this.configService.webApiBaseUrl + 'sales/contract/update', updatedPayload).subscribe((res) => {
							if(res){
								this.messageBoxService.showInfoBox(this.translateService.instant('sales.contract.changeSalesTypeOrConfigWizard.chgSuccess').text, 'info', true);
								this.headerDataService.refreshSelected();
							}
						});
						return;
					} else {
						this.messageBoxService.showMsgBox(this.translateService.instant(Object(res).Message).text, this.translateService.instant('Change contract configuration / Type').text, 'ico-warning');
						return;
					}
				});
			}
		});

		return ret;
	}

	private generateFormConfig(): IFormConfig<ISalesChangeContractConfigEntity> {
		const formRows: FormRow<ISalesChangeContractConfigEntity>[] = [
			{
				id: 'TypeFk',
				type: FieldType.Lookup,
				label: 'Type',
				model: 'TypeFk',
				required: false,
				readonly: false,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedOrderTypeLookupService,
					showClearButton: false
				}),
				change: changeInfo => {
					this.contractTypeLookupService.getList().subscribe(data => {
						const selectedType = data.filter(x=> x.Id === changeInfo.newValue)[0];
						// set selected rubric category
						changeInfo.entity.RubricCategoryFk = selectedType?.RubricCategoryFk ?? 0;

						// row configuration
						const OrdHeaderRow = _.find(this.formConfig.rows, { id: 'OrdHeaderFk' });
						const ChangeEntityRow = _.find(this.formConfig.rows, { id: 'ChangeEntityFk' });
						if(OrdHeaderRow && ChangeEntityRow) {
							if(selectedType.IsMain) {
								OrdHeaderRow.readonly = true;
								OrdHeaderRow.required = false;

								ChangeEntityRow.readonly = true;
								ChangeEntityRow.required = false;

								changeInfo.entity.OrdHeaderFk = null;
								changeInfo.entity.ChangeEntityFk = null;
							} else if(selectedType.IsSide) {
								OrdHeaderRow.readonly = false;
								OrdHeaderRow.required = true;

								ChangeEntityRow.readonly = true;
								ChangeEntityRow.required = false;

								changeInfo.entity.ChangeEntityFk = null;
							} else {
								OrdHeaderRow.readonly = false;
								OrdHeaderRow.required = true;

								ChangeEntityRow.readonly = false;
								ChangeEntityRow.required = true;
							}
						}

						if(selectedType) {
							this.http.get(this.configService.webApiBaseUrl + 'basics/lookupdata/master/getsearchlist?lookup=prcconfiguration&filtervalue=(RubricFk=5 AND RubricCategoryFk='+(selectedType?.RubricCategoryFk ?? 0)+')').subscribe(configs => {
								const selectedConfig = configs as ISalesConfigurationHeaderEntity[];
								if(selectedConfig.length > 0) {
									// set configuration
									changeInfo.entity.ConfigurationFk = selectedConfig[0].Id ?? 0;
								}
							});
						}
					});
				}
			},
			{
				id: 'RubricCategoryFk',
				type: FieldType.Lookup,
				label: 'Category',
				model: 'RubricCategoryFk',
				required: false,
				readonly: true,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedRubricCategoryLookupService,
					showClearButton: false,
					showDescription: true,
					descriptionMember: 'Description'
				}),
			},
			{
				id: 'ConfigurationFk',
				type: FieldType.Lookup,
				label: 'Configuration',
				model: 'ConfigurationFk',
				required: false,
				readonly: false,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
					showClearButton: false
				}),
			},
			{
				id: 'OrdHeaderFk',
				type: FieldType.Lookup,
				label: 'Main Contract',
				model: 'OrdHeaderFk',
				required: false,
				readonly: true,
				lookupOptions: createLookup({
					dataServiceToken: salesContractContractLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'DescriptionInfo'
				})
			},
			{
				id: 'ChangeEntityFk',
				type: FieldType.Lookup,
				label: 'Change Entity',
				model: 'ChangeEntityFk',
				required: false,
				readonly: true,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementShareProjectChangeLookupService,
					showClearButton: false,
					readonly: true
				})
			},
		];
		return {
			formId: 'generate.payment.schedule.form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: formRows,
		};
	}

	public updateRowConfig(changeInfo: IFieldValueChangeInfo<ISalesChangeContractConfigEntity,PropertyType>){
		this.contractTypeLookupService.getList().subscribe(data => {
			const selectedType = data.filter(x=> x.Id === changeInfo.newValue)[0];
			// set selected rubric category
			changeInfo.entity.RubricCategoryFk = selectedType?.RubricCategoryFk ?? 0;

			// row configuration
			const OrdHeaderRow = _.find(this.formConfig.rows, { id: 'OrdHeaderFk' });
			const ChangeEntityRow = _.find(this.formConfig.rows, { id: 'ChangeEntityFk' });
			if(OrdHeaderRow && ChangeEntityRow) {
				if(selectedType.IsMain) {
					OrdHeaderRow.readonly = true;
					OrdHeaderRow.required = false;

					ChangeEntityRow.readonly = true;
					ChangeEntityRow.required = false;

					changeInfo.entity.OrdHeaderFk = null;
					changeInfo.entity.ChangeEntityFk = null;
				} else if(selectedType.IsSide) {
					OrdHeaderRow.readonly = false;
					OrdHeaderRow.required = true;

					ChangeEntityRow.readonly = true;
					ChangeEntityRow.required = false;
				} else {
					OrdHeaderRow.readonly = false;
					OrdHeaderRow.required = true;

					ChangeEntityRow.readonly = false;
					ChangeEntityRow.required = true;
				}
			}
		});
	}
}

export interface ISalesChangeContractConfigEntity {
	TypeFk: number;
	RubricCategoryFk: number;
	ConfigurationFk: number | null;
	OrdHeaderFk?: number | null;
	ChangeEntityFk?: number | null;
}