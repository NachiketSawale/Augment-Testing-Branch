/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
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
import { BasicsSharedRubricCategoryByRubricAndCompanyLookupService, Rubric } from '@libs/basics/shared';
import { SalesWipWipsDataService } from '../sales-wip-wips-data.service';
import { IWipHeaderEntity } from '../../model/entities/wip-header-entity.interface';
import { IWipStatusEntity } from '../../model/entities/wip-status-entity.interface';
import { WipPrcConfigurationModel } from '../../model/wip-prc-configuration.model';
import { SalesWipConfigurationLookupService } from '../../lookups/sales-wip-configuration-lookup.service';

@Injectable({
	providedIn: 'root'
})
export class SalesWipChangeTypeOrConfigWizardService {

	protected http = inject(HttpClient);
	public readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected configurationService = inject(PlatformConfigurationService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly dataService = inject(SalesWipWipsDataService);
	private readonly selectedWip:IWipHeaderEntity = this.dataService.getSelection()[0];
	public changeTypeOrConfig() {
		const selections = this.dataService.getSelection()[0];

		if (!selections && selections == undefined) {
			this.messageBoxService.showInfoBox('Please select a record first', 'info', true);
			return;
		}
		this.http.get(this.configurationService.webApiBaseUrl + 'sales/wip/status/list').subscribe(result => {
			const wipStatus = (result as IWipStatusEntity[]).filter(item => item.Id === selections.WipStatusFk)[0];
			if (!wipStatus.IsAccepted) {
				this.messageBoxService.showInfoBox('Not possible to change the configuration/type of the selected item. Please check the status first.', 'info', true);
				return;
			} else {
				this.prepareFormData(selections);
			}
		});
	}

	public WipHeaderIds: ISalesWipChangeTypeOrConfig = {
		RubricCategoryFk:this.selectedWip.RubricCategoryFk,
		ConfigurationFk: 0,
	};

	public changeConfigurationFromCategory(rubricCategoryFk: number) {
		this.http.get(this.configurationService.webApiBaseUrl + 'basics/lookupdata/master/getsearchlist?lookup=prcconfiguration&filtervalue=(RubricFk%3D' + Rubric.WIP + '%20AND%20RubricCategoryFk%3D' + this.WipHeaderIds.RubricCategoryFk + ')', {}).subscribe(result => {
			const defaultData = (result as WipPrcConfigurationModel[]).filter(item => item.IsDefault).slice(-1)[0];
			this.WipHeaderIds.ConfigurationFk = defaultData.Id;
		});
	}

	private prepareFormData(selections: IWipHeaderEntity) {
		this.changeConfigurationFromCategory(this.WipHeaderIds.RubricCategoryFk);
		const config: IFormDialogConfig<ISalesWipChangeTypeOrConfig> = {
			headerText: 'Change Wip Type/Configuration',
			formConfiguration: this.generateEditOptionRows(),
			customButtons: [],
			entity: this.WipHeaderIds
		};

		this.formDialogService.showDialog(config)?.then((result: IEditorDialogResult<ISalesWipChangeTypeOrConfig>) => {
			if (result.closingButtonId === 'ok') {
				const dataItem = result.value;
				const postData = {
					TypeFk: null,
					RubricCategoryFk:(dataItem ? dataItem.RubricCategoryFk : null),
					ConfigurationFk : (dataItem ? dataItem.ConfigurationFk : null),
					ChangeEntityFk: null,
					OrdHeaderFk: null,
					BidHeaderFk: null,
				};
				const queryPath = this.configurationService.webApiBaseUrl + 'sales/wip/changesalestypeorconfiguration';
				this.http.post(queryPath, postData).subscribe((res) => {
					this.messageBoxService.showMsgBox('Changed Sales Type/Configuration updated successfully.', this.translateService.instant('Change Wip Type/Configuration').text, 'ico-info');
					this.dataService.refreshSelected();
					return;
				});
			}
		});
	}

	private generateEditOptionRows(): IFormConfig<ISalesWipChangeTypeOrConfig> {
		let formRows: FormRow<ISalesWipChangeTypeOrConfig>[] = [];
		formRows = [
			{
				id: 'RubricCategoryFk',
				label: {
					text: 'Rubric Category',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedRubricCategoryByRubricAndCompanyLookupService,
					serverSideFilter: {
						key: 'rubric-category-by-rubric-company-lookup-filter',
						execute() {
							return { Rubric: Rubric.WIP };
						},
					},
					showClearButton: false,
				}),
				change: e => {
					if(e.newValue) {
						this.changeConfigurationFromCategory(e.newValue as number);
					}
				},
				model: 'RubricCategoryFk',
				required: true,
			},
			{
				id: 'ConfigurationFk',
				label: {
					text: 'Configuration',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: SalesWipConfigurationLookupService,
					showClearButton: true
				}),
				model: 'ConfigurationFk',
				required: true,
			},
		];
		const formConfig: IFormConfig<ISalesWipChangeTypeOrConfig> = {
			formId: 'editorOption',
			showGrouping: false,
			addValidationAutomatically: true,
			rows: formRows
		};
		return formConfig;
	}
}
export interface ISalesWipChangeTypeOrConfig {
	RubricCategoryFk : number;
	ConfigurationFk? : number;
}