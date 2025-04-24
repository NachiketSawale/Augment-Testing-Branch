/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DataServiceHierarchicalLeaf, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { IPrrHeaderEntity } from '../model/entities/prr-header-entity.interface';
import { PrrHeaderComplete } from '../model/complete-class/prr-header-complete.class';
import { IPrrItemEntity } from '../model/entities/prr-item-entity.interface';
import { ControllingRevenueRecognitionDataService } from '../revenue-recognition/revenue-recognition-data.service';
import { PlatformHttpService } from '@libs/platform/common';
import { ControllingRevenueRecognitionItemReadonlyProcessor } from './revenue-recognition-item-readonly-processor.class';

/**
 * Controlling Revenue Recognition Item data service
 */
@Injectable({
	providedIn: 'root',
})
export class ControllingRevenueRecognitionItemDataService extends DataServiceHierarchicalLeaf<IPrrItemEntity, IPrrHeaderEntity, PrrHeaderComplete> {
	private readonly http = inject(PlatformHttpService);
	public readonly readonlyProcessor = new ControllingRevenueRecognitionItemReadonlyProcessor(this);

	public constructor(protected parentService: ControllingRevenueRecognitionDataService) {
		const options: IDataServiceOptions<IPrrItemEntity> = {
			apiUrl: 'controlling/RevenueRecognition/item',
			readInfo: {
				endPoint: 'tree',
			},
			roleInfo: <IDataServiceRoleOptions<IPrrItemEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PrrItems',
				parent: parentService
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false
			}
		};
		super(options);
		this.processor.addProcessor(this.readonlyProcessor);
	}

	/**
	 * Provide the load payload here
	 * @protected
	 */
	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		} else {
			throw new Error('There should be a selected parent catalog to load the header data');
		}
	}

	protected override onLoadSucceeded(loaded: object): IPrrItemEntity[] {
		const entities = loaded as IPrrItemEntity[];
		this.setIndexForStaticGroupType(entities);
		return entities;
	}

	private setIndexForStaticGroupType(items: IPrrItemEntity[], parent: IPrrItemEntity | null = null) {
		items.forEach(item => {
			// Set parent index
			item.PrrItemParentIdx = item.PrrItemParentId === 0 && parent ? parent.Idx : item.PrrItemParentId.toString();

			// Set Idx based on conditions
			item.Idx = item.Id === 0
				? `${item.StaticItemType}_${item.PrrAccrualType}_${item.PrrItemParentId}_${item.Code}`
				: item.Id.toString();

			// Recursively process child items if they exist
			if (item.PrrItems?.length) {
				this.setIndexForStaticGroupType(item.PrrItems, item);
			}
		});
	}


	public override childrenOf(element: IPrrItemEntity): IPrrItemEntity[] {
		return element.PrrItems ?? [];
	}

	public override parentOf(element: IPrrItemEntity): IPrrItemEntity | null {
		if (element.PrrItemParentIdx === undefined) {
			return null;
		}

		const parentId = element.PrrItemParentIdx;
		const foundParent = this.flatList().find((candidate) => candidate.Idx === parentId);

		if (foundParent === undefined) {
			return null;
		}

		return foundParent;
	}

	public async refreshItem() {
		const headerId = this.parentService.getSelectedEntity()!.Id;
		const response = await this.http.get('controlling/RevenueRecognition/item/refresh', {
			params: {
				mainItemId: headerId,
			},
		});
		if (response) {
			//todo need reload current item container
			//this.load();
		}
	}

}
