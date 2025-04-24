import { Injectable } from '@angular/core';
import { ICosHeaderEntity } from '@libs/constructionsystem/shared';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { CompleteIdentification, ISearchPayload, ISearchResult, ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemMainHeaderGroupDataService } from './construction-system-main-header-group-data.service';
import { IFilterResponse } from '@libs/basics/shared';
import { ISplitGridContainerSearchService } from '@libs/ui/business-base';

interface IFilterData {
	groupValues?: number[];
	searchPattern?: string;
}

interface IMasterData {
	CosMasterId?: number | null;
	CosTemplateId?: number | null;
	CosMasterChecked?: boolean;
}

interface ICosMainHeaderListResponse {
	FilterResult: IFilterResponse;
	dtos: ICosHeaderEntity[];
}

class Headercomplete implements CompleteIdentification<ICosHeaderEntity> {
	public header?: ICosHeaderEntity;
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainHeaderListDataService extends DataServiceFlatRoot<ICosHeaderEntity, Headercomplete> implements ISplitGridContainerSearchService {
	private groupService = ServiceLocator.injector.get(ConstructionSystemMainHeaderGroupDataService);
	private filterData: IFilterData = {};
	private cosMasterTemporaryDatas: IMasterData[] = [];
	public searchText: string = '';

	public search = async () => {
		this.filterData.groupValues = undefined;
		this.filterData.searchPattern = this.searchText;
		this.refreshAll();
	};

	public constructor() {
		const options: IDataServiceOptions<ICosHeaderEntity> = {
			apiUrl: 'constructionsystem/master/header',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<ICosHeaderEntity>>{
				role: ServiceRole.Root,
				itemName: 'ConstructionSystemMaster',
			},
			entityActions: { createSupported: false, deleteSupported: false },
		};
		super(options);
		this.groupService.selectionChanged$.subscribe((group) => {
			this.filterData.groupValues = group.map((item) => item.Id);
			this.refreshAll();
		});
	}

	public override createUpdateEntity(modified: ICosHeaderEntity | null): Headercomplete {
		return new Headercomplete();
	}

	protected override provideLoadByFilterPayload(payload: ISearchPayload): object {
		this.extendSearchFilter(payload);
		return payload;
	}

	private extendSearchFilter(filterRequest: ISearchPayload) {
		filterRequest.furtherFilters =
			this.filterData?.groupValues?.map((group) => ({
				Token: 'COSGROUP',
				Value: group,
			})) || null;

		filterRequest.pattern = this.filterData.searchPattern ?? '';
	}

	protected override onLoadByFilterSucceeded(loaded: ICosMainHeaderListResponse): ISearchResult<ICosHeaderEntity> {
		const fr = loaded.FilterResult;
		this.recoverTemporaryDatas(loaded.dtos);
		return {
			FilterResult: {
				ExecutionInfo: fr.ExecutionInfo,
				RecordsFound: fr.RecordsFound,
				RecordsRetrieved: fr.RecordsRetrieved,
				ResultIds: fr.ResultIds,
			},
			dtos: loaded.dtos,
		};
	}

	private recoverTemporaryDatas(items: ICosHeaderEntity[]) {
		items.forEach((item) => {
			const cosMasterTemporaryData = this.getCosMasterTemporaryData(item.Id);
			if (item.IsChecked) {
				item.IsChecked = false; // set the default value
			}
			if (cosMasterTemporaryData) {
				item.CosTemplateFk = cosMasterTemporaryData.CosTemplateId;
				item.IsChecked = cosMasterTemporaryData.CosMasterChecked;
			}
		});
	}

	private getCosMasterTemporaryData(cosMasterId: number) {
		let cosMasterTemporaryData: IMasterData | null = null;
		for (const data of this.cosMasterTemporaryDatas) {
			if (data.CosMasterId === cosMasterId) {
				cosMasterTemporaryData = data;
				break;
			}
		}
		return cosMasterTemporaryData;
	}

	public saveSelectedTemplate(cosMasterId: number | null, cosTemplateId: number | null) {
		if (cosMasterId) {
			let cosMasterTemporaryData = this.getCosMasterTemporaryData(cosMasterId);
			if (cosMasterTemporaryData === null) {
				cosMasterTemporaryData = {
					CosMasterId: cosMasterId,
					CosTemplateId: cosTemplateId,
				};
				this.cosMasterTemporaryDatas.push(cosMasterTemporaryData);
			} else {
				cosMasterTemporaryData.CosTemplateId = cosTemplateId;
			}
		}
	}

	public isCheckedValueChange(selectedItem: ICosHeaderEntity, newValue: boolean) {
		//itemCheckStatusPrevious[selectItem.Id] = selectItem.IsChecked; // cache the value previous todo necessary??
		this.saveCosMasterCheckFlag(selectedItem.Id, newValue);
	}

	public saveCosMasterCheckFlag(cosMasterId: number, cosMasterChecked: boolean) {
		let cosMasterTemporaryData = this.getCosMasterTemporaryData(cosMasterId);
		if (cosMasterTemporaryData === null) {
			cosMasterTemporaryData = {
				CosMasterId: cosMasterId,
				CosMasterChecked: cosMasterChecked,
			};
			this.cosMasterTemporaryDatas.push(cosMasterTemporaryData);
		} else {
			cosMasterTemporaryData.CosMasterChecked = cosMasterChecked;
		}
	}
}
