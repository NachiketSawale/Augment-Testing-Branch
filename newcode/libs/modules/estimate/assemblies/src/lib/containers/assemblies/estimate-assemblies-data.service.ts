/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { LineItemBaseComplete } from '@libs/estimate/shared';
import { inject, Injectable } from '@angular/core';
import {
	DataServiceFlatRoot,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	IDataServiceRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {
	CollectionHelper,
	IIdentificationData,
	ISearchPayload,
	ISearchResult
} from '@libs/platform/common';
import * as _ from 'lodash';
import {
	IEstLineItemRequestEntity
} from '@libs/estimate/shared';
import {
	IEstAssemblyResponseEntity
} from '@libs/estimate/shared';
import { EstimateAssembliesCreationService } from '../../services/estimate-assemblies-creation.service';
import { Observable } from 'rxjs';
import {
	EstimateAssembliesAssemblyCategoriesDataService
} from '../assembly-category/estimate-assemblies-assembly-categories-data.service';
import {
	AssemblyDataServiceMixin
} from '@libs/estimate/shared';
import {
	EstimateAssembliesBaseProcessService
} from '@libs/estimate/shared';

/**
 * Estimate Assemblies Service
 */
@Injectable({ providedIn: 'root' })
export class EstimateAssembliesService extends AssemblyDataServiceMixin(DataServiceFlatRoot<IEstLineItemEntity, LineItemBaseComplete>){
	private readonly gridId = '234BB8C70FD9411299832DCCE38ED118';
	private readonly estimateAssembliesCreationService = inject(EstimateAssembliesCreationService);
	private readonly assemblyStructServ = inject(EstimateAssembliesAssemblyCategoriesDataService);
	private readonly assembliesProcessor : EstimateAssembliesBaseProcessService<IEstLineItemEntity>;

	/**
	 * Constructor that initializes the service with the necessary options
	 */
	public constructor() {
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
			deleteInfo: {
				endPoint: 'assemblies/delete',
				usePost: true
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'main/lineitem/update',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IEstLineItemEntity>>{
				role: ServiceRole.Root,
				itemName: 'EstLineItems'
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
		this.assembliesProcessor = new EstimateAssembliesBaseProcessService<IEstLineItemEntity>(this, this.assemblyStructServ);
	}

	/**
	 * Override the provideCreatePayload
	 */
	public override provideCreatePayload(): object {
		const creationData = this.createPayload();
		this.estimateAssembliesCreationService.processItem(creationData);
		return creationData;
	}

	/**
	 * delete
	 * @param entities
	 * @param skipDialog
	 */
	public override delete(entities: IEstLineItemEntity[] | IEstLineItemEntity, skipDialog: boolean = false): void {
		if (!skipDialog) {
			this.messageBoxService.deleteSelectionDialog({ dontShowAgain: true, id: this.gridId })?.then(result => {
				if (result.closingButtonId === 'yes') {
					this.deleteEntities(CollectionHelper.AsArray(entities));
				}
			});
		} else {
			this.deleteEntities(CollectionHelper.AsArray(entities));
		}
	}

	/**
	 * Override the createUpdateEntity method to handle specific entity creation
	 * @param modified
	 */
	public override createUpdateEntity(modified: IEstLineItemEntity | null): LineItemBaseComplete {
		const completeEntity = new LineItemBaseComplete();
		if (modified) {
			completeEntity.EstLineItems = [modified];
		}
		this.provideUpdateData(completeEntity);
		return completeEntity;
	}

	public override getModificationsFromUpdate(complete: LineItemBaseComplete): IEstLineItemEntity[] {
		if (complete.EstLineItems) {
			return complete.EstLineItems;
		}
		return [];
	}

	/**
	 * onCreateSucceeded
	 * @param created
	 * @protected
	 */
	protected override onCreateSucceeded?(created: object): IEstLineItemEntity {
		const newItem = created as unknown as IEstLineItemEntity;
		this.handleCreateSucceeded(newItem);
		return newItem;
	}

	protected override provideLoadByFilterPayload(payload: ISearchPayload): object {
		this.extendSearchFilter(payload as IEstLineItemRequestEntity);
		return payload;
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IEstLineItemEntity> {
		this.incorporateDataRead(loaded as IEstAssemblyResponseEntity);
		const fr = _.get(loaded, 'FilterResult')!;
		return {
			FilterResult: fr,
			dtos: _.get(loaded, 'dtos')! as IEstLineItemEntity[]
		};
	}

	private extendSearchFilter(filterRequest: IEstLineItemRequestEntity) {
		// init furtherFilters - add filter IDs from filter structures
		if (this.assemblyIdToSelect) {
			filterRequest.pKeys = [this.assemblyIdToSelect];
		}

		//TODO: <estimateAssembliesFilterService> is missing
		// let filterType = estimateAssembliesFilterService.getFilterFunctionType();
		// let allFilterIds = estimateAssembliesFilterService.getAllFilterIds();
		// filterRequest.furtherFilters = _.filter(_.map(allFilterIds, function (v, k) {
		// 	if (_.size(v) === 0) {
		// 		return undefined;
		// 	}
		// 	// type 0 - assigned;
		// 	// -> no change needed
		//
		// 	// type 1 - assigned and not assigned
		// 	if (filterType === 1) {
		// 		v.push('null');
		// 	}
		// 	// type 2 - not assigned
		// 	else if (filterType === 2) {
		// 		v = ['null'];
		// 	}
		// 	let value = v.join(',');
		// 	return {Token: 'FILTER_BY_STRUCTURE:' + k, Value: value};
		// }), angular.isDefined);
		//
		// estimateAssembliesFilterService.setFilterRequest(filterRequest);
	}

	private incorporateDataRead(readData: IEstAssemblyResponseEntity) {
		this.considerDisabledDirect = readData.DoConsiderDisabledDirect ?? false;
		//TODO: need to implement the <incorporateDataRead> function in assembly
	}

	private handleCreateSucceeded(item: IEstLineItemEntity) {
		//TODO: need to implement the <handleCreateSucceeded> function in assembly
	}

	private provideUpdateData(complete: LineItemBaseComplete) {
		//TODO: need to implement the <provideUpdateData> function in assembly
	}

	private handleUpdateDone(){
		//TODO: need to implement the <handleUpdateDone> function in assembly
	}

	public deepCopy(){
		this.updateAndExecute(this.deepCopyAssemblies).then();
	}

	public getCopyAssemblies():Observable<LineItemBaseComplete>{
		const data = {
			EstAssemblyCat: this.assemblyStructServ.getSelectedEntity(),
			AssemblyIds:this.getSelection().map(e => e.Id),
			IsCopyToSameAssemblyCat: true
		};
		return this.http.post<LineItemBaseComplete>(this.configurationService.webApiBaseUrl + 'estimate/main/lineitem/deepcopyassembly', data);
	}

	public deepCopyAssemblies() {
		const selectedAssemblies = this.getSelection();
		if (selectedAssemblies && selectedAssemblies.length) {
			this.getCopyAssemblies().subscribe((result) => {
				this.handleDeepCopy(result);
				this.attachCostGroupToEntity(result);
				this.updateUerDefinedValue();
				this.attachHistoryInfo();
				if(result.EstLineItems && result.EstLineItems.length){
					this.addList(result.EstLineItems);
					this.select(result.EstLineItems[0]);
				}
				this.handleUpdateDone();
				this.clearModifications();
			});
		}
	}

	private handleDeepCopy(complete : LineItemBaseComplete) {
		if(complete.EstLineItems && complete.EstLineItems.length){
			// const items = this.addList(complete.EstLineItems);
			//TODO: <estimateAssembliesRuleFormatterService> is missing
			//$injector.get('estimateAssembliesRuleFormatterService').loadRuleRelationsAsync(items, 'estimateAssembliesService', 'estimateAssembliesMdcRuleRelationService');
		}
	}

	private attachCostGroupToEntity(complete : LineItemBaseComplete){
		//TODO: <basicsCostGroupAssignmentService> missing
		// let basicsCostGroupAssignmentService = $injector.get('basicsCostGroupAssignmentService');
		// basicsCostGroupAssignmentService.attachCostGroupValueToEntity(complete.EstLineItems, complete.EstLineItem2CostGroups, function identityGetter(entity) {
		// 		return {
		// 			EstHeaderFk: entity.RootItemId,
		// 			Id: entity.MainItemId
		// 		};
		// 	},
		// 	'EstLineItem2CostGroups'
		// );
	}

	private updateUerDefinedValue(){
		//TODO: <estimateAssembliesDynamicUserDefinedColumnService> missing
		// if(result && angular.isArray(result.UserDefinedcolsOfLineItemModified)){
		// 	let userDefinedColumnService = option && (option.isPrjAssembly || option.isPrjPlantAssembly) ? $injector.get('projectAssemblyDynamicUserDefinedColumnService')
		// 		: option && option.isPlantAssembly ? $injector.get(option.userDefinedColumServiceName)
		// 			: $injector.get('estimateAssembliesDynamicUserDefinedColumnService');
		//
		// 	userDefinedColumnService.attachUpdatedValueToColumn(result.EstLineItems, result.UserDefinedcolsOfLineItemModified);
		// 	userDefinedColumnService.updateValueList(result.UserDefinedcolsOfLineItemModified);
		// }
	}

	private attachHistoryInfo(){
		//TODO: <platformDataProcessExtensionHistoryCreator> missing
		// if (result && result.EstLineItems && result.EstLineItems.length > 0){
		// 	let platformDataProcessExtensionHistoryCreator = $injector.get('platformDataProcessExtensionHistoryCreator');
		// 	_.forEach(result.EstLineItems, function(estLineItem){
		// 		platformDataProcessExtensionHistoryCreator.processItem(estLineItem);
		// 	});
		// }
	}
}