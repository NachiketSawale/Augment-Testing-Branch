/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IIdentificationData, ServiceLocator } from '@libs/platform/common';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import {
	IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, IEntityModification,
	IEntitySelection,
	ServiceRole,
	ValidationInfo
} from '@libs/platform/data-access';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import * as _ from 'lodash';
import { EstimateResourceBaseDataService } from '../../line-item/services/estimate-resource-base-date.service';
import { IEstimateCreationData } from '@libs/estimate/interfaces';
import {
	IEstResourceCharacteristicEntity
} from '@libs/estimate/interfaces';
import { EstimateMainResourceType } from '../../common/enums/estimate-main-resource-type.enum';
import { ICostCodeEntity } from '@libs/basics/interfaces';
import { IMaterialSearchEntity } from '@libs/basics/shared';
import { EstimateResourceBaseProcessService } from '../../line-item/services/estimate-resource-base-process.service';
import { inject } from '@angular/core';
import { AssemblyCalculationService } from '../../calculation/services/assembly-calculation.service';
import { IAssemblyDataService, IAssemblyResourceDataService } from '../model/assembly-data-service.interface';
import { EstimateAssembliesResourceBaseValidationService } from './estimate-assemblies-resource-base-validation.service';

/**
 * Abstract class for Assembly Resource Base Data Service
 *
 * @template T - Resource base entity type
 * @template U - Complete identification type for T
 * @template PT - Parent line item base entity type
 * @template PU - Complete identification type for PT
 */
export abstract class EstimateAssembliesResourceBaseDataService<
	T extends IEstResourceEntity,
	U extends CompleteIdentification<T>,
	PT extends IEstLineItemEntity,
	PU extends CompleteIdentification<PT>
