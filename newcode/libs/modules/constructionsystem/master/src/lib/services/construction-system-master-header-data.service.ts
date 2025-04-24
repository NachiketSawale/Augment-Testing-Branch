/*
 * Copyright(c) RIB Software GmbH
 */

import $ from 'jquery';
import { set } from 'lodash';
import { Subject } from 'rxjs';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformHttpService, PostHttpOptions, ISearchResult, ISearchPayload } from '@libs/platform/common';
import { BasicsCostGroupComplete, BasicsSharedNewEntityValidationProcessorFactory, IBasicMainItem2CostGroup } from '@libs/basics/shared';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { ConstructionSystemMasterGroupDataService } from './construction-system-master-group-data.service';
import { ConstructionSystemMasterHeaderValidationService } from './validations/construction-system-master-header-validation.service';
import { ConstructionSystemMasterHeaderReadonlyProcessorService } from './processors/construction-system-master-header-readonly-processor.service';
import { ICosMasterHeaderResponse, CosMasterComplete, ICreateHeaderResponse, IDeleteHeaderResponse } from '../model/models';
import { ICosHeaderEntity } from '@libs/constructionsystem/shared';

export const CONSTRUCTION_SYSTEM_MASTER_HEADER_DATA_TOKEN = new InjectionToken<ConstructionSystemMasterHeaderDataService>('constructionSystemMasterHeaderDataToken');

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterHeaderDataService extends DataServiceFlatRoot<ICosHeaderEntity, CosMasterComplete> {
	private readonly http = inject(PlatformHttpService);

	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	private readonly groupDataService = inject(ConstructionSystemMasterGroupDataService);

	public readonly completeEntityCreated = new Subject<ICreateHeaderResponse>();

	public readonly selectionHeaderChanged = new Subject<boolean>();

	public readonly headerValidateComplete = new Subject<boolean>();

	public readonly updatedDoneMessenger = new Subject<CosMasterComplete>();

	public readonly onCostGroupCatalogsLoaded = new Subject<BasicsCostGroupComplete>();

	public costGroupCatalogs?: BasicsCostGroupComplete;

	private deepCoping = false;

	private headerIdToSelect: number | null = null;

	public constructor() {
		const options: IDataServiceOptions<ICosHeaderEntity> = {
			apiUrl: 'constructionsystem/master/header',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deleteheaders',
			},
			roleInfo: <IDataServiceRoleOptions<ICosHeaderEntity>>{
				role: ServiceRole.Root,
				itemName: 'CosHeaders',
			},
		};

		super(options);
		this.processor.addProcessor(new ConstructionSystemMasterHeaderReadonlyProcessorService(this));
		this.processor.addProcessor(this.provideNewEntityValidationProcessor()); // todo-allen: Should only validate the Code field (validateCode)?
	}

	private provideNewEntityValidationProcessor() {
		const newEntityValidationProcessorFactory = inject(BasicsSharedNewEntityValidationProcessorFactory);
		return newEntityValidationProcessorFactory.createProcessor(ConstructionSystemMasterHeaderValidationService, { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosHeaderDto' });
	}

	protected override provideLoadByFilterPayload(payload: ISearchPayload): object {
		const selectedGroup = this.groupDataService.getSelectedEntity();
		if (!selectedGroup) {
			this.groupDataService.refreshAll().then();
		}

		const items = this.groupDataService.getFilteredGroupIds();

		payload.executionHints = false;
		payload.includeNonActiveItems = false;
		payload.pageSize = 100;
		payload.pattern = '';
		payload.furtherFilters = items.map(function (value) {
			return {Token: 'COSGROUP', Value: value};
		});

		// todo-allen: waiting for sideBarSearch function to finish
		// return {
		// 	moduleName: 'constructionsystem.master',
		// 	enhancedSearchEnabled: false, // mike: it's not necessary for cos master. Thus, disable it.
		// 	pattern: '',
		// 	pageSize: 100,
		// 	useCurrentClient: null,
		// 	includeNonActiveItems: false,
		// 	showOptions: true,
		// 	showProjectContext: true,
		// 	withExecutionHints: false,
		// };
		return payload;
	}

	protected override onLoadByFilterSucceeded(loaded: ICosMasterHeaderResponse): ISearchResult<ICosHeaderEntity> {
		// todo-allen: Update it after basicsLookupdataLookupDescriptorService and basicsCostGroupAssignmentService ready
		// basicsLookupdataLookupDescriptorService.attachData(result || {});

		// $injector.invoke([
		// 	'basicsCostGroupAssignmentService',
		// 	function (basicsCostGroupAssignmentService) {
		// 		basicsCostGroupAssignmentService.process(result, service, {
		// 			mainDataName: 'dtos',
		// 			attachDataName: 'Header2CostGroups',
		// 			dataLookupType: 'Header2CostGroups',
		// 			identityGetter: function (entity) {
		// 				return { Id: entity.MainItemId };
		// 			},
		// 		});
		// 	},
		// ]);

		// serviceContainer.data.handleReadSucceeded(result, data);
		if (this.headerIdToSelect) {
			// this.selectById({ id: this.headerIdToSelect }); todo-allen: The method selectById seems to be unimplemented.
			const toSelectedItem = this.getList().find((item) => {
				return item.Id === this.headerIdToSelect;
			});
			if (toSelectedItem) {
				this.select(toSelectedItem);
			}
			this.headerIdToSelect = null;
		}

		return { FilterResult: loaded.FilterResult ?? { ExecutionInfo: '', RecordsFound: 0, RecordsRetrieved: 0, ResultIds: [] }, dtos: loaded.dtos };
	}

	public override createUpdateEntity(modified: ICosHeaderEntity | null): CosMasterComplete {
		const complete = new CosMasterComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.CosHeaders = [modified];
			complete.EntitiesCount = 1;
		} else if(this.hasSelection()) { // fix issue that missing initializing MainItemId(MainItemId is 0) when only updating
			complete.MainItemId = this.getSelectedEntity()?.Id ?? 0;
		}
		return complete;
	}

	protected override provideCreatePayload(): object {
		let selectedGroupId: number | null = null;

		const defaultGroup = this.groupDataService.getDefaultGroup();
		if (defaultGroup) {
			selectedGroupId = defaultGroup.Id;
		}
		const filterItems = this.groupDataService.getFilteredGroupIds();
		if (filterItems && filterItems.length > 0) {
			selectedGroupId = filterItems[0];
		}
		return {CosGroupFk: selectedGroupId};
	}

	protected override onCreateSucceeded(created: ICreateHeaderResponse): ICosHeaderEntity {
		this.completeEntityCreated.next(created);
		return created.CosHeaderDto;
	}

	public getProcessors() {
		return this.processor.getProcessors();
	}

	public override getModificationsFromUpdate(complete: CosMasterComplete): ICosHeaderEntity[] {
		return complete.CosHeaders ? complete.CosHeaders : [];
	}

	public async createDeepCopy() {
		const selected = this.getSelectedEntity();
		if (selected && !this.deepCoping) {
			this.deepCoping = true;
			const response = await this.http.post<CosMasterComplete>('constructionsystem/master/header/deepcopy', selected);
			if (response && response.CosHeader) {
				this.syncCostGroups([response.CosHeader], [response]);
				this.append(response.CosHeader);
				await this.goToLast();
				this.deepCoping = false;
			}
		}
	}

	private async deleteRequest(deleteParams: { entities: Array<ICosHeaderEntity> }) {
		// const deleteUrl = this.options.apiUrl + this.options.deleteInfo.endPoint;
		const deleteUrl = '';
		const response = await this.http.post<IDeleteHeaderResponse>(deleteUrl, deleteParams.entities);
		if (response.Result) {
			// data.onDeleteDone(deleteParams, data, res); todo
			return true;
		} else if (response.ValidationErrors && response.ValidationErrors.length > 0) {
			const errors = response.ValidationErrors.join('\n');
			const result = await this.messageBoxService.showYesNoDialog(errors, 'constructionsystem.master.dialog.deleteOtherModuleTitle');
			if (result?.closingButtonId === StandardDialogButtonId.Ok) {
				const httpOptions: PostHttpOptions = { params: { isDeleteLineItem: true } };
				const resp = await this.http.post<IDeleteHeaderResponse>('constructionsystem/master/header/deleteHeaderInInstanceWithLineItems', {}, httpOptions);
				if (resp.Result) {
					// data.onDeleteDone(deleteParams, data, resp); todo
					return true;
				} else {
					// platformRuntimeDataService.removeMarkAsBeingDeletedFromList(deleteParams.entities); todo
				}
			}
		}
		return true;
	}

	// todo-allen: Some dependencies have not been implemented yet.
	// platformRuntimeDataService.isBeingDeleted
	// platformDataValidationService.removeDeletedEntitiesFromErrorList
	public override delete(entities: ICosHeaderEntity[] | ICosHeaderEntity) {
		// if (platformRuntimeDataService.isBeingDeleted(entities)) {
		// 	return $q.when(true);
		// }

		const deleteParams: { entities: Array<ICosHeaderEntity> } = { entities: [] };
		const deleteParamsOnBackside: { entities: Array<ICosHeaderEntity> } = { entities: [] };
		// platformRuntimeDataService.markListAsBeingDeleted(entities);

		if (!Array.isArray(entities)) {
			entities = [entities];
		}

		const itemList = this.getList();
		entities.forEach(function (item) {
			set(item, 'index', itemList.indexOf(item));
		});
		// platformDataValidationService.removeDeletedEntitiesFromErrorList(entities, service);
		// data.doPrepareDelete({entities: entities}, data);

		$.extend(true, deleteParams.entities, entities);
		for (const value of deleteParams.entities) {
			if (value.Version === 0) {
				super.delete([value]);
			} else {
				deleteParamsOnBackside.entities.push(value);
			}
		}
		if (deleteParamsOnBackside.entities.length > 0) {
			this.deleteRequest(deleteParamsOnBackside);
		}
	}

	// todo-allen: handle update done
	// private handleUpdateDone(updateData: CosMasterComplete, response: CosMasterComplete) {
	// 	if (response && Array.isArray(response.ModelValidateError) && response.ModelValidateError.length > 0) {
	// 		for (const item of response.ModelValidateError) {
	// 			const result = {
	// 				apply: true,
	// 				valid: false,
	// 				error: item === 'Code' ? this.translateService.instant('cloud.common.uniqueValueErrorMessage', { object: 'Code' }).text : item,
	// 			};
	// 			if (updateData.CosHeader) {
	// 				this.handleValidation(result, updateData.CosHeader, item);
	// 			}
	// 			this.messageBoxService.showErrorDialog(result.error);
	// 		}
	// 	} else {
	// 		// todo: cos-global-param-group, cos-template, cos-test-input
	// 		this.updatedDoneMessenger.next(response); // todo: register some methods form other services.
	// 	}
	// 	data.handleOnUpdateSucceeded(updateData, response, data, true); // todo: may be no used.
	// }

	// private handleValidation(result: { apply: boolean, valid: boolean, error: string }, item: object, model: string) {
	// 	if (result.valid) {
	// 		if (item.__rt$data && item.__rt$data.errors) {
	// 			delete item.__rt$data.errors[model];
	// 		}
	// 	} else {
	// 		if (!item.__rt$data) {
	// 			item.__rt$data = {errors: {}};
	// 		} else if (!item.__rt$data.errors) {
	// 			item.__rt$data.errors = {};
	// 		}
	// 		item.__rt$data.errors[model] = result;
	// 	}
	// }

	// todo-allen: Not sure if the function is needed.
	public getContainerUUID() {
		return 'ACC544C6504A4A678DBE74D8F390EEA8';
	}

	private assignCostGroups(readData: { dtos: ICosHeaderEntity[]; CostGroupCats: BasicsCostGroupComplete | undefined; Header2CostGroups: IBasicMainItem2CostGroup[] }) {
		// todo: basicsCostGroupAssignmentService is not implemented.
		// basicsCostGroupAssignmentService.process(readData, service, {
		// 	mainDataName: 'dtos',
		// 	attachDataName: 'Header2CostGroups',
		// 	dataLookupType: 'Header2CostGroups',
		// 	identityGetter: function (entity) {
		// 		return {
		// 			Id: entity.MainItemId
		// 		};
		// 	}
		// });
	}

	public syncCostGroups(dtos: Array<ICosHeaderEntity>, completeData: Array<CosMasterComplete>) {
		const readData: { dtos: ICosHeaderEntity[]; CostGroupCats: BasicsCostGroupComplete | undefined; Header2CostGroups: IBasicMainItem2CostGroup[] } = {
			dtos: dtos,
			CostGroupCats: this.costGroupCatalogs,
			Header2CostGroups: [],
		};

		for (const tmpl of completeData) {
			if (tmpl.CostGroupToSave && tmpl.CostGroupToSave.length > 0) {
				for (const group of tmpl.CostGroupToSave) {
					readData.Header2CostGroups.push(group);
				}
			}
		}

		this.assignCostGroups(readData);
	}

	// private registerNavigation(httpReadRoute, navigation) {
	// 	platformModuleNavigationService.registerNavigationEndpoint({
	// 		moduleName: navigation.moduleName, navFunc: function (item, triggerField) {
	// 			var data = navigation.getNavData ? navigation.getNavData(item, triggerField) : item;
	// 			if (angular.isNumber(data)) {
	// 				cloudDesktopSidebarService.filterSearchFromPKeys([data]);
	// 			} else if (angular.isString(data)) {
	// 				cloudDesktopSidebarService.filterSearchFromPattern(data);
	// 			} else {
	// 				$http.post(httpReadRoute + (navigation.endRead || 'navigation'), data).then(function (response) {
	// 					cloudDesktopSidebarService.filterSearchFromPKeys(response.data);
	// 				});
	// 			}
	// 		}
	// 	});
	// }

	//TODO:
	// service.navigateTo = function () {
	// 	registerNavigation(serviceContainer.data.httpReadRoute, {
	// 		moduleName: moduleName, getNavData: function getNavData(item, triggerField) {
	// 			if (triggerField === 'CosMasterHeaderCode' && _.isNumber(item['CosMasterHeaderId'])) {
	// 				headerIdToSelect = item['CosMatesrHeaderId'];
	// 				return item['CosMasterHeaderId'];
	// 			}
	// 			if (triggerField === 'Code') {
	// 				return item['Id'];
	// 			}
	// 			if (angular.isDefined(item.HeaderFk)) {
	// 				return item.HeaderFk !== null ? item.HeaderFk : -1;
	// 			}
	// 		}
	// 	});
	// };
}
