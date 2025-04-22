/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
	DataServiceFlatNode,
	IDataServiceChildRoleOptions,
	IEntitySelection,
	ServiceRole
} from '@libs/platform/data-access';
import {IPackageEstimateLineItemEntity} from '../model/entities/package-estimate-line-item-entity.interface';
import {IEstHeaderEntity} from '@libs/estimate/interfaces';
import {EstHeaderCompleteEntity} from '../model/entities/est-header-complete-entity.class';
import {ProcurementPackageEstimateHeaderDataService} from './package-estimate-header-data.service';
import {ProcurementPackageHeaderDataService} from './package-header-data.service';
import {IPackageEstimateLineItemResponse} from '../model/entities/package-estimate-line-item-response.interface';
import {PlatformHttpService} from '@libs/platform/common';
import {BasicSharedDynamicColumnViewDecorator} from '@libs/basics/shared';
import {
	ProcurementPackageEstimateLineItemCostGroupDynamicColumnService
} from './dynamic-column/package-est-line-item-cost-group-dynamic-column.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import {forkJoin} from 'rxjs';
import {IJobEntity} from '@libs/logistic/interfaces';
import {IEstimateCompositeEntity} from '@libs/estimate/shared';

type EstimateInfo = {LgmJobFk?: number | null, EstHeaderFk?: number | null};

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageEstimateLineItemDataService extends DataServiceFlatNode<IPackageEstimateLineItemEntity, object, IEstHeaderEntity, EstHeaderCompleteEntity> {
	private readonly packageService = inject(ProcurementPackageHeaderDataService);
	private readonly httpService = inject(PlatformHttpService);

	public constructor(protected readonly estHeaderService: ProcurementPackageEstimateHeaderDataService) {
		const options = {
			apiUrl: 'estimate/main/lineitem',
			readInfo: {
				endPoint: 'filterlineitems4package',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IPackageEstimateLineItemEntity, IEstHeaderEntity, EstHeaderCompleteEntity>>{
				role: ServiceRole.Node,
				itemName: 'EstLineItem',
				parent: estHeaderService,
			},
			entityActions: {
				deleteSupported: false,
				createSupported: false,
			},
		};
		super(options);

		this.selectionChanged$.subscribe({
			next: (selection) => {
				if (selection && selection.length > 0) {
					const requests = selection.map((item) => {
						return {
							EstHeaderFk: item.EstHeaderFk,
							EstLineItemFk: item.Id
						};
					});
					this.show3DViewByLineItem(requests);
				}
			}
		});
	}

	protected override provideLoadPayload(): object {
		const selectPackage = this.packageService.getSelectedEntity();
		if (selectPackage) {
			return {
				projectFk: selectPackage.ProjectFk,
				packageFk: selectPackage.Id,
			};
		} else {
			return {};
		}
	}

	@BasicSharedDynamicColumnViewDecorator({
		EntitiesPropertyName: 'Main',
		GridGuid: '067be143d76d4ad080660ef147349f1d',
		DynamicServiceTokens:[ProcurementPackageEstimateLineItemCostGroupDynamicColumnService]
	})
	protected override onLoadSucceeded(loaded: IPackageEstimateLineItemResponse): IPackageEstimateLineItemEntity[] {
		// todo chi: service is not ready
		// let highlightJobIds = [];
		// readData = procurementCommonFilterJobVersionToolService.filterIncorporateDataRead(service, readData, highlightJobIds);
		// dynamic column
		// handleDataBeforeReadCompleted(readData);
		// lookup data
		// lookupDescriptorService.attachData(readData);
		// additional menu
		// procurementCommonFilterJobVersionToolService.initFilterDataMenu(service, procurementPackageDataService, highlightJobIds);

		if (!loaded) {
			return [];
		}

		const list = loaded.Main;
		if (list && list.length > 0) {
			list.forEach((item) => {
				this.setEntityReadOnly(item, true);
				this.setStatusImage(item);
			});
		}
		return list;
	}

	private async show3DViewByLineItem(request: object[]) {
		/* const modelIds = */
		await this.httpService.post('estimate/main/lineitem2mdlobject/getall', request); // || [];

		// todo chi: model view logic is not available
		// showModelViewer(modelIds);
	}

	private setStatusImage(entity: IPackageEstimateLineItemEntity) {
		if (entity) {
			if (entity.StatusOfLineItemAssignedToPackage === -1){
				entity.statusImage = 'ico-indicator4-0';
			} else if (entity.StatusOfLineItemAssignedToPackage === 0){
				entity.statusImage = 'ico-indicator4-1';
			} else {
				entity.statusImage = 'ico-indicator4-2';
			}
		}
	}

	// todo chi: in the angular js, it seems the logic wants to load the line item and resource data except using the cache,
	//  but i think what is the purpose to do this? (reLoad, package service.reloadPackageIds, getDataByHeaderId)
	// for the dynamic columns?
	// in the old controller, the field package fk can be changed but in UI, the field is readonly. So the no cache is for such kind of case?
	// in the old controller, modelViewerStandardFilterService.attachMainEntityFilter($scope, lineItemDataService.getServiceName()); is not ready
	// in the old controller, job filter buttons


	// todo chi: move to common logic
	// for data service only
	private jobIds: number[] = [];
	private showFilterBtn = false;
	private initFilterMenuFlag = true;
	private isManuallyFilter = false;

	// static
	private jobs: IJobEntity[] = [];
	private allEstHeader: IEstHeaderEntity[] = [];
	private versionEstHeader: IEstHeaderEntity[] = [];
	private jobFksOfVersionEstHeader: number[] = [];

	// => initFilterDataMenu -> est line item, est header, item assignment after load data
	// => initDefaultData -> selection change
	private prepareFilterButtonData(packageService: IEntitySelection<IPrcPackageEntity>) {
		const requests = [
			this.prepareJobFilter(packageService),
			this.prepareVersionEstHeaderFilter(packageService),
			this.prepareJobFksOfVersionEstHeader(packageService)
		];
		forkJoin(requests);
	}

	private async prepareVersionEstHeaderFilter(packageService: IEntitySelection<IPrcPackageEntity>) {
		const entity = packageService ? packageService.getSelectedEntity() : null;
		if (!entity) {
			return Promise.resolve([]);
		}

		const projectId = entity.ProjectFk;
		const param = {
			filter: '',
			projectFk: projectId
		};

		const result = await this.httpService.post<IEstimateCompositeEntity[]>('estimate/project/list', param);
		if (result && result.length > 0) {
			this.allEstHeader = result.map(item => item.EstHeader);
			this.versionEstHeader = this.allEstHeader.filter((item) => {
				return item.EstHeaderVersionFk && !item.IsActive;
			});
			this.versionEstHeader = this.versionEstHeader.sort((a, b) => (a.VersionNo || 0) - (b.VersionNo || 0));
		}
		return Promise.resolve(this.allEstHeader);
	}

	private async prepareJobFilter(packageService: IEntitySelection<IPrcPackageEntity>) {
		const entity = packageService ? packageService.getSelectedEntity() : null;
		if (!entity) {
			return Promise.resolve([]);
		}
		const projectId = entity.ProjectFk;
		this.jobs = await this.httpService.get<IJobEntity[]>('logistic/job/ownedByProject?projectFk=' + projectId);
		return this.jobs;
	}

	private async prepareJobFksOfVersionEstHeader(packageService: IEntitySelection<IPrcPackageEntity>) {
		const entity = packageService ? packageService.getSelectedEntity() : null;
		if (!entity) {
			return Promise.resolve([]);
		}
		const projectId = entity.ProjectFk;
		const param = {
			projectFks: [projectId],
			estHeaderIds: []
		};

		const result = await this.httpService.post<{
			estHeaderJobIds: number[],
			versionJobIds: number[]
		}>('estimate/main/header/GetJobIdsByEstHeaderIds', param);
		this.jobFksOfVersionEstHeader = result ? result.versionJobIds : [];
		return Promise.resolve(this.jobFksOfVersionEstHeader);
	}

	private async initFilterDataMenu(packageService: IEntitySelection<IPrcPackageEntity>/* , highlightJobIds */) {
		const entity = packageService ? packageService.getSelectedEntity() : null;
		if (!entity) {
			return Promise.resolve(true);
		}
		if (this.jobs.length && this.allEstHeader.length) {
			// if (dataService.getShowFilterBtn && !dataService.getShowFilterBtn()) {
			// 	dataService.onToolsUpdated.fire();
			// 	dataService.setShowFilterBtn(true);
			// }
			// if (dataService.getInitFilterMenuFlag && _.isFunction(dataService.getInitFilterMenuFlag) && dataService.getInitFilterMenuFlag()) {
			// 	dataService.hightLightNGetJob.fire(highlightJobIds);
			// 	dataService.setInitFilterMenuFlag(false);
			// }
			return Promise.resolve(true);
		}

		if (this.clear) {
			this.clear();
		}

		await this.prepareFilterButtonData(packageService);
		// if (dataService.onToolsUpdated) {
		// 	dataService.onToolsUpdated.fire();
		// }
		// if (dataService.setShowFilterBtn) {
		// 	dataService.setShowFilterBtn(true);
		// }
		//
		// if (dataService.getInitFilterMenuFlag && _.isFunction(dataService.getInitFilterMenuFlag) && dataService.getInitFilterMenuFlag()) {
		// 	dataService.hightLightNGetJob.fire(highlightJobIds);
		// 	dataService.setInitFilterMenuFlag(false);
		// }

		return Promise.resolve(true);
	}

	// => est line item, est header, item assignment
	private filterIncorporateDataRead(responseData: EstimateInfo[]/* , highlightJobIds: number[] */) {
		// const lookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
		// const prcPackageEstimateHeaderDataService = $injector.get('procurementPackageEstimateHeaderDataService');

		if (this.initFilterMenuFlag) {
			const highlightJobIds = this.jobFksOfVersionEstHeader;
			if (highlightJobIds && highlightJobIds.length > 0) {
				responseData = filterData(responseData, highlightJobIds);
			}
		} else if (this.jobIds && this.jobIds.length > 0) {
			responseData = filterData(responseData, this.jobIds);
		}

		function filterData(dataList: EstimateInfo[], jobFks: number[]) {
			const temp = dataList.filter((item) => {
				if (item.LgmJobFk && item.LgmJobFk > 0) {
					return jobFks.indexOf(item.LgmJobFk) > -1;
				} else if (item.EstHeaderFk) {
					// todo chi: lookup is not available
					// let estimateItem = _.find(lookupDescriptorService.getData('EstimateMainHeader'), {Id: item.EstHeaderFk});
					// if (!estimateItem && prcPackageEstimateHeaderDataService && prcPackageEstimateHeaderDataService.getList) {
					// 	const list = prcPackageEstimateHeaderDataService.getList();
					// 	estimateItem = _.find(list, {Id: item.EstHeaderFk});
					// }
					// if (estimateItem) {
					// 	return jobFks.indexOf(estimateItem.LgmJobFk) > -1 && estimateItem.EstHeaderVersionFk === null
					// 		&& (estimateItem.Active || estimateItem.IsActive) && estimateItem.IsGCOrder === false;
					// }
				}
				return true;
			});

			dataList.splice(0, dataList.length);
			temp.forEach((item) => {
				dataList.push(item);
			});
			return dataList;
		}

		return responseData;
	}


	// for two buttons: version header, active est header menu
	// todo chi: do it later
	// public getJobIdsByEstHeader(scope, args, type) {
	// 	let estHeaderIds = [];
	//
	// 	if (!scope.tool) {
	// 		scope.updateTools();
	// 	}
	//
	// 	if (type === 'versionHeader') {
	// 		estHeaderIds = args.estHeaderIds;
	// 	} else if (type === 'activeEstHeaderMenu') {
	// 		const versionFilterBtn = _.find(scope.tools.items, {'id': 'versionFilter'});
	// 		const activeEstHeaderMenu = _.find(versionFilterBtn.list.items, {'id': 'activeEstHeaderMenu'});
	// 		const _estHeaders = _.filter(allEstHeader, function (item) {
	// 			return !item.EstHeaderVersionFk && item.IsActive && !item.IsGCOrder;
	// 		});
	//
	// 		if (activeEstHeaderMenu) {
	// 			estHeaderIds = _.map(_estHeaders, 'Id');
	// 		}
	// 	}
	//
	// 	const param = {
	// 		estHeaderIds: estHeaderIds
	// 	};
	//
	// 	return $http.post(globals.webApiBaseUrl + 'estimate/main/header/GetJobIdsByEstHeaderIds', param).then(function (response) {
	// 		const jobDatas = response && response.data ? response.data : {};
	// 		if (!args.value) {
	// 			jobDatas.cancelJobFkIds = jobDatas.estHeaderJobIds;
	// 		} else {
	// 			jobDatas.highlightJobIds = jobDatas.estHeaderJobIds;
	// 		}
	// 		return jobDatas;
	// 	});
	// }

	private clear() {
		this.jobs = [];
		this.versionEstHeader = [];
		this.allEstHeader = [];
	}

	// initFilterMenu only use in project

	public override isParentFn(parentKey: IEstHeaderEntity, entity: IPackageEstimateLineItemEntity): boolean {
		return entity.EstLineItemFk === parentKey.Id;
	}
}