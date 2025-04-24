import { inject, Injectable } from '@angular/core';
import { ConstructionSystemSharedGlobalParameterValueLookupService, ICosGlobalParamEntity, ICosGlobalParamValueEntity } from '@libs/constructionsystem/shared';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { CompleteIdentification, ISearchResult, PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { IInstanceHeaderParameterEntity } from '../model/entities/instance-header-parameter-entity.interface';
import { ConstructionSystemMainGlobalParameterGroupDataService } from './construction-system-main-global-parameter-group-data.service';
import { ConstructionSystemMainGlobalParameterLookupService } from './lookup/construction-system-main-global-parameter-lookup.service';
import { ConstructionSystemMainInstanceHeaderParameterFormatterProcessor } from './processors/construction-system-main-instance-header-parameter-formatter-processor.service';
import { ConstructionSystemMainInstanceParameterReadonlyProcessorService } from './processors/construction-system-main-instance-header-parameter-readonly-processor.service';
import { ISplitGridContainerSearchService } from '@libs/ui/business-base';

interface IFilterData {
	cosGlobalParamGroupFk?: number;
	SearchValue?: string;
	InsHeaderId?: number;
}

interface ICosInstanceHeaderParameterResponse {
	cosglobalparam: ICosGlobalParamEntity[];
	cosglobalparamvalue: ICosGlobalParamValueEntity[];
	dtos: IInstanceHeaderParameterEntity[];
}
class InstanceHeaderParameterEntityComplete implements CompleteIdentification<IInstanceHeaderParameterEntity> {
	public InstanceHeaderParameter?: IInstanceHeaderParameterEntity[];
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainInstanceHeaderParameterDataService extends DataServiceFlatRoot<IInstanceHeaderParameterEntity, InstanceHeaderParameterEntityComplete> implements ISplitGridContainerSearchService {
	private readonly groupService = ServiceLocator.injector.get(ConstructionSystemMainGlobalParameterGroupDataService);
	private readonly formatterProcessor = new ConstructionSystemMainInstanceHeaderParameterFormatterProcessor();
	private readonly readonlyProcessor = new ConstructionSystemMainInstanceParameterReadonlyProcessorService(this);
	private readonly http = inject(PlatformHttpService);
	public filterData: IFilterData = {};
	public searchText: string = '';

	public constructor() {
		const options: IDataServiceOptions<IInstanceHeaderParameterEntity> = {
			apiUrl: 'constructionsystem/main/instanceheaderparameter',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getlistbyglobalparam',
				usePost: true,
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update', /// todo:update does not work, seems dynamic domain update can not be add to modified
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<IInstanceHeaderParameterEntity>>{
				role: ServiceRole.Root,
				itemName: 'InstanceHeaderParameter',
			},
			entityActions: { createSupported: false, deleteSupported: false },
		};
		super(options);
		this.processor.addProcessor([this.formatterProcessor, this.readonlyProcessor]);
		this.refreshAllLoaded();
		this.groupService.selectionChanged$.subscribe((group) => {
			this.filterData.cosGlobalParamGroupFk = group[0].Id;
			this.refreshParameter().then((response) => {
				this.refreshAfter(response);
			});
		});
	}

	/**
	 * set selected parameter
	 * @param dtos
	 */
	public setSelectedItem(dtos: IInstanceHeaderParameterEntity[]) {
		const selectedItem = this.getSelectedEntity();
		if (selectedItem && dtos.some((e) => e.Id === selectedItem?.Id)) {
			this.select(selectedItem);
		}
	}

	public override createUpdateEntity(modified: IInstanceHeaderParameterEntity | null): InstanceHeaderParameterEntityComplete {
		const complete = new InstanceHeaderParameterEntityComplete();
		if (modified !== null) {
			complete.InstanceHeaderParameter = [modified];
		}
		return complete;
	}

	protected override provideLoadByFilterPayload(): object {
		return this.filterData;
	}

	public setInstanceHeaderId(id?: number) {
		this.filterData.InsHeaderId = id;
	}
	protected override onLoadByFilterSucceeded(loaded: ICosInstanceHeaderParameterResponse): ISearchResult<IInstanceHeaderParameterEntity> {
		this.setCosParameterTypeFkAndIslookup(loaded);
		this.setCosGlobalParam(loaded);
		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: 0,
				RecordsRetrieved: 0,
				ResultIds: [],
			},
			dtos: loaded.dtos ?? [],
		};
	}

	public setCosGlobalParam(loaded: ICosInstanceHeaderParameterResponse) {
		if (loaded.cosglobalparam && loaded.cosglobalparam.length > 0) {
			const parameterLookupService = ServiceLocator.injector.get(ConstructionSystemMainGlobalParameterLookupService);
			parameterLookupService.cache.setList(loaded.cosglobalparam);
		}
		if (loaded.cosglobalparamvalue && loaded.cosglobalparamvalue.length > 0) {
			const parameterValueLookupService = ServiceLocator.injector.get(ConstructionSystemSharedGlobalParameterValueLookupService);
			parameterValueLookupService.cache.setList(loaded.cosglobalparamvalue);
		}
	}

	public setCosParameterTypeFkAndIslookup(response: ICosInstanceHeaderParameterResponse) {
		response.cosglobalparamvalue?.forEach((paramValue) => {
			paramValue.Description = paramValue.DescriptionInfo?.Translated;
		});

		response.dtos?.forEach((item) => {
			const cosGlobalParameter = response.cosglobalparam.find((e) => e.Id === item.CosGlobalParamFk);
			if (cosGlobalParameter) {
				item.CosParameterTypeFk = cosGlobalParameter.CosParameterTypeFk;
				item.IsLookup = cosGlobalParameter.IsLookup;
			}
		});
	}

	/**
	 * refresh container
	 * @param globalParameterId
	 * @param refreshNew
	 */
	public refreshParameter(globalParameterId?: number | null, refreshNew?: boolean) {
		this.saveInstanceHeaderParameter();
		/// todo and search value
		this.clearModifications();
		const params = {
			cosGlobalParamGroupFk: this.filterData.cosGlobalParamGroupFk ?? -1,
			InsHeaderId: this.filterData.InsHeaderId ?? -1,
			refreshNew: false,
			globalParameterId: -1,
			searchValue: this.filterData.SearchValue ?? '',
		};
		if (refreshNew) {
			params.refreshNew = true;
		}
		if (globalParameterId) {
			params.globalParameterId = globalParameterId;
		}
		return this.http.get<ICosInstanceHeaderParameterResponse>('constructionsystem/main/instanceheaderparameter/refresh', {
			params: params,
		});
	}

	/**
	 * deal with data after refresh
	 * @param response
	 */
	public refreshAfter(response: ICosInstanceHeaderParameterResponse) {
		this.setCosParameterTypeFkAndIslookup(response);
		this.setCosGlobalParam(response);
		this.doFormatter(response.dtos);
		this.setList(response.dtos);
		this.setSelectedItem(response.dtos);
	}
	public doFormatter(dtos: IInstanceHeaderParameterEntity[]) {
		dtos.forEach((item) => {
			this.formatterProcessor.process(item);
		});
	}

	public saveInstanceHeaderParameter() {
		// TODO-joy: Wait 'platformModuleStateService' to be implemented.
		return;
		// 	var modState = platformModuleStateService.state(service.getModule());
		// 	if (modState.modifications.InstanceHeaderParameter) {
		// 		var updateData = {
		// 			InstanceHeaderParameter: modState.modifications.InstanceHeaderParameter,
		// 			EntitiesCount: modState.modifications.InstanceHeaderParameter.length,
		// 			MainItemId: modState.modifications.InstanceHeaderParameter[0].Id
		// 		};
		// 		modState.modifications.EntitiesCount = modState.modifications.EntitiesCount - updateData.EntitiesCount;
		// 		delete modState.modifications.InstanceHeaderParameter;
		// 		$http.post(serviceContainer.data.httpUpdateRoute + serviceContainer.data.endUpdate, updateData).then(function (response) {
		// 			var responseData = response.data.InstanceHeaderParameter[0];
		// 			formatterProcessor.processItem(responseData);
		// 			var itemIndex = _.findIndex(serviceContainer.data.itemList, {Id: responseData.Id});
		// 			serviceContainer.data.itemList[itemIndex] = responseData;
		// 			serviceContainer.data.listLoaded.fire();
		// 		});
		// 	}
		// }
	}

	public async search() {
		// this.filterData.groupValues = undefined;
		// this.filterData.searchPattern = this.searchText;
		this.filterData.SearchValue = this.searchText;
		await this.refreshParameter();
	}
}