> extends EstimateResourceBaseDataService<T, U, PT, PU> implements IAssemblyResourceDataService{

	private readonly oldNewResourceMapping : { [key: number]: number} = {};
	private costCodeLookupSelectedItems : ICostCodeEntity[] | null = null;
	private materialLookupSelectedItems : IMaterialSearchEntity[] | null = null;
	protected abstract getProjectId(): number|null;
	protected abstract isInProjectModule(): boolean;
	protected abstract createAssemblyResourceRequestObj(assemblyItem: PT, assemblyIds: number[], resourceType: number, prjCostCodeIds?: number[]|null):object;

	private readonly assemblyCalculationService = inject(AssemblyCalculationService);
	protected readonly assemblyResourceProcessor: EstimateResourceBaseProcessService<T>;
	protected readonly assemblyDataService : IEntitySelection<PT> & IEntityModification<PT> & IAssemblyDataService;

	/**
	 * Constructor
	 *
	 * @param parentDataService Parent data service reference
	 * @param options Options including the item name
	 */
	protected constructor(parentDataService: IEntitySelection<PT> & IEntityModification<PT> & IAssemblyDataService, options: { itemName: string }) {
		const dataServiceOptions:IDataServiceOptions<T> = {
			apiUrl: 'estimate/main/resource',
			readInfo:<IDataServiceEndPointOptions> {
				endPoint: 'tree',
				usePost: true,
				prepareParam: (ident: IIdentificationData) => {
					// Prepare read params based on parent selection
					const selected = this.getSelectedParent();
					return selected ? { estHeaderFk: selected.EstHeaderFk, estLineItemFk: selected.Id } : {};
				}
			},
			updateInfo:<IDataServiceEndPointOptions> {
				endPoint: 'update',
				usePost: true
			},
			roleInfo:<IDataServiceRoleOptions<T>> {
				role: ServiceRole.Node,
				itemName: options.itemName,
				parent: parentDataService
			}
		};

		super(parentDataService, dataServiceOptions);
		this.assemblyDataService = parentDataService;
		this.assemblyResourceProcessor = new EstimateResourceBaseProcessService<T>(this);
		this.processor.addProcessor(this.assemblyResourceProcessor);
		this.assemblyDataService.setAssemblyResourceDataService(this);
	}

	protected override onCreateSucceeded(created: object): T {
		// add empty user defined column value to new item.
		//TODO: <assemblyResourceDynamicUserDefinedColumnService> is missing
		// if(assemblyResourceDynamicUserDefinedColumnService){
		// 	let resourceUserDefinedColumnService = $injector.get(assemblyResourceDynamicUserDefinedColumnService);
		// 	resourceUserDefinedColumnService.attachEmptyDataToColumn(newData);
		// }
		return created as T;
	}

	/**
	 *
	 * @protected
	 */
	protected override provideCreatePayload(): object {
		const selectedItem = this.getSelectedParent();
		const selectedResourceItem = this.getSelectedEntity();
		const creationData = {} as IEstimateCreationData;
		if (selectedResourceItem && selectedResourceItem.Id > 0) {
			creationData.resourceItemId = creationData.parentId ? creationData.parentId : 0;
			creationData.estHeaderFk = selectedResourceItem.EstHeaderFk;
			creationData.estLineItemFk = selectedResourceItem.EstLineItemFk;
		} else if (selectedItem && selectedItem.Id > 0) {
			creationData.estHeaderFk = selectedItem.EstHeaderFk;
			creationData.estLineItemFk = selectedItem.Id;
		}
		if (selectedResourceItem) {
			creationData.sortNo = this.estimateMainGenerateSortingService.generateSorting(selectedResourceItem, this.getList(), creationData);
		}
		return creationData;
	}

	/**
	 * Provides the payload for loading data.
	 * This payload includes information about the selected parent entity.
	 *
	 * @returns An object containing the payload for data loading.
	 * @throws An error if there is no selected parent entity.
	 */
	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				estLineItemFk: parentSelection.Id,
				estHeaderFk: parentSelection.EstHeaderFk,
				projectId: this.getProjectId()
			};
		} else {
			throw new Error('There should be a selected parent catalog to load the scope detail price condition data');
		}
	}

	public override registerByMethod(): boolean {
		return true;
	}

	protected beforeDelete?(entities: T[]): void{
		//override it to handle Characteristics and UDP
	}

	/**
	 * delete entities and its children
	 * @param entities
	 */
	public override delete(entities: T[]) {
		if(this.beforeDelete){
			this.beforeDelete(entities);
		}
		super.delete(entities as T[]);

		//recalculate assembly
		const selectedAssembly = this.getSelectedParent();
		if(selectedAssembly){
			this.assemblyCalculationService.loadCompositeAssemblyResources(this.flatList()).then(() =>{
				this.calculateAssemblyResource(selectedAssembly, this.getList());
				//TODO: refresh estimateAssembliesService
				// estimateAssembliesService.fireItemModified(selectedAssembly);
				// estimateAssembliesService.gridRefresh();
			});
		}
	}

	/**
	 * Handles the loaded data after a successful load operation.
	 * Extracts the resource entities from the loaded object and returns them as an array.
	 *
	 * @param loaded The loaded object containing the resource data.
	 * @returns An array of IEstResourceEntity extracted from the loaded object.
	 */
	protected override onLoadSucceeded(loaded: object): T[] {
		if (loaded) {
			return _.get(loaded, 'dtos', []);
		}
		return [];
	}

	public override canCreate(): boolean{
		const selectedAssembly = this.getSelectedParent();
		return !!(selectedAssembly && selectedAssembly.Id > 0 && !selectedAssembly.readOnlyByJob);
	}

	public override canCreateChild(): boolean{
		const selectedRes = this.getSelectedEntity();
		return (this.canCreate() && !(selectedRes && selectedRes.EstResourceTypeFk !== EstimateMainResourceType.SubItem));
	}

	public override canDelete(): boolean {
		return this.canCreate();
	}

	/**
	 * equal to updateDone
	 * @param resources
	 */
	public handleUpdateDone(resources: T[]): void {
		if (resources) {
			//TODO: this equal to handleUpdateDone
			this.updateEntities(resources);
			this.estimateMainResourceImageProcessor.processItems(this.flatList());
			//TODO: not sure why need this
			//serviceContainer.data.itemListOriginal = angular.copy(itemListOriginal);
		}
	}

	/**
	 * calculate Assembly and its resources
	 * @param assemblyItem
	 * @param assemblyResources
	 */
	public calculateAssemblyResource(assemblyItem: PT | null, assemblyResources: T[] | null){
		if(!assemblyItem || !assemblyResources){
			return;
		}
		this.assemblyCalculationService.calculateLineItemAndResources(assemblyItem, assemblyResources);
		this.parentDataService.setModified(assemblyItem);
		this.markItemsAsModified(assemblyResources);
	}

	/**
	 * get assembly resources
	 * @param requestData
	 */
	public getAssemblyResourcesRequest(requestData: object){
		return new Promise<IEstResourceCharacteristicEntity>(resolve => {
			this.http.post<IEstResourceCharacteristicEntity>(this.configurationService.webApiBaseUrl + 'estimate/main/resource/getresourcestoassembly', requestData).subscribe((data) =>{
				//TODO: <processResolvedItems> is not support
				//processResolvedItems(data.resources);
				resolve(data);
			});
		});
	}

	public async resolveResourcesAndAssign(assemblyItem: PT, assemblyIds: number[], resourceType: number, prjCostCodeIds?: number[]|null){
		const selectedResource = this.getSelectedEntity();
		const subItemToAssign = selectedResource ? this.parentOf(selectedResource) : null;
		if(!selectedResource){
			return false;
		}
		return this.getAssemblyResourcesRequest(this.createAssemblyResourceRequestObj(assemblyItem, assemblyIds, resourceType, prjCostCodeIds)).then((data) => {
			const resourceTrees = (data.resources || []) as T[]; // Array of list resources
			//TODO: UserDefinedcolsOfResource is not support now
			//const userDefinedCostValueList = data.UserDefinedcolsOfResource;

			// Follow this order to process list resources
			this.clearValidationFromCurrentResource(selectedResource);
			this.buildNodeInfo(selectedResource, resourceTrees, subItemToAssign);
			if(assemblyIds.length && resourceTrees.length){
				this.mergeCurrentResource(selectedResource, resourceTrees, assemblyIds[0], resourceType,resourceType === 1 ? resourceTrees[0].ProjectCostCodeFk:null);
			}
			this.setAssemblyResourcesTreeToContainerData(resourceTrees, subItemToAssign, null, selectedResource);
			//TODO: charactiristic is not support
			//setResourceCharacteristics(data.resourcesCharacteristics || []);

			// if (!option.isPrjPlantAssembly) {
			// 	estimateAssembliesCalculationService.loadCompositeAssemblyResources(service.getList()).then(function(data){
			// 		// multi select assemblies to create resources.
			// 		let resList = service.getList();
			// 		_.each(resList, function (resItem){
			// 			if (resItem.EstAssemblyFk) {
			// 				let findItem = _.find(resourceTrees, {'Id': resItem.Id});
			// 				if (findItem) {
			// 					let lineItem = _.find(data, {'Id': resItem.EstAssemblyFk});
			// 					if (lineItem) {
			// 						$injector.get('estimateMainCommonService').extractSelectedItemProp(lineItem, resItem, true);
			// 					}
			// 				}
			// 			}
			// 		});
			// 	});
			// }

			// Attach user defined price value to resoruce
			//TODO: userDefinedCostValueList is not support
			// if(angular.isArray(userDefinedCostValueList)){
			// 	// update merged resource id to UserDefinedcolsOfResource
			// 	userDefinedCostValueList.forEach(function(item){
			// 		var newId = oldNewResourceMapping[item.Pk3];
			// 		if(newId && newId > 0){
			// 			item.Pk3 = newId;
			// 		}
			// 	});
			//
			// 	setUserDefinedColToResource(assemblyItem, resourceTrees, userDefinedCostValueList);
			// 	clearOldNewResourceMapping();
			// }

			// Lastly calculate totals and validate sub items
			this.calculateAssemblyResource(assemblyItem, this.getList());

			// Refresh views
			//TODO: refresh parent container
			//estimateAssembliesService.gridRefresh();
			//service.gridRefresh();

			return true;
		});
	}

	public clearValidationFromCurrentResource(resource: IEstResourceEntity){
		const estimateAssembliesResourceBaseValidationService = ServiceLocator.injector.get(EstimateAssembliesResourceBaseValidationService);
		if (resource){
			//TODO: waiting for <estimateAssembliesResourceValidationService>
			// let estimateAssembliesResourceValidationService = $injector.get('estimateAssembliesResourceValidationService');
			// $injector.get('platformRuntimeDataService').applyValidationResult(true, resource, 'Code');
			// $injector.get('platformDataValidationService').removeFromErrorList(resource, 'Code', estimateAssembliesResourceValidationService, service);
			const validationInfo: ValidationInfo<IEstResourceEntity>=new ValidationInfo<IEstResourceEntity>(resource,resource.Code,'Code');
		   const resultValidation= estimateAssembliesResourceBaseValidationService.validateCode(validationInfo);
		   if(resultValidation.valid){

			     this.addInvalid(resource as T,{result:resultValidation,field:'Code'});
		   }
			
		}
	}

	public mergeCurrentResource(resource: IEstResourceEntity, items: IEstResourceEntity[], mainResourceId: number, resTypeId: number, prjCostCodeFk: number|null){
		// items : Array of treeItems
		if (resource){
			let resToUpdate : IEstResourceEntity | null | undefined = null;
			// Pick the first assembly and merged it to the selected resource
			switch (resTypeId){
				case 1: // CostCode
					if(prjCostCodeFk) {
						resToUpdate = _.find(items, {ProjectCostCodeFk: prjCostCodeFk});
					}else {
						resToUpdate = _.find(items, {MdcCostCodeFk: mainResourceId});
					}
					break;
				case 2: // Material
					resToUpdate = _.find(items, {MdcMaterialFk: mainResourceId});
					break;
				case 4: // Assembly
					resToUpdate = _.find(items, {EstAssemblyFk: mainResourceId});
					break;
			}

			if (resToUpdate){
				// Keep the id and relation id
				this.oldNewResourceMapping[resToUpdate.Id] = resource.Id;

				resToUpdate.Id = resource.Id;
				resToUpdate.EstResourceFk = resource.EstResourceFk;

				if (resToUpdate.HasChildren){
					_.forEach(resToUpdate.EstResources, function(rUpdate){
						rUpdate.EstResourceFk = resource.Id;
					});
				}
				Object.assign(resource, resToUpdate);
			}
		}
	}

	public getAssemblyLookupSelectedItems(entity: T, assemblySelectedItems: PT[]){
		const assemblyItem = this.getSelectedParent();
		if (assemblyItem && !_.isEmpty(assemblySelectedItems) && _.size(assemblySelectedItems) > 1){
			this.resolveResourcesAndAssign(assemblyItem, _.map(assemblySelectedItems, 'Id'), EstimateMainResourceType.Assembly);
		}
	}

	public getPlantAssemblyLookupSelectedItems(entity: T, plantAssemblySelectedItems: PT[]) {
		const assemblyItem = this.getSelectedParent();
		if (assemblyItem && !_.isEmpty(plantAssemblySelectedItems) && _.size(plantAssemblySelectedItems) > 1) {
			this.resolveResourcesAndAssign(assemblyItem, _.map(plantAssemblySelectedItems, 'Id'), EstimateMainResourceType.Plant);
		}
	}

	public getCostCodeLookupSelectedItems(entity: T, costCodeSelectedItems: ICostCodeEntity[]){
		const assemblyItem = this.getSelectedParent();
		if (assemblyItem && !_.isEmpty(costCodeSelectedItems) && _.size(costCodeSelectedItems) > 1){
			const costCodeIds = _.map(costCodeSelectedItems, 'Id');
			const prjCostCodeIds : number[] | null =  null;
			if(this.isInProjectModule()) {
				//TODO: IsOnlyProjectCostCode property missing
				//costCodeIds = _.map(_.filter(costCodeSelectedItems, e => !e.IsOnlyProjectCostCode), 'OriginalId');
				//prjCostCodeIds = _.map(_.filter(costCodeSelectedItems, e => !!e.IsOnlyProjectCostCode), 'OriginalId');
			}
			this.costCodeLookupSelectedItems = costCodeSelectedItems;
			this.resolveResourcesAndAssign(assemblyItem, costCodeIds, EstimateMainResourceType.CostCode, prjCostCodeIds);
		}
	}

	public getMaterialLookupSelectedItems(entity: T, materialSelectedItems: IMaterialSearchEntity[]){
		const assemblyItem = this.getSelectedParent();
		if (assemblyItem && !_.isEmpty(materialSelectedItems) && _.size(materialSelectedItems) > 1){
			this.materialLookupSelectedItems = materialSelectedItems;
			this.resolveResourcesAndAssign(assemblyItem, _.map(materialSelectedItems, 'Id'), EstimateMainResourceType.Material);
		}
	}

	public setIndirectCost(resources: T[], isIndirectCost: boolean = false){
		this.assemblyResourceProcessor.setIndirectCost(resources, isIndirectCost);
	}
}
