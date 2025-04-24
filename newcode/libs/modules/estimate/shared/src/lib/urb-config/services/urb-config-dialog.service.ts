/*
 * Copyright(c) RIB Software GmbH
 */

import { EventEmitter, inject, Injectable } from '@angular/core';
import { createLookup, FieldType, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { IUrbConfigEntity } from '../model/urb-config-entity.interface';
import { BasicsSharedEstUppConfigTypeLookupService } from '@libs/basics/shared';
import { clone, filter, forEach,  merge } from 'lodash';
import { EstimateSharedUrbConfigGridWrapperComponent } from '../components/urb-config-grid-wrapper/urb-config-grid-wrapper.component';
import { ValidationResult } from '@libs/platform/data-access';
import { IBasicsCustomizeEstUppConfigTypeEntity } from '@libs/basics/interfaces';
import { HttpClient } from '@angular/common/http';
import { IDescriptionInfo, PlatformConfigurationService } from '@libs/platform/common';
import { EstSharedConfigDialogConfigTypeService } from './urb-config-dialog-config-type.service';
import { EstimateShareLeadingStructureLookupService } from '../../lookups';
import { EstShareUrbConfigGridWrapperDataService } from '../components/urb-config-grid-wrapper/urb-config-grid-wrapper-data.service';
import { IEstimateSharedLeadingStructureEntity } from '@libs/estimate/interfaces';

@Injectable({ providedIn: 'root' })
/**
 *  BasicsShareBoqUrpConfigDialogService
 *  This services to open Boq Urp config dialog
 */
export class EstimateShareUrbConfigDialogService {
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly http = inject(HttpClient);
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly urlConfigTypeService = inject(EstSharedConfigDialogConfigTypeService);
	private readonly structureService = inject(EstimateShareLeadingStructureLookupService);
	private readonly urbWrapperDataService = inject(EstShareUrbConfigGridWrapperDataService);

	private dialogConfig: IFormConfig<IUrbConfigEntity> = {
		formId: 'estimate.main.boqUrpConfig',
		showGrouping: true,
		groups: [
			{
				groupId: 'estBoq',
				header: { key: 'estimate.main.estConfigEstBoqUppGroup' },
				open: true
			}, {
				groupId: 'estUpp',
				header: { key: 'estimate.main.unitPricePortion' },
				open: true
			}, {
				groupId: 'urb',
				header: { key: 'boq.main.UrBreakdown' },
				open: false,
				visible: false
			}
		],
		rows:[
			{
				groupId: 'estBoq',
				id: 'BoqId',
				label: {key: 'estimate.main.boqContainer'},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: EstimateShareLeadingStructureLookupService,
					showDialog: false,
					showGrid: false,
					clientSideFilter: {
						execute: (item: IEstimateSharedLeadingStructureEntity) : boolean => item.EstStructureId == 1
					}
				}),
				model: 'BoqHeaderId',
				sortOrder: 2,
				validator: info => {
					this.entity.BoqHeaderId = info.value? info.value as number : null;
					if(this.entity.BoqHeaderId){
						const boqHeaderId = this.structureService.getRootItemIdByI(this.entity.BoqHeaderId);
						this.http.get(this.configurationService.webApiBaseUrl + 'estimate/main/estboq2uppconfig/getestboq2uppconfig?estHeaderId='+this.entity.EstHeaderId+'&boqHeaderId=' + boqHeaderId).subscribe(res =>{
							if(res){
								const boq2UrbConfig: {
									EstUppConfigFk?: number | null,
									EstUppConfigtypeFk?: number | null
								}= {};
								merge(boq2UrbConfig, res);
								this.entity.EstUppConfigTypeFk = boq2UrbConfig.EstUppConfigtypeFk;
								this.entity.EstUppConfigFk = boq2UrbConfig.EstUppConfigFk;
								if(boq2UrbConfig.EstUppConfigFk || boq2UrbConfig.EstUppConfigtypeFk) {
									this.entity.EntityChange.emit();
								}
							}else{
								this.entity.EstUppConfigTypeFk = null;
								this.entity.EstUppConfigFk = null;
								this.entity.EntityChange.emit();
							}
						});
					}

					return new ValidationResult();
				}
			},
			{
				groupId: 'estUpp',
				id: 'estUppType',
				label: {key: 'estimate.main.estUppType'},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
						dataServiceToken: BasicsSharedEstUppConfigTypeLookupService,
						showClearButton: false,
						clientSideFilter: {
							execute(item: IBasicsCustomizeEstUppConfigTypeEntity): boolean {
								return item.ContextFk === 4;
							}
						}
					}),
				model: 'EstUppConfigTypeFk',
				sortOrder: 2,
				validator: info => {
					info.entity.EstUppConfigTypeFk = info.value? info.value as number : null;
					info.entity.EntityChange.emit();
					return new ValidationResult();
				}
			},
			{
				groupId: 'estUpp',
				id: 'estUppEditType',
				label: {key: 'estimate.main.estUppEditType'},
				type: FieldType.Boolean,
				model: 'IsEditUppType',
				sortOrder: 2,
				validator: info => {
					if(info.value){
						info.entity.EstUppConfigTypeFk = null;
					}
					return new ValidationResult();
				}
			},
			{
				groupId: 'estUpp',
				id: 'estUppConfigDesc',
				label: {key: 'cloud.common.entityDescription'},
				type: FieldType.Description,
				model: 'UppConfigDesc',
				sortOrder: 2
			},
			{
				groupId: 'estUpp',
				id: 'estUppDetail',
				label: {key: 'estimate.main.uppDetails'},
				type: FieldType.CustomComponent,
				componentType: EstimateSharedUrbConfigGridWrapperComponent,
				sortOrder: 2
			},

			{
				groupId: 'urb',
				id:'ed1',
				label: {
					key : 'boq.main.Urb1',
				},
				type: FieldType.InputSelect,
				model:'NameUrb1',
				options: {
					items: [
						{
							description: 'Wage',
							id: 1,
							isLive: true,
							remark: 'Wage',
							sorting: 1,
							version: 1,
						},
					],
					//serviceName:'BoqUrBreakdownService', //TODO-BOQ: Questions asked on Teams channel for usage of serviceName and seems functionality pending from framework side
					//serviceMethod:'test',
					inputDomain: 'Description',
				},
			},
			{
				groupId: 'urb',
				id:'ed2',
				label: {
					key : 'boq.main.Urb2',
				},
				type: FieldType.InputSelect,
				model:'NameUrb2',
				options: {
					items: [
						{
							description: 'Wage',
							id: 1,
							isLive: true,
							remark: 'Wage',
							sorting: 1,
							version: 1,
						},
					],
					//serviceName:'BoqUrBreakdownService', //TODO-BOQ: Questions asked on Teams channel for usage of serviceName and seems functionality pending from framework side
					//serviceMethod:'test',
					inputDomain: 'Description',
				},
			},
			{
				groupId: 'urb',
				id:'ed3',
				label: {
					key : 'boq.main.Urb3',
				},
				type: FieldType.InputSelect,
				model:'NameUrb3',
				options: {
					items: [
						{
							description: 'Wage',
							id: 1,
							isLive: true,
							remark: 'Wage',
							sorting: 1,
							version: 1,
						},
					],
					//serviceName:'BoqUrBreakdownService', //TODO-BOQ: Questions asked on Teams channel for usage of serviceName and seems functionality pending from framework side
					//serviceMethod:'test',
					inputDomain: 'Description',
				},
			},
			{
				groupId: 'urb',
				id:'ed4',
				label: {
					key : 'boq.main.Urb4',
				},
				type: FieldType.InputSelect,
				model:'NameUrb4',
				options: {
					items: [
						{
							description: 'Wage',
							id: 1,
							isLive: true,
							remark: 'Wage',
							sorting: 1,
							version: 1,
						},
					],
					//serviceName:'BoqUrBreakdownService', //TODO-BOQ: Questions asked on Teams channel for usage of serviceName and seems functionality pending from framework side
					//serviceMethod:'test',
					inputDomain: 'Description',
				},
			},
			{
				groupId: 'urb',
				id:'ed5',
				label: {
					key : 'boq.main.Urb5',
				},
				type: FieldType.InputSelect,
				model:'NameUrb5',
				options: {
					items: [
						{
							description: 'Wage',
							id: 1,
							isLive: true,
							remark: 'Wage',
							sorting: 1,
							version: 1,
						},
					],
					//serviceName:'BoqUrBreakdownService', //TODO-BOQ: Questions asked on Teams channel for usage of serviceName and seems functionality pending from framework side
					//serviceMethod:'test',
					inputDomain: 'Description',
				},
			},
			{
				groupId: 'urb',
				id:'ed6',
				label: {
					key : 'boq.main.Urb6',
				},
				type: FieldType.InputSelect,
				model:'NameUrb6',
				options: {
					items: [
						{
							description: 'Wage',
							id: 1,
							isLive: true,
							remark: 'Wage',
							sorting: 1,
							version: 1,
						},
					],
					//serviceName:'BoqUrBreakdownService', //TODO-BOQ: Questions asked on Teams channel for usage of serviceName and seems functionality pending from framework side
					//serviceMethod:'test',
					inputDomain: 'Description',
				},
			},
			{
				groupId: 'urb',
				id: '7',
				label: {
					key : 'boq.main.urCalcByURB',
				},
				type: FieldType.Boolean,
				model: 'CalcFromUrb',
			},
		]
	};

	private entity: IUrbConfigEntity = {
		IsEditUppType: false,
		UppConfigDesc: '',
		OpenFromEstBoq: false,
		OpenFromCreateBid: false,
		IsForCustomization: false,
		EntityChange: new EventEmitter<null>
	};

	/*
	 *  open this dialog from estimate
	 */
	public openEstBoqUrbConfigDialog(estHeaderId: number, projectId: number, boqHeaderId?: number|null){

		if(!estHeaderId || !projectId){
			this.messageBoxService.showInfoBox('estimate.main.estConfigDialogLoadEstimate', 'estimate.main.estConfigDialogTitle', true);
			return;
		}
		this.structureService.loadList().then(d=>{
			this.urlConfigTypeService.loadList(true).then(res =>{
				//TODO: just for test
				// projectId = 1001548;
				this.http.get(this.configurationService.webApiBaseUrl + 'boq/project/list?projectId=' + projectId).subscribe(boqs =>{
					const boqRootItems: {
						Id: number,
						BriefInfo: IDescriptionInfo,
						Reference: string,
						BoqHeaderFk: number
					}[] = [];

					if(boqs){
						forEach(boqs, boq=>{
							if('BoqRootItem' in boq){
								boqRootItems.push( boq.BoqRootItem as {
									Id: number,
									BriefInfo: IDescriptionInfo,
									Reference: string,
									BoqHeaderFk: number
								});
							}
						});
					}

					if(!boqHeaderId && boqRootItems.length > 0){
						boqHeaderId = boqRootItems[0].BoqHeaderFk;
					}

					const dialogConfig = clone(this.dialogConfig);
					dialogConfig.groups = filter(dialogConfig.groups,(item) => item.groupId !== 'urb');
					dialogConfig.rows = filter(dialogConfig.rows,(item) => item.groupId !== 'urb');

					this.entity.ProjectId = projectId;
					this.entity.BoqHeaderId = this.structureService.getIdByRootItemId(boqHeaderId||0);
					this.entity.EstHeaderId = estHeaderId;
					this.entity.OpenFromEstBoq = true;
					this.entity.OpenFromCreateBid = false;
					this.entity.IsForCustomization = false;

					this.http.get(this.configurationService.webApiBaseUrl + 'estimate/main/estboq2uppconfig/getestboq2uppconfig?estHeaderId='+estHeaderId+'&boqHeaderId=' + boqHeaderId).subscribe(boq2UrbConf =>{
						if(boq2UrbConf){
							const boq2UrbConfig: {
								EstUppConfigFk?: number | null,
								EstUppConfigtypeFk?: number | null
							}= {};
							merge(boq2UrbConfig, boq2UrbConf);
							this.entity.EstUppConfigTypeFk = boq2UrbConfig.EstUppConfigtypeFk;
							this.entity.EstUppConfigFk = boq2UrbConfig.EstUppConfigFk;
						}

						this.formDialogService.showDialog<IUrbConfigEntity>({
							id: 'UrbConfigDialog',
							headerText: {key: 'estimate.main.estConfigEstBoqUppTitle'},
							formConfiguration: dialogConfig,
							entity: this.entity,
							width: '1000px',
						})?.then(result =>{
							if(result?.closingButtonId === StandardDialogButtonId.Ok){
								 const entity = result.value as IUrbConfigEntity;
								entity.IsUpdUpp = !!entity.EstUppConfig;
								 if(entity.IsEditUppType){
									 entity.IsDefaultUpp = false;
									 entity.EstUpp2CostCodeDetails = this.urbWrapperDataService.getUpdatedList();
									 if(!entity.EstUppConfig || (this.entity.BoqHeaderId && this.entity.EstUppConfigTypeFk)){
											entity.IsUpdUpp = false;
											entity.EstUppConfig = {
												DescriptionInfo: {}
											};
									 }

									 merge(entity.EstUppConfig, {
										 DescriptionInfo: {
											 Description: entity.UppConfigDesc,
											 Translated: entity.UppConfigDesc,
											 Modified: true
										 }
									 });
								 }else{
									 entity.IsDefaultUpp = true;
								 }

								 this.http.post(this.configurationService.webApiBaseUrl + 'estimate/main/completeconfig/update', entity);
							}
							this.entity = {
								IsEditUppType: false,
								UppConfigDesc: '',
								OpenFromEstBoq: false,
								OpenFromCreateBid: false,
								IsForCustomization: false,
								EntityChange: new EventEmitter<null>
							};
						});
					});
				});
			});
		});
	}

	/*
	 *  open this dialog from customize
	 */
	public openCustomizeUrbConfig(){
		this.urlConfigTypeService.loadList(true).then(res=>{
			this.entity.OpenFromEstBoq = false;
			this.entity.OpenFromCreateBid = false;
			this.entity.IsForCustomization = true;
			this.entity.IsEditUppType = true;

			const dialogConfig = clone(this.dialogConfig);
			dialogConfig.groups = filter(dialogConfig.groups,(item) => item.groupId !== 'urb' && item.groupId !== 'estBoq');
			dialogConfig.rows = filter(dialogConfig.rows,(item) => item.groupId !== 'urb' && item.groupId !== 'estBoq' && item.id !== 'estUppEditType');

			this.formDialogService.showDialog<IUrbConfigEntity>({
				id: 'UrbConfigDialog',
				headerText: {key: 'estimate.main.estConfigEstBoqUppTitle'},
				formConfiguration: dialogConfig,
				entity: this.entity,
				width: '900px',
			})?.then(result =>{
				if(result?.closingButtonId === StandardDialogButtonId.Ok){
					console.log('ok!');
				}
			});
		});
	}

	public getUrbConfig4CreateBid(){
		return clone(this.dialogConfig);
	}

}