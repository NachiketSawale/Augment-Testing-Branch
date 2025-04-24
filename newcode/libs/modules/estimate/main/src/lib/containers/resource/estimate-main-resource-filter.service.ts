/*
 * Copyright(c) RIB Software GmbH
 */

import { ResourceBaseComplete } from '@libs/estimate/shared';
import { inject, Injectable } from '@angular/core';
import { EstimateMainService } from '../../containers/line-item/estimate-main-line-item-data.service';
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { ISearchResult } from '@libs/platform/common';
import { EstMainResFilterTitleType, EstMainResFilterType } from '../../model/enums/estimate-main-resource-filter-type.enum';
import { MainDataDto } from '@libs/basics/shared';
import { ConcreteMenuItem, ItemType } from '@libs/ui/common';
import { EstimateMainResourceService } from './estimate-main-resource-data.service';
import { IEstResourceEntity } from '@libs/estimate/interfaces';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainResourceFilterService extends DataServiceHierarchicalRoot<IEstResourceEntity, ResourceBaseComplete> {
	private readonly estimateMainService = inject(EstimateMainService);
	private readonly estimateMainResourceService = inject(EstimateMainResourceService);

	private lastSelectedFilterKey: EstMainResFilterType | null = null;

	public constructor() {
		const dataServiceOptions: IDataServiceOptions<IEstResourceEntity> = {
			apiUrl: 'estimate/main/resource',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filteredresources',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<IEstResourceEntity>>{
				role: ServiceRole.Root,
				itemName: 'EstResource'
			}
		};
		super(dataServiceOptions);
	}

	public override provideLoadByFilterPayload(): object {
		const selected = this.estimateMainService.getSelectedEntity();
		return selected
			? {
					estHeaderFk: selected.EstHeaderFk,
					estLineItemFk: selected.Id,
					projectId: selected.ProjectFk,
					lastSelectedFilterKey: this.lastSelectedFilterKey
				}
			: {};
	}

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IEstResourceEntity> {
		const data = new MainDataDto<IEstResourceEntity>(loaded);
		const dtos = data.getValueAs<IEstResourceEntity[]>('dtos') ?? ([] as IEstResourceEntity[]);
		this.estimateMainResourceService.updateList(dtos);
		return {
			FilterResult: {},
			dtos: dtos,
		} as ISearchResult<IEstResourceEntity>;
	}

	public loadData(filterKey: EstMainResFilterType) {
		this.lastSelectedFilterKey = filterKey;
		void this.refreshAll();
	}

	/**
	 * add the tool bar btn
	 */
	public initFilterTools(): ConcreteMenuItem[] {
		return [
			{
				id: 'resourceFilterTypes',
				type: ItemType.Sublist,
				hideItem: false,
				list: {
					cssClass: 'radio-group',
					showTitles: true,
					items: [
						{
							id: 'all_resources',
							caption: EstMainResFilterTitleType.AllResources,
							type: ItemType.Radio,
							value: EstMainResFilterType.AllResources,
							iconClass: 'tlb-icons ico-res-show-all',
							fn: () => {
								this.loadData(EstMainResFilterType.AllResources);
							},
							disabled: false,
							hideItem: false
						},
						{
							id: 'with_rule',
							caption: EstMainResFilterTitleType.ResWithRule,
							type: ItemType.Radio,
							value: EstMainResFilterType.ResWithRule,
							iconClass: 'tlb-icons ico-res-show-rules',
							fn: () => {
								this.loadData(EstMainResFilterType.ResWithRule);
							},
							disabled: false,
							hideItem: false
						},
						{
							id: 'without_rules',
							caption: EstMainResFilterTitleType.ResWithoutRule,
							type: ItemType.Radio,
							value: EstMainResFilterType.ResWithoutRule,
							iconClass: 'tlb-icons ico-res-show-norules',
							fn: () => {
								this.loadData(EstMainResFilterType.ResWithoutRule);
							},
							disabled: false,
							hideItem: false
						},
						{
							id: 'without_disable',
							caption: EstMainResFilterTitleType.ResWithoutDisable,
							type: ItemType.Radio,
							value: EstMainResFilterType.ResWithoutDisable,
							iconClass: 'tlb-icons ico-res-show-notdisabled',
							fn: () => {
								this.loadData(EstMainResFilterType.ResWithoutDisable);
							},
							disabled: false,
							hideItem: false
						},
					],
				},
			},
		] as ConcreteMenuItem[];
	}

	/**
	 *  get last filter key
	 */
	public getLastSelectedFilterKey(): EstMainResFilterType | null {
		return this.lastSelectedFilterKey;
	}

	/**
	 * set last filter key
	 * @param key
	 */
	public setLastSelectedFilterKey(key: EstMainResFilterType) {
		this.lastSelectedFilterKey = key;
	}

	// TODO set tool bar btn active
	public activateIcon(/* scope, resFilterKey */) {
		// this.setActiveIcon(scope, resFilterKey);
	}

	private setActiveIcon(/* scope, resKey */) {
		/* if(!_.includes(_.keys(titles), resKey)) {
			resKey = _.head(_.keys(titles));
		}
		try {
			_.find(scope.tools.items, function (i) {
				return i.filterIconsGroup === 'resourceFilterTypes';
			}).list.activeValue = resKey;
			lastSelectedFilterKey = resKey;
			scope.tools.update();
		} catch (e) {
			return;
		} */
	}
}
