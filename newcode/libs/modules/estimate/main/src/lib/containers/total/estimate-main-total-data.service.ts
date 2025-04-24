/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { DataServiceFlatNode, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { MainDataDto } from '@libs/basics/shared';
import { IIdentificationData, PlatformConfigurationService, PlatformPermissionService, PlatformTranslateService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { IEstCostTotalEntity } from '@libs/estimate/interfaces';
import { EstimateMainTotalKeyEnum } from './enum/estimate-main-total-key.enum';
import { EstimateMainService } from '../../containers/line-item/estimate-main-line-item-data.service';
import { EstimateMainTotalTranslateEnum } from './enum/estimate-main-total-translate.enum';
import { Subject } from 'rxjs';

export const EstimateMainTotalDataServiceToken = new InjectionToken<EstimateMainTotalDataService>('estimate-main-total-data-service-token');

@Injectable({ providedIn: 'root' })
export class EstimateMainTotalDataService extends DataServiceFlatNode<IEstCostTotalEntity, never, never, never> {
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly platformPermissionService = inject(PlatformPermissionService);
	private readonly injector = inject(Injector);
	private readonly translateService = inject(PlatformTranslateService);

	private _totalKey: EstimateMainTotalKeyEnum = EstimateMainTotalKeyEnum.LineItem;

	public totalKeyChanged$ = new Subject<string | null>();

	public constructor(private parentService: EstimateMainService) {
		const options: IDataServiceOptions<IEstCostTotalEntity> = {
			apiUrl: 'estimate/main/resource',
			roleInfo: <IDataServiceRoleOptions<IEstCostTotalEntity>>{
				role: ServiceRole.Node,
				itemName: 'ConfigTotal',
				parent: parentService,
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'assembliesconfigtotal',
				usePost: true
			}
		};
		super(options);
	}

	protected override onLoadSucceeded(loaded: object): IEstCostTotalEntity[] {
		const resDto = new MainDataDto<IEstCostTotalEntity>(loaded);
		return resDto.getValueAs<IEstCostTotalEntity[]>('ConfigTotalResult') || ([] as IEstCostTotalEntity[]);
	}

	protected override provideLoadPayload(): object {
		//TODO
		// depend on cloudDesktopSidebarService,platformGenericStructureService
		// get sidebar filter

		/* let filterRequest = _.cloneDeep(cloudDesktopSidebarService.getFilterRequestParams());
		requestParams.filterRequest = filterRequest;
		if(requestParams.prjProjectFk<=0) {
			requestParams.estHeaderFk =  estimateMainService.getSelectedEstHeaderId() || -1;
			requestParams.prjProjectFk = estimateMainService.getSelectedProjectId() || -1;
		}

		let groupingFilter = platformGenericStructureService.getGroupingFilterRequest();
		if (groupingFilter) {
			requestParams.filterRequest.groupingFilter = groupingFilter;
		}

		if(angular.isUndefined(requestParams.configTotalType) || requestParams.configTotalType === 'lineItem_total'){
			fillParamWithLineItemIds(requestParams);
		}else{
			estimateMainService.extendSearchFilter(requestParams.filterRequest);
		}

		angular.extend(readData, requestParams); */

		return this.buildRequestParams();
	}

	private getTestData() {
		return {
			estHeaderFk: 1005001,
			estimateDescription: '6 - 131532/replace',
			prjProjectFk: 1007720,
			projectName: '20210927_ZORA - zora',
			lineItemIds: [6458326]
		};
	}

	private buildRequestParams(): object {
		// const projectName = this.getTestData().projectName; //this.estimateMainContextService.getSelectedProjectInfo()?.ProjectName;
		// const estimateDescription = this.getTestData().estimateDescription; //this.estimateMainContextService.getSelectedEstHeaderItem()?.DescriptionInfo?.Translated;
		// const estHeaderFk = this.getTestData().estHeaderFk; //this.estimateMainContextService.getSelectedEstHeaderId();
		// const prjProjectFk = this.getTestData().prjProjectFk; //this.estimateMainContextService.getSelectedProjectId();
		// const lineItemIds = this.getTestData().lineItemIds; //selectedLineItems.map((v) => v.Id);
		const projectName = this.estimateMainContextService.getSelectedProjectInfo()?.ProjectName;
		const estimateDescription = this.estimateMainContextService.getSelectedEstHeaderItem()?.DescriptionInfo?.Translated;
		const estHeaderFk = this.estimateMainContextService.getSelectedEstHeaderId();
		const prjProjectFk = this.estimateMainContextService.getSelectedProjectId();
		const selectedLineItems = this.parentService.getSelection();
		const lineItemIds = selectedLineItems.map((v) => v.Id);

		const readyToLoad = lineItemIds.length > 0;
		return {
			configTotalType: this._totalKey.toString(),
			estHeaderFk: estHeaderFk ?? -1,
			prjProjectFk: prjProjectFk ?? -1,
			readyToLoad: readyToLoad,
			lineItemIds: lineItemIds,
			filter: '',
			filterRequest: {
				ExecutionHints: false,
				IncludeNonActiveItems: false,
				PageNumber: 0,
				PageSize: 1000,
				PinningContext: [
					{ token: 'estimate.main', id: estHeaderFk, info: estimateDescription },
					{ token: 'project.main', id: prjProjectFk, info: projectName },
				],
				ProjectContextId: prjProjectFk,
				UseCurrentClient: true,
				...(this._totalKey !== EstimateMainTotalKeyEnum.LineItem
					? {
							furtherFilters: [{ Token: 'EST_HEADER', Value: estHeaderFk }, { Token: 'EST_LINE_ITEM' }],
							orderBy: [{ Field: 'Code' }],
						}
					: {}),
			},
			...(this._totalKey !== EstimateMainTotalKeyEnum.Filter
				? {
						BoqItemFk: [],
						CostGroupFk: [],
						EstAssemblyCatFk: [],
						Id: [],
						MdcControllingUnitFk: [],
						PrcStructureFk: [],
						PrjLocationFk: [],
						PsdActivityFk: [],
						WicBoqItemFk: []
					}
				: {}),
		};
	}

	public set TotalKey(key: EstimateMainTotalKeyEnum) {
		this._totalKey = key;
	}

	public get TotalKey(): EstimateMainTotalKeyEnum {
		return this._totalKey;
	}

	private TotalTitleTranslate() {
		switch (this._totalKey) {
			case EstimateMainTotalKeyEnum.LineItem:
				return EstimateMainTotalTranslateEnum.LineItem;
			case EstimateMainTotalKeyEnum.Filter:
				return EstimateMainTotalTranslateEnum.Filter;
			case EstimateMainTotalKeyEnum.Grand:
				return EstimateMainTotalTranslateEnum.Grand;
			default:
				return EstimateMainTotalTranslateEnum.Grand;
		}
	}

	public get TotalTitle() {
		return this.translateService.instant(this.TotalTitleTranslate()).text;
	}

	public recalculateTotalValues(key: EstimateMainTotalKeyEnum): void {
		this.TotalKey = key;
		this.updateTotalTile(this.TotalTitle);
		void this.load({} as IIdentificationData);
	}

	private updateTotalTile(newValue: string | null) {
		this.totalKeyChanged$.next(newValue);
	}
}
