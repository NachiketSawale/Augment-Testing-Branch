/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { DataServiceHierarchicalLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { CosLineItemComplete } from '@libs/constructionsystem/interfaces';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { ESTIMATE_MAIN_RESOURCE_PROCESSOR_TOKEN, EstimateMainResourceImageProcessor } from '@libs/estimate/shared';
import { ConstructionSystemMainEstimateCompareFlags } from '../model/enums/cos-estimate-compare-flags-enum';
import { PlatformHttpService, PlatformLazyInjectorService } from '@libs/platform/common';
import { ReplaySubject } from 'rxjs';
import { get } from 'lodash';
import { ICosEstResourceEntity } from '../model/entities/cos-est-resource-entity.interface';
import { ICosEstLineItemEntity } from '../model/entities/cos-est-lineitem-entity.interface';
import { ConstructionSystemMainLineItemDataService } from './construction-system-main-line-item-data.service';

interface ILineItemCompareResult {
	isEqual: boolean;
	changedProperties: string[];
}
export const CONSTRUCTION_SYSTEM_MAIN_RESOURCE_DATA_TOKEN = new InjectionToken<ConstructionSystemMainResourceDataService>('constructionsystemMainResourceDataToken');

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainResourceDataService extends DataServiceHierarchicalLeaf<ICosEstResourceEntity, ICosEstLineItemEntity, CosLineItemComplete> {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	protected readonly estimateMainResourceImageProcessor = inject(EstimateMainResourceImageProcessor);
	private readonly http = inject(PlatformHttpService);
	protected calcResources$ = new ReplaySubject<null>(1);

	public constructor(private parentService: ConstructionSystemMainLineItemDataService) {
		const options: IDataServiceOptions<ICosEstResourceEntity> = {
			apiUrl: 'estimate/main/resource',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'gettree',
			},
			createInfo: {},
			// httpUpdate: {route: globals.webApiBaseUrl + 'constructionsystem/main/instance/', endUpdate: 'update'},  is it necessary?
			roleInfo: <IDataServiceChildRoleOptions<ICosEstResourceEntity, ICosEstLineItemEntity, CosLineItemComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'EstResource',
				parent: parentService,
			},
			entityActions: { createSupported: false, deleteSupported: false },
		};
		super(options);
		//processor ServiceDataProcessArraysExtension(['EstResources'] not ready
		this.processor.addProcessor(this.estimateMainResourceImageProcessor);
		this.addResourceProcessor();
	}

	private async addResourceProcessor() {
		const resourceProcessorProvider = await this.lazyInjector.inject(ESTIMATE_MAIN_RESOURCE_PROCESSOR_TOKEN);
		this.processor.addProcessor(resourceProcessorProvider);
	}

	public override parentOf(element: ICosEstResourceEntity): ICosEstResourceEntity | null {
		if (!element.EstResourceFk) {
			return null;
		}

		const parentId = element.EstResourceFk;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	public override childrenOf(element: ICosEstResourceEntity): ICosEstResourceEntity[] {
		return element.EstResources ?? [];
	}

	public override isParentFn(parentKey: ICosEstLineItemEntity, entity: ICosEstResourceEntity): boolean {
		return entity.EstLineItemFk === parentKey.Id && entity.EstHeaderFk === parentKey.EstHeaderFk;
	}

	private getParentEntity() {
		return this.parentService.getSelectedEntity();
	}

	protected override provideLoadPayload(): object {
		const selectedParent = this.getParentEntity();
		if (!selectedParent) {
			throw new Error('There should be a selected line item to load the resource data');
		}
		return {
			estHeaderId: selectedParent.EstHeaderFk,
			lineItemId: selectedParent.EstLineItemFk ?? selectedParent.Id,
		};
	}

	protected override onLoadSucceeded(loaded: ICosEstResourceEntity[]): ICosEstResourceEntity[] {
		const lineItemEntity = this.getParentEntity();
		if (!lineItemEntity) {
			return [];
		}
		if (lineItemEntity.CompareFlag !== ConstructionSystemMainEstimateCompareFlags.NoComparison) {
			// no need to compare resources because they come from line item's Reference Item and are readonly in module 'Estimte.Main'.
			if (lineItemEntity.EstLineItemFk) {
				const flag = lineItemEntity.CompareFlag === ConstructionSystemMainEstimateCompareFlags.Modified ? ConstructionSystemMainEstimateCompareFlags.Unmodified : lineItemEntity.CompareFlag;
				setFlagValueForTree(loaded, flag);
			} else {
				switch (lineItemEntity.CompareFlag) {
					case ConstructionSystemMainEstimateCompareFlags.New:
					case ConstructionSystemMainEstimateCompareFlags.Delete:
						setFlagValueForTree(loaded, lineItemEntity.CompareFlag);
						break;
					case ConstructionSystemMainEstimateCompareFlags.Modified:
					case ConstructionSystemMainEstimateCompareFlags.Unmodified:
						if (lineItemEntity.CompareLineItem) {
							this.http
								.get<IEstResourceEntity[]>('estimate/main/resource/gettree', {
									params: {
										estHeaderId: lineItemEntity.CompareLineItem.EstHeaderFk,
										lineItemId: lineItemEntity.CompareLineItem.EstLineItemFk ?? lineItemEntity.CompareLineItem.Id,
									},
								})
								.then((response) => {
									if (response) {
										const comparedList: IEstResourceEntity[] = [];
										compareResources(loaded, response, null, comparedList);
									}
								});
						}
						break;
				}
			}
		}

		/**
		 * set compare flag value for Tree items.
		 */
		function setFlagValueForTree(itemTree: ICosEstResourceEntity[], flag: number | null | undefined) {
			itemTree.forEach((item) => {
				item.CompareFlag = flag;
				if (item.EstResources?.length) {
					setFlagValueForTree(item.EstResources, flag);
				}
			});
		}

		function addItem(newItem: ICosEstResourceEntity, parentItem: ICosEstResourceEntity | null, itemList: ICosEstResourceEntity[]) {
			if (!parentItem) {
				if (!itemList.some((e) => e.Id == newItem.Id)) {
					itemList.push(newItem);
				}
			} else {
				if (!parentItem.EstResources?.some((i) => i.Id == newItem.Id)) {
					parentItem.EstResources = parentItem?.EstResources ?? [];
					parentItem.EstResources.push(newItem);
				}
			}
		}

		const compareProperties = [
			'EstResourceTypeFk',
			'QuantityDetail',
			'Quantity',
			'BasUomFk',
			'QuantityFactorDetail1',
			'QuantityFactor1',
			'QuantityFactorDetail2',
			'QuantityFactor2',
			'QuantityFactor3',
			'QuantityFactor4',
			'ProductivityFactorDetail',
			'ProductivityFactor',
			'EfficiencyFactorDetail1',
			'EfficiencyFactor1',
			'EfficiencyFactorDetail2',
			'EfficiencyFactor2',
			'QuantityFactorCc',
			'QuantityReal',
			'QuantityInternal',
			'QuantityUnitTarget',
			'QuantityTotal',
			'CostUnit',
			'BasCurrencyFk',
			'CostFactorDetail1',
			'CostFactor1',
			'CostFactorDetail2',
			'CostFactor2',
			'CostFactorCc',
			'CostUnitSubItem',
			'CostUnitLineItem',
			'CostUnitTarget',
			'CostTotal',
			'HoursUnit',
			'HoursUnitSubItem',
			'HoursUnitLineItem',
			'HoursUnitTarget',
			'HoursTotal',
			'IsLumpsum',
			'IsDisabled',
			'CommentText',
			'RuleType',
			'RuleCode',
			'RuleDescription',
			'EvalSequenceFk',
			'ElementCode',
			'ElementDescription',
			'IsIndirectCost',
			'Sorting',
		];

		/**
		 * compare estimate resources (tree) and return the compared list.
		 * only the new/old items in tree at the same level and has the same 'EstResourceTypeFk, Code' can be used to compare.
		 * e.g.
		 *       new                    old
		 *       1 ->                   3 ->
		 *          1.1 ->                  3.1 ->
		 *              1.1.1 ->
		 *       2 ->                   2 ->
		 *          2.1 ->                  2.1 ->
		 *                                      2.1.1 ->
		 *       3 ->                   1 ->
		 *
		 *   1 -> 1; 1.1 (new); 1.1.1 (new);
		 *   2 -> 2; 2.1 -> 2.1 ; 2.1.1 (deleted)
		 *   3 -> 3; 3.1 (deleted);
		 */
		function compareResources(newItems: ICosEstResourceEntity[] | null | undefined, oldItems: ICosEstResourceEntity[] | null | undefined, parentItem: ICosEstResourceEntity | null, list: IEstResourceEntity[]) {
			const newResources = newItems ?? [];
			const oldResources = oldItems ?? [];
			const oldResourceMap = new Map(oldResources.map((item) => [getKey(item), item]));
			for (const newItem of newResources) {
				const key = getKey(newItem);
				const oldItem = oldResourceMap.get(key);
				if (oldItem) {
					newItem.EstResources = []; // Prepare for comparison result
					oldItem.EstResources = [];
					const result = compareObjectProperties(newItem, oldItem, compareProperties);
					newItem.CompareFlag = result.isEqual ? ConstructionSystemMainEstimateCompareFlags.Unmodified : ConstructionSystemMainEstimateCompareFlags.Modified;
					addItem(newItem, parentItem, list);
					compareResources(newItem.EstResources, oldItem.EstResources, newItem, list);
					oldResourceMap.delete(key); // Remove old item to prevent re-comparison
				} else {
					newItem.CompareFlag = ConstructionSystemMainEstimateCompareFlags.New;
					if (newItem.EstResources) {
						setFlagValueForTree(newItem.EstResources, ConstructionSystemMainEstimateCompareFlags.New);
					}
					addItem(newItem, parentItem, list);
				}
			}
		}

		function getKey(item: ICosEstResourceEntity) {
			return `${item.EstResourceTypeFk}-${item.Code}`;
		}

		/**
		 * compare objects(properties) which has the same type.
		 * @param newItem: objA
		 * @param oldItem: objB
		 * @param compareProperties: the properties which need to be compared.
		 * @returns {{isEqual: boolean, changedProperties: Array}}:
		 */
		function compareObjectProperties(newItem: ICosEstResourceEntity, oldItem: ICosEstResourceEntity, compareProperties: string[]): ILineItemCompareResult {
			const result = {} as ILineItemCompareResult;
			const properties = Object.getOwnPropertyNames(newItem);
			properties.forEach((property) => {
				if (compareProperties.includes(property) && get(newItem, property) !== get(newItem, property)) {
					result.isEqual = false;
					result.changedProperties.push(property);
				}
			});
			return result;
		}

		//todo
		// data.sortByColumn(readData);
		// loadUserDefinedColumnValue();
		// estimateMainResourceProcessor.setDisabledChildrenReadOnly(serviceContainer.service.getList());
		return loaded ?? [];
	}

	public getCalcResources() {
		return this.calcResources$;
	}
}

/// todo DeleteResourceByDropDrag
/// todo dynamic column
