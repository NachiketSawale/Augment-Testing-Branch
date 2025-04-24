/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {DataServiceHierarchicalLeaf, IDataServiceChildRoleOptions, ServiceRole} from '@libs/platform/data-access';
import {IPackageEstimateResourceEntity} from '../model/entities/package-estimate-resource-entity.interface';
import {IPackageEstimateLineItemEntity} from '../model/entities/package-estimate-line-item-entity.interface';
import {ProcurementPackageEstimateLineItemDataService} from './package-estimate-line-item-data.service';
import {
	ProcurementPackageEstimateResourceTypeProcessorService
} from './processors/package-estimate-resource-type-processor.service';
import {ProcurementPackageHeaderDataService} from './package-header-data.service';
import {get} from 'lodash';
import {
	ProcurementPackageEstimateResourceReadonlyProcessorService
} from './processors/package-estimate-resource-readonly-processor.service';
import {PlatformLazyInjectorService} from '@libs/platform/common';
import {ESTIMATE_MAIN_RESOURCE_IMAGE_PROCESSOR_TOKEN} from '@libs/estimate/shared';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageEstimateResourceDataService extends DataServiceHierarchicalLeaf<IPackageEstimateResourceEntity, IPackageEstimateLineItemEntity, object> {

	private readonly readonlyProcessor: ProcurementPackageEstimateResourceReadonlyProcessorService;
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public constructor(
		protected readonly estLineItemService: ProcurementPackageEstimateLineItemDataService,
		protected readonly packageService: ProcurementPackageHeaderDataService,
	) {
		const options = {
			apiUrl: 'estimate/main/resource',
			readInfo: {
				endPoint: 'tree',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IPackageEstimateResourceEntity, IPackageEstimateLineItemEntity, object>>{
				role: ServiceRole.Leaf,
				itemName: 'EstResource',
				parent: estLineItemService,
			},
			entityActions: {
				deleteSupported: false,
				createSupported: false,
			},
		};
		super(options);
		const resourceTypeProcessor = new ProcurementPackageEstimateResourceTypeProcessorService();
		this.readonlyProcessor = new ProcurementPackageEstimateResourceReadonlyProcessorService(this);
		this.processor.addProcessor([resourceTypeProcessor, this.readonlyProcessor]);
		this.lazyInjector.inject(ESTIMATE_MAIN_RESOURCE_IMAGE_PROCESSOR_TOKEN)
			.then((processor) => {
				this.processor.addProcessor(processor);
			});
	}

	protected override provideLoadPayload(): object {
		const selectedItem = this.estLineItemService.getSelectedEntity();
		const readData: {
			estHeaderFk?: number,
			estLineItemFk?: number,
			projectId?: number
		} = {};

		if (!selectedItem) {
			return readData;
		}

		readData.estHeaderFk = selectedItem.EstHeaderFk;
		if (selectedItem.EstLineItemFk && selectedItem.EstLineItemFk > 0) {
			readData.estLineItemFk = selectedItem.EstLineItemFk;
		} else {
			readData.estLineItemFk = selectedItem.Id;
		}

		const currentPackageItem = this.packageService.getSelectedEntity();
		if (currentPackageItem && currentPackageItem.ProjectFk) {
			readData.projectId = currentPackageItem.ProjectFk;
		}

		return readData;
	}

	protected override onLoadSucceeded(loaded: object): IPackageEstimateResourceEntity[] {
		// todo chi: need the lazy injection for IEstResourceResponseEntity
		// todo chi: lookup data
		// todo chi: need the lazy injection for EstimateMainCharacteristicCommonFunService setDynamicColumnsData
		if (loaded) {
			return get(loaded, 'dtos', []);
		}
		return [];
	}

	public override parentOf(element: IPackageEstimateResourceEntity): IPackageEstimateResourceEntity | null {
		if (!element.EstResourceFk) {
			return null;
		}

		const parentId = element.EstResourceFk;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	public override childrenOf(element: IPackageEstimateResourceEntity): IPackageEstimateResourceEntity[] {
		return element.EstResources ?? [];
	}

	public override isParentFn(parentKey: IPackageEstimateLineItemEntity, entity: IPackageEstimateResourceEntity): boolean {
		return entity.EstLineItemFk === parentKey.Id && entity.EstHeaderFk === parentKey.EstHeaderFk;
	}

}