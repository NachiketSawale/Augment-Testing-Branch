/*
 * Copyright(c) RIB Software GmbH
 */

import { get } from 'lodash';
import { inject, Injectable } from '@angular/core';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { CompleteIdentification } from '@libs/platform/common';
import { EstimateMainResourceImageProcessor } from '@libs/estimate/shared';
import { DataServiceHierarchicalRoot, IDataServiceRoleOptions, ServiceRole, IDataServiceOptions, PlatformDataAccessListUtility } from '@libs/platform/data-access';
import { ConstructionSystemMasterLineItemDataService } from './construction-system-master-line-item-data.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterResourceDataService extends DataServiceHierarchicalRoot<IEstResourceEntity, CompleteIdentification<IEstResourceEntity>> {
	private readonly constructionSystemMasterLineItemDataService = inject(ConstructionSystemMasterLineItemDataService);
	protected readonly estimateMainResourceImageProcessor = inject(EstimateMainResourceImageProcessor);

	public constructor() {
		const options: IDataServiceOptions<IEstResourceEntity> = {
			apiUrl: '',
			entityActions: { createSupported: false, deleteSupported: false },
			roleInfo: <IDataServiceRoleOptions<IEstResourceEntity>>{
				role: ServiceRole.Root,
				itemName: 'Resource',
			},
		};

		super(options);

		// platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', () => false); // todo-allen: Is the onBeforeEditCell event required to be implemented?
		this.processor.addProcessor([this.estimateMainResourceImageProcessor]);

		this.constructionSystemMasterLineItemDataService.selectionChanged$.subscribe(() => {
			this.refreshData();
		});

		this.refreshData();
	}

	public override createUpdateEntity(modified: IEstResourceEntity | null): CompleteIdentification<IEstResourceEntity> {
		return {};
	}

	public override childrenOf(element: IEstResourceEntity): IEstResourceEntity[] {
		return element.EstResources ?? [];
	}

	public override parentOf(element: IEstResourceEntity): IEstResourceEntity | null {
		if (!element.EstResourceFk) {
			return null;
		}

		const parentId = element.EstResourceFk;
		const foundParent = this.flatList().find((candidate) => candidate.Id === parentId);
		if (foundParent === undefined) {
			return null;
		}

		return foundParent;
	}

	private refreshData() {
		this.setList([]); // clean data

		const lineItem = this.constructionSystemMasterLineItemDataService.getSelectedEntity();
		const estResources = get(lineItem, 'EstResources'); // todo-allen: The type of lineItem. Should the EstResources field be added to the IEstLineItemEntity interface?
		if (lineItem && Array.isArray(estResources)) {
			const data = PlatformDataAccessListUtility.sortTree(
				estResources,
				(item: IEstResourceEntity) => item.Code,
				(item: IEstResourceEntity) => item.EstResources ?? [],
			);
			this.setList(data);
		}

		this.flatList().forEach((item) => {
			item.EstResourceTypeFkExtend = item.EstResourceTypeFk;
			this.processor.process(item);
		});
	}
}
