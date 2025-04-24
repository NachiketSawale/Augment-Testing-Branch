/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EstimateMainResourceService } from '../estimate-main-resource-data.service';
import { HttpClient } from '@angular/common/http';
import {
	createLookup,
	FieldType,
	FormRow, IEditorDialogResult,
	IFormConfig, IFormDialogConfig, IGridConfiguration, IGridDialogOptions,
	UiCommonFormDialogService, UiCommonGridDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import { PlatformConfigurationService } from '@libs/platform/common';
import { ProjectMainDataService, ProjectSharedLookupService } from '@libs/project/shared';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { EstimateMainCostUnitMaterialLayoutService } from './estimate-main-cost-unit-material-layout.service';
import { EstimateMainCostUnitCostCodeLayoutService } from './estimate-main-cost-unit-cost-code-layout.service';
import { PrjCostCodesEntity } from '@libs/project/interfaces';
import { EstimateMainService } from '../../../containers/line-item/estimate-main-line-item-data.service';
@Injectable({
	providedIn: 'root'
})
export class EstimateMainCostUnitUpdateService {
	protected http = inject(HttpClient);
	private readonly gridDialog = inject(UiCommonGridDialogService);
	public readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected configurationService = inject(PlatformConfigurationService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly dataService = inject(EstimateMainResourceService);
	private readonly projectEntity = inject(ProjectMainDataService).getSelectedEntity();
	private readonly selectEntity= this.dataService.getSelectedEntity();
	private readonly estimateMainService = inject(EstimateMainService);

	public CostUnitUpdateData:CostUnitUpdateModule={
		IsUpdate:false,
		ProjectFk:this.projectEntity?.Id,
		ProjectName:this.projectEntity?.ProjectName,
		JobFk:this.selectEntity?.LgmJobFk,
		JobCode:'',
		JobDescription:'',
		Items:[],
		Materials:[]
	};
	/*
	*Open update cost/unit dialog
	 */
	public ShowDialog(){
		this.prepareFormData();
	}
	/*
	*Open select cost/unit dialog
	 */
	public async openGridDialog() {
		const gridDialogData: IGridDialogOptions<PrjCostCodesEntity> = {
			width: '70%',
			windowClass: 'grid-dialog',
			gridConfig: EstimateMainCostUnitCostCodeLayoutService.generateConfig(),
			items: this.CostUnitUpdateData.Items as PrjCostCodesEntity[],
			isReadOnly: false,
			allowMultiSelect: true,
			selectedItems:[]
		};

		await this.gridDialog.show(gridDialogData);

	}
	private prepareFormData(){
		this.GetCostUnitUpdateListData(this.selectEntity as IEstResourceEntity);

		const config:IFormDialogConfig<CostUnitUpdateModule>={
			headerText: {text: 'Cost/Unit Update'},
			formConfiguration: this.generateEditOptionRows(),
			showOkButton:true,
			customButtons: [
			// 	{
			// 	id: 'reset',
			// 	caption: 'Execute',
			// },
			],
			entity: this.CostUnitUpdateData,
			topDescription: '',
			width: '1000px',
			height: '550px'
		};
		this.formDialogService.showDialog(config)?.then((result: IEditorDialogResult<CostUnitUpdateModule>) => {
			if(result.closingButtonId === 'ok') {
				let postUrl = '';
				let postData={};
				if (this.CostUnitUpdateData.Items){
					postData =this.CostUnitUpdateData.Items;
				}
				if(this.selectEntity && this.selectEntity.EstResourceTypeFk === 2){
					postData = {
						PrjMaterial:this.CostUnitUpdateData.Items,
						IsUpdate:this.CostUnitUpdateData.IsUpdate,
						PrjMaterialPortionToSave:this.CostUnitUpdateData.Materials,
						PrjMatPrcConditionsToSave:this.CostUnitUpdateData.Materials
					};

					postUrl = 'project/material/updatejob';
				} else {
					postUrl = 'project/costcodes/job/rate/createorupdatejobrate';
				}

				 const queryPath = this.configurationService.webApiBaseUrl + postUrl;
				this.http.post(queryPath, postData).subscribe((res) => {
					this.estimateMainService.refreshAll();

				});
			}
		});

	}
	private async  GetCostUnitUpdateListData(entity:IEstResourceEntity){

		let listRoute = '',
			filterUrl = '';
		if (entity.EstResourceTypeFk === 2) {
			listRoute = 'project/material/listbymatiealid?';

			filterUrl = 'projectId=' + this.projectEntity?.Id + '&materialId=' + entity.MdcMaterialFk;
		} else {
			listRoute = 'project/costcodes/job/rate/getupdateprjcostcodesbyjobrate?';

			filterUrl = 'projectId=' + this.projectEntity?.Id + '&costCodeId=' + (entity.MdcCostCodeFk || 0) + '&code=' + (entity.Code);
		}
		filterUrl += '&jobFk=' + entity.LgmJobFk;

		this.http.get(this.configurationService.webApiBaseUrl + listRoute + filterUrl).subscribe(result => {
			const entitys = result;
			this.CostUnitUpdateData.Items = entitys;
		});
	}
	private async CheckJobCodeUnique(){
		await this.http.get(this.configurationService.webApiBaseUrl + 'logistic/job/isCodeUnique?code=' + this.CostUnitUpdateData.JobCode).subscribe(result => {
			if(result){
				this.messageBoxService.showInfoBox('estimate.main.costUnitUpdateCfg.jobcodeexist', 'info', true);
			}

		});
	}
	private generateEditOptionRows():IFormConfig<CostUnitUpdateModule>{
		let formRows: FormRow<CostUnitUpdateModule>[] = [];
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const server = this;
		formRows = [
			{
				id: 'isupdate',
				label: {
					text: 'Criteria Selection',
				},
				type: FieldType.Radio,
				model: 'IsUpdate',
				itemsSource: {
					items: [
						{
							id: false,
							displayName: 'estimate.main.costUnitUpdateCfg.updateCurrentJob',
						},
						{
							id: true,
							displayName: 'estimate.main.costUnitUpdateCfg.createNewJob',
						}
					]
				}
			},
			{
				id: 'projectfk',
				label: {
					text: 'Project Name',
				},
				type: FieldType.Lookup,
				model: 'ProjectFk',
				readonly:true,
				lookupOptions: createLookup({
					dataServiceToken: ProjectSharedLookupService,
					showDescription: true,
					showClearButton: true,
					descriptionMember: 'Description'
				})
			},
			{
				id: 'JobCode',
				label: {
					text: 'Job Code',
				},
				readonly:true,
				type: FieldType.Code,
				model: 'JobCode',
				change(){
					server.CheckJobCodeUnique();
				}
			},
			{
				id: 'JobDescription',
				label: {
					text: 'Job Description',
				},
				type: FieldType.Description,
				readonly:true,
				model: 'JobDescription'
			},
			{
				id: 'Detail',
				label: {
					text: 'Resource Details',
				},
				type: FieldType.Grid,
				configuration: EstimateMainCostUnitCostCodeLayoutService.generateConfig() as IGridConfiguration<object>,
				height: 70,
				model: 'Items'
			}
		];
		if(this.selectEntity && this.selectEntity.EstResourceTypeFk ===2){
			formRows.push({
				id: 'Material',
				type: FieldType.Grid,
				configuration: EstimateMainCostUnitMaterialLayoutService.generateConfig() as IGridConfiguration<object>,
				height: 70,
				model: 'Materials'
			});
		}
		const formConfig: IFormConfig<CostUnitUpdateModule> = {
			formId: 'editorOption',
			showGrouping: false,
			addValidationAutomatically: true,
			rows: formRows
		};
		return formConfig;
	}

}

 interface CostUnitUpdateModule{
	 // eslint-disable-next-line no-mixed-spaces-and-tabs
 	IsUpdate:boolean;
	ProjectFk:number| undefined;
	ProjectName:string | null | undefined;
	JobFk:number|null| undefined;
	JobCode:string | null | undefined;
	JobDescription:string | null | undefined;
	Items:object;
	Materials:object;
}