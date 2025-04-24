/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, DataServiceHierarchicalNode, IEntityList, EntityArrayProcessor } from '@libs/platform/data-access';
import { IIdentificationData } from '@libs/platform/common';
import { IPrjCostCodesEntity, IProjectCostCodesComplete, PrjCostCodesEntity } from '@libs/project/interfaces';
import { IProjectComplete, IProjectEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';
import { EntityReadonlyProcessorBase } from '@libs/basics/shared';
import { ProjectCostCodesDynamicUserDefinedColumnService } from './project-costcodes-dynamic-user-defined-column.service';
import { ProjectCostcodesDynamicConfigurationService } from './project-costcodes-dynamic-configuration.service';

export const PROJECT_COST_CODES_DATA_TOKEN = new InjectionToken<ProjectCostCodesDataService>('projectCostCodesDataToken');

@Injectable({
	providedIn: 'root',
})

/**
 * @class ProjectCostCodesDataService
  A service class for managing project cost codes data.
 * and register node modifications.
 */
export class ProjectCostCodesDataService extends DataServiceHierarchicalNode<IPrjCostCodesEntity, IProjectCostCodesComplete, IProjectEntity, IProjectComplete> {
	private projectMainDataService = inject(ProjectMainDataService);
	private dynamicUserDefinedColService = inject(ProjectCostCodesDynamicUserDefinedColumnService);
	private projectCostCodesDynamicConfigurationService = inject(ProjectCostcodesDynamicConfigurationService);
	private selectedItemId = null;
	private factorFieldsToRecalculate: { [key: string]: string } = {
		FactorCosts: 'RealFactorCosts',
		FactorQuantity: 'RealFactorQuantity',
	};
	public constructor(projectMainDataService: ProjectMainDataService) {
		const options: IDataServiceOptions<IPrjCostCodesEntity> = {
			apiUrl: 'project/costcodes',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: false,
				prepareParam: (ident: IIdentificationData) => {
					const projectId = this.projectMainDataService.getSelection()[0];
					return { projectId: projectId.Id };
				},
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update',
			},
			roleInfo: <IDataServiceRoleOptions<IPrjCostCodesEntity>>{
				role: ServiceRole.Node,
				itemName: 'PrjCostCodes',
				parent: projectMainDataService,
			},
			entityActions: {
				createSupported: false,
			},
			processors: [new EntityArrayProcessor<IPrjCostCodesEntity>(['ProjectCostCodes'])],
		};
		super(options);		
		this.init();
	}

	/**
	 * @brief Get the parent of a given project cost code entity.
	 */
	public override childrenOf(element: IPrjCostCodesEntity): IPrjCostCodesEntity[] {
		return element.ProjectCostCodes ?? [];
	}

	public override parentOf(element: IPrjCostCodesEntity): IPrjCostCodesEntity | null {
		if (element.CostCodeParentFk == null) {
			return null;
		}

		const parentId = element.Id;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	protected override onCreateSucceeded(created: IPrjCostCodesEntity): IPrjCostCodesEntity {
		const readonlyProcessor = this.processor.getProcessors().find((p) => p instanceof EntityReadonlyProcessorBase);
		if (readonlyProcessor) {
			readonlyProcessor.process(created);
		}

		created.Code = this.generateCode(created);

		// TODO this.dynamicUserDefinedColService.attachEmptyDataToColumn(created); attachEmptyDataToColumn is in basics common factory

		return created;
	}

	protected override provideLoadPayload(): object {
		const projectId = this.projectMainDataService.getSelection()[0];
		return {
			projectId: projectId.Id,
		};
	}

	/**                                                                          
	 *  Create or update a project cost code entity.
	 */
	public override createUpdateEntity(modified: IPrjCostCodesEntity | null): IProjectCostCodesComplete {
		return {
			Id: modified ? modified.Id : null,
		} as IProjectCostCodesComplete;
	}

	protected override onLoadSucceeded(loaded: object): IPrjCostCodesEntity[] {
		const loadedEntities = loaded as IPrjCostCodesEntity[];

		// TODO PlatformDataServiceEntitySortExtension,cloudCommonGridService
		// let basCostCode = {};
		// loadedEntities.forEach((item)=>{
		// 	basCostCode = cloudCommonGridService.addPrefixToKeys(item.BasCostCode, 'BasCostCode');
		// 	angular.extend(item, basCostCode);
		// });
		// inject(PlatformDataServiceEntitySortExtension).sortTree(loadedEntities, 'Code', 'ProjectCostCodes');
		// this.dynamicUserDefinedColService.attachDataToColumn(this.getList()); TODO attachEmptyDataToColumn is in basics common factory
		const selectedProjectItem = this.projectMainDataService.getSelectedEntity();
		this.dynamicUserDefinedColService.setProjectId(selectedProjectItem ? selectedProjectItem.Id : -1);

		if(this.selectedItemId){
			const list = this.getList();
			const selectItem = list && list.length ? list.find((i)=>i.Id === this.selectedItemId) : {} as IPrjCostCodesEntity;
			this.selectedItemId = null;
			if(selectItem && selectItem.Id){
				this.select(selectItem);
			}
		}

		return loadedEntities;
	}

	protected override provideCreateChildPayload(): object {
		const parent = this.getSelectedParent();
		const ParentCostCode = this.getSelection().length > 0 ? this.getSelection()[0] : null;

		const creationData = {
			MainItemId: parent?.Id,
			ParentCostCode: ParentCostCode,
			parent: ParentCostCode,
			parentId: ParentCostCode?.Id,
			projectId: parent?.Id,
		};

		return creationData;
	}

	public override canCreateChild(): boolean {
		return this.getSelectedEntity()?.IsChildAllowed ?? false;
	}

	public override getModificationsFromUpdate(complete: IProjectCostCodesComplete): IPrjCostCodesEntity[] {
		if (complete.PrjCostCodes === null) {
			complete.PrjCostCodes = [];
		}
		return complete.PrjCostCodes;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(complete: IProjectComplete, modified: IProjectCostCodesComplete[], deleted: IPrjCostCodesEntity[]) {
		if (modified && modified.length > 0) {
			if (complete.PrjCostCodesToSave) {
				//complete.PrjCostCodesToSave.PrjCostCodesJobRateToSave = modified;
			}
		}
		if (deleted && deleted.length > 0) {
			if (complete.PrjCostCodesToSave) {
				//complete.PrjCostCodesToSave.PrjCostCodesJobRateToDelete = deleted;
			}
		}
	}

	/**
	 *  Checks if the creation of entities is allowed.
	 */
	protected override checkCreateIsAllowed(entities: IPrjCostCodesEntity[] | IPrjCostCodesEntity | null): boolean {
		return false;
	}

	/**
	 * Takes over updated entities from a complete project cost codes object.
	 * If so, it updates the `entityList` with the entities from the `PrjCostCodes` array.
	 */
	protected takeOverUpdatedFromComplete(complete: IProjectCostCodesComplete, entityList: IEntityList<IPrjCostCodesEntity>) {
		if (complete && complete.PrjCostCodes && complete.PrjCostCodes.length > 0) {
			entityList.updateEntities(complete.PrjCostCodes);
		}
	}

	/**
	 * Used to calculate real factor column values
	 * @param arg Argument supported by Platform to get the columns and data
	 */
	public calcRealFactors(arg: unknown) {
		// const item = arg.item; TODO
		// const column = arg.grid.getColumns()[arg.cell].field; TODO
		let item!: PrjCostCodesEntity;
		const column = '';
		if (this.factorFieldsToRecalculate[column]) {
			const updatedItems: IPrjCostCodesEntity[] = [];
			this.calculateHierarchyFactors(item, column, null, updatedItems);
			this.setModified(updatedItems);
		}
	}

	/**
	 * Calculate hierarchical factors
	 * @param item Item which is to be calculated
	 * @param column Column of the item which is to be calculated
	 * @param parentItem Parent item of the Item
	 * @param updatedItems Updated items
	 */
	public calculateHierarchyFactors(item: PrjCostCodesEntity, column: string, parentItem: PrjCostCodesEntity | null, updatedItems: IPrjCostCodesEntity[]) {
		const realFactorColumn = this.factorFieldsToRecalculate[column];
		// item = this.getItemById(item.Id); TODO getItemById() function is not yet implemented in factory service
		if (!item.CostCodeParentFk) {
			if (item[realFactorColumn] !== item[column]) {
				item[realFactorColumn] = item[column];
				updatedItems.push(item);
			}
		} else {
			if (!parentItem) {
				// parentItem = this.getItemById(item.CostCodeParentFk); TODO getItemById() function is not yet implemented in factory service
			}
			if (parentItem) {
				const parentValue = parentItem?.[realFactorColumn];
				const itemValue = item?.[column];

				if (typeof parentValue === 'number' && typeof itemValue === 'number') {
					const newFactor = (parentValue ?? 0) * (itemValue ?? 0);
					if (item[realFactorColumn] !== newFactor) {
						item[realFactorColumn] = newFactor;
						updatedItems.push(item);
					}
				}
			}
		}
		if (Array.isArray(item.ProjectCostCodes) && item.ProjectCostCodes.length > 0) {
			item.ProjectCostCodes.forEach((cc) => {
				this.calculateHierarchyFactors(cc, column, item, updatedItems);
			});
		}
	}

	/**
	 * This function used to generate the code for subrecords
	 * @param item Parent item from which new subrecord will be created
	 * @returns Code
	 */
	public generateCode(item: IPrjCostCodesEntity) {
		if (!item || !item.CostCodeParentFk) {
			return '';
		}

		const stepIncrement = 1;
		let items = this.flatList();
		items = this.flattenPrjCostCodes(items);
		const parent = item.CostCodeParentFk ? items.find((i) => i.Id === item.CostCodeParentFk) : null;
		const sameLevelItems = items.filter((k) => k.CostCodeParentFk === item.CostCodeParentFk);
		if (parent !== null) {
			const prevPart = parent?.Code.endsWith('.') ? parent.Code : parent?.Code + '.';
			let lastIndexNum = stepIncrement;
			let newCode = prevPart + lastIndexNum;
			while (sameLevelItems.find((j) => j.Code === newCode)) {
				lastIndexNum += stepIncrement;
				newCode = prevPart + lastIndexNum;
			}
			return newCode;
		} else {
			return '';
		}
	}

	/**
	 * Used to flatten the cost code list
	 * @param costcodes Hierarchical cost codes
	 * @returns flat list
	 */
	private flattenPrjCostCodes(costcodes: IPrjCostCodesEntity[]): IPrjCostCodesEntity[] {
		const result: IPrjCostCodesEntity[] = [];
		costcodes.forEach((costcode) => {
			result.push(costcode);
			if (costcode.ProjectCostCodes) {
				result.push(...this.flattenPrjCostCodes(costcode.ProjectCostCodes));
			}
		});

		return result;
	}

	private init() {
		this.refreshLookup();
		// this.projectCostcodesProcessService.onChildAllowedChanged.register(updateTools); - TODO Platform Messanger
		// this.projectCostCodesDynamicConfigurationService.registerSetConfigLayout(this.setDynamicColumnsLayoutToGrid());	TODO registerSetConfigLayout in basics common	
		// this.dynamicUserDefinedColService.loadDynamicColumns(); TODO loadDynamicColumns in basics common
		this.selectionChanged$.subscribe((e) => {
			this.updateTools();			
			this.onSelectionChanged(e);
		});
	}

	private onSelectionChanged(e:IPrjCostCodesEntity[]) {
		// inject(ProjectCostCodesJobRateDataService).clearCostCodeJobRateCacheData(); - circular dependency
		this.projectMainDataService.refreshAll();
	}

	private setDynamicColumnsLayoutToGrid(){
		// TODO this.projectCostCodesDynamicConfigurationService.applyToScope($scope); It is depends on basic common factory
	}

	private updateTools(){
		// TODO platformContainerCreateDeleteButtonService
		// platformContainerCreateDeleteButtonService.toggleButtons($scope.containerButtonConfig, projectCostCodesMainService);
		// if ($scope.tools) {
		// 	$scope.tools.update();
		// }
	}

	private refreshLookup(){
		// TODO LogisticJobLookupByProjectDataService
		// let jobLookupServ = inject(LogisticJobLookupByProjectDataService);
		// if(jobLookupServ){
		// 	jobLookupServ.resetCache({lookupType:'logisticJobLookupByProjectDataService'});
		// }
	}

	// TODO Navigation
	// service.navigateTo = function navigateTo(item) {
	// 	if (_.isObject(item) && _.isFunction(service.parentService().showTargetContainer)) {
	// 		let targetCostCodesContainer = '30';
	// 		let success = service.parentService().showTargetContainer(targetCostCodesContainer);
	// 		if (success) {
	// 			selectedItemId = item.Id;
	// 			if(service.parentService().getIfSelectedIdElse(null)){
	// 				service.load();
	// 			}else{
	// 				service.parentService().load();
	// 			}
	// 		}
	// 	}
	// }
}
