/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DataServiceHierarchicalLeaf, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { IPrrHeaderEntity } from '../model/entities/prr-header-entity.interface';
import { PrrHeaderComplete } from '../model/complete-class/prr-header-complete.class';
import { ControllingRevenueRecognitionDataService } from '../revenue-recognition/revenue-recognition-data.service';
import { IPrrItemE2cEntity } from '../model/entities/prr-item-e2c-entity.interface';
import { PlatformHttpService } from '@libs/platform/common';

/**
 * Controlling Revenue Recognition estimate to complete Item data service
 */
@Injectable({
	providedIn: 'root',
})
export class ControllingRevenueRecognitionItemE2cDataService extends DataServiceHierarchicalLeaf<IPrrItemE2cEntity, IPrrHeaderEntity, PrrHeaderComplete> {
	private readonly http = inject(PlatformHttpService);

	public constructor(protected parentService: ControllingRevenueRecognitionDataService) {
		const options: IDataServiceOptions<IPrrItemE2cEntity> = {
			apiUrl: 'controlling/RevenueRecognition/itemE2c',
			readInfo: {
				endPoint: 'tree',
			},
			roleInfo: <IDataServiceRoleOptions<IPrrItemE2cEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PrrItemE2c',
				parent: parentService
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false
			}
		};
		super(options);
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

	protected override onLoadSucceeded(loaded: object): IPrrItemE2cEntity[] {
		const entities = loaded as IPrrItemE2cEntity[];
		return entities;
	}


	public override childrenOf(element: IPrrItemE2cEntity): IPrrItemE2cEntity[] {
		return element.PrrItemE2cChildren ?? [];
	}

	public override parentOf(element: IPrrItemE2cEntity): IPrrItemE2cEntity | null {
		if (element.ParentId === undefined) {
			return null;
		}

		const parentId = element.ParentId;
		const foundParent = this.flatList().find((candidate) => candidate.Id === parentId);

		if (foundParent === undefined) {
			return null;
		}

		return foundParent;
	}

	public async refreshItem() {
		const headerId = this.parentService.getSelectedEntity()!.Id;
		const response = await this.http.get('controlling/RevenueRecognition/itemE2c/refresh', {
			params: {
				mainItemId: headerId,
			},
		});
		if (response) {
			//todo need reload current e2c container
			//this.load();
		}
	}

}
