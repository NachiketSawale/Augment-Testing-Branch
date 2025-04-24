/*
 * Copyright(c) RIB Software GmbH
 */

import {
	DataServiceFlatNode,
	IDataServiceEndPointOptions,
	IDataServiceOptions, IDataServiceRoleOptions, ServiceRole
} from '@libs/platform/data-access';
import { ProjectEntity, ProjectMainDataService } from '@libs/project/shared';
import {
	AssemblyDataServiceMixin,
} from '@libs/estimate/shared';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { IProjectComplete, IProjectPlanAssemblyRequest } from '@libs/project/interfaces';
import { IIdentificationData } from '@libs/platform/common';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ProjectPlantAssemblyEntityComplete } from '../../model/interfaces/project-plant-assembly-entity-complete.class';

@Injectable({
	providedIn: 'root'
})
export class ProjectPlantAssemblyMainService extends AssemblyDataServiceMixin(DataServiceFlatNode<IEstLineItemEntity, ProjectPlantAssemblyEntityComplete, ProjectEntity, IProjectComplete>){

	private showFilterBtn = false;
	private jobIds : number[] = [];
	private initFilterMenuFlag = true;
	private isManuallyFilter = false;

	/**
	 * Constructor that initializes the service with the necessary options
	 */
	public constructor(private parentService : ProjectMainDataService) {
		const options: IDataServiceOptions<IEstLineItemEntity> = {
			apiUrl: 'estimate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'assemblies/listfiltered',
				usePost: true
			},
			createInfo: {
				endPoint: 'assemblies/create',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IEstLineItemEntity>>{
				role: ServiceRole.Node,
				itemName: 'PrjPlantAssembly',
				parent: parentService
			},
			converter: {
				convert(entity: IEstLineItemEntity): IIdentificationData | null {
					return {
						id: entity.Id,
						pKey1: entity.EstHeaderFk
					};
				}
			}
		};

		super(options);
	}

	/**
	 * Override the provideCreatePayload
	 */
	public override provideCreatePayload(): object {
		const creationData = this.createPayload();
		_.set(creationData, 'IsPrjPlantAssembly', true);
		if(this.getSelectedParent()){
			_.set(creationData, 'ProjectId', this.getSelectedParent()!.Id);
		}
		//TODO: waiting for <estimateAssembliesCreationService>
		//this.estimateAssembliesCreationService.processItem(creationData);
		return creationData;
	}

	protected override provideLoadPayload(): object{
		const readData = {} as IProjectPlanAssemblyRequest;
		readData.furtherFilters =  [{Token:'PROJECT_PLANT_ASSEMBLY', Value: 'true'}];

		const selectedItem = this.getSelectedParent();
		if (selectedItem && selectedItem.Id > 0) {
			readData.ProjectId  = selectedItem.Id;
			readData.furtherFilters.push({Token: 'FILTER_BY_STRUCTURE:PROJECT', Value: selectedItem.Id});
		}
		readData.ProjectContextId = readData.ProjectId;

		if(this.jobIds && this.jobIds.length) {
			readData.furtherFilters.push ({
				Token: 'FILTER_BY_STRUCTURE:' + 'JOB',
				Value: this.jobIds.toString()
			});
		}

		if(this.initFilterMenuFlag && !this.isManuallyFilter) {
			readData.furtherFilters.push ({
				Token: 'initFilterMenuFlag',
				Value: 'true'
			},{
				Token: 'FILTER_BY_STRUCTURE:' + 'JOB',
				Value: 'BaseAssembly'
			});
		}

		//TODO: <projectPlantAssemblyFilterService> missing
		//$injector.get('projectPlantAssemblyFilterService').setFilterRequest(readData);

		return readData;
	}

	protected override onCreateSucceeded?(created: object): IEstLineItemEntity{
		return created as IEstLineItemEntity;
	}

	protected override onLoadSucceeded(loaded: object): IEstLineItemEntity[] {
		if (loaded) {
			return _.get(loaded, 'dtos', []);
		}
		return [];
	}

	public override createUpdateEntity(modified: IEstLineItemEntity | null): ProjectPlantAssemblyEntityComplete {
		return new ProjectPlantAssemblyEntityComplete(modified);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: IProjectComplete, modified: ProjectPlantAssemblyEntityComplete[], deleted: IEstLineItemEntity[]): void {
		if (modified && modified.length) {
			_.set(parentUpdate, 'PrjPlantAssemblyToSave', modified);
		}
		if (deleted && deleted.length) {
			_.set(parentUpdate, 'PrjPlantAssemblyToDelete', deleted);
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: IProjectComplete): IEstLineItemEntity[]{
		if (parentUpdate && 'PrjPlantAssemblyToSave' in parentUpdate) {
			return parentUpdate.PrjPlantAssemblyToSave as IEstLineItemEntity[];
		}
		return [];
	}

	public setShowFilterBtn(value: boolean){
		this.showFilterBtn = value;
	}

	public getShowFilterBtn() {
		return this.showFilterBtn;
	}

	public setIsManuallyFilter(value: boolean){
		this.isManuallyFilter = value;
	}

	public setInitFilterMenuFlag(value: boolean){
		this.initFilterMenuFlag = value;
	}

	public getInitFilterMenuFlag(){
		return this.initFilterMenuFlag;
	}

	public clear() {
		this.jobIds = [];
		this.showFilterBtn = false;
	}

	public setReadOnlyByVersionJob(plantAssemblies: IEstLineItemEntity[]){
		const versionEstHeaderJobIds : number[] = [];//TODO: <projectCommonFilterButtonService> missing; $injector.get ('projectCommonFilterButtonService').getJobFksOfVersionEstHeader();
		plantAssemblies.forEach((plantAssembly) => {
			const readOnly = !!(plantAssembly.LgmJobFk && versionEstHeaderJobIds.includes(plantAssembly.LgmJobFk));
			plantAssembly.readOnlyByJob = readOnly;
			if(readOnly) {
				const fields = [];
				_.forOwn(plantAssembly, function (value, key) {
					const field = {field: key, readonly: readOnly};
					fields.push(field);
				});

				fields.push ({field: 'Rule', readonly: plantAssembly.readOnlyByJob});
				fields.push ({field: 'Param', readonly: plantAssembly.readOnlyByJob});
				fields.push ({field: 'MdcCostCodeFk', readonly: plantAssembly.readOnlyByJob});

				//TODO:<platformRuntimeDataService> missing
				//platformRuntimeDataService.readonly(plantAssembly, fields);
			}
		});
	}

	public setSelectedJobsIds(ids: number[]){
		this.jobIds = Array.from(new Set(this.jobIds));
		this.jobIds = _.orderBy(this.jobIds);
	}

	public loadFilterMenu(highlightJobIds: number[]) {
		//TODO: <projectCommonFilterButtonService> missing
		//return $injector.get ('projectCommonFilterButtonService').initFilterMenu (service,highlightJobIds);
	}
}