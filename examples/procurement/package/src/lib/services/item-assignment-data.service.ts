/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceHierarchicalLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IPrcItemAssignmentEntity, IPrcItemAssignmentHelper, IPrcItemAssignmentLoadedEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';
import { BasicsSharedPackageStatusLookupService } from '@libs/basics/shared';
import { PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { ProcurementPackageItemDataService } from './procurement-package-item-data.service';
import { ProcurementPackageItemAssignmentReadonlyProcessorService } from './processors/item-assignment-readonly-processor.service';
import { ProcurementPackageItemAssignmentValidationService } from './validations/item-assignment-validation.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageItemAssignmentDataService extends DataServiceHierarchicalLeaf<IPrcItemAssignmentEntity, IPrcPackageEntity, PrcPackageCompleteEntity> {
	private readonly packageStatusService = inject(BasicsSharedPackageStatusLookupService);
	private readonly httpService = inject(PlatformHttpService);
	public readonly readonlyProcessor: ProcurementPackageItemAssignmentReadonlyProcessorService;

	public constructor(public packageDataService: ProcurementPackageHeaderDataService) {
		const options: IDataServiceOptions<IPrcItemAssignmentEntity> = {
			apiUrl: 'procurement/common/prcitemassignment',
			readInfo: {
				endPoint: 'tree',
				prepareParam: (iden) => {
					return {
						MainItemId: iden.pKey1 ?? -1,
					};
				},
			},
			createInfo: {
				endPoint: 'createnew',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IPrcItemAssignmentEntity, IPrcPackageEntity, PrcPackageCompleteEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcItemAssignment',
				parent: packageDataService,
			},
		};
		super(options);

		this.readonlyProcessor = new ProcurementPackageItemAssignmentReadonlyProcessorService(this);
		this.processor.addProcessor([this.readonlyProcessor]);
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				MainItemId: parentSelection.Id
			};
		}
		// todo other logic
		return {
			MainItemId: -1
		};
	}

	protected override onLoadSucceeded(loaded: IPrcItemAssignmentLoadedEntity): IPrcItemAssignmentEntity[] {
		// todo chi: common service is not available
		// let highlightJobIds = [];
		// readData = procurementCommonFilterJobVersionToolService.filterIncorporateDataRead(service, readData, highlightJobIds);
		// basicsLookupdataLookupDescriptorService.attachData(readData);
		// procurementCommonFilterJobVersionToolService.initFilterDataMenu(service, procurementPackageDataService, highlightJobIds);
		// todo chi: lookup cache data
		return loaded.Main;
	}

	protected override provideCreatePayload(): object {
		// todo chi: common service is not available
		// var prcBoqMainService = $injector.get('prcBoqMainService');
		// var boqMainService = prcBoqMainService.getService(procurementContextService.getMainService());
		// var selectedBoqItem = boqMainService.getSelected();
		const creationData: IPrcItemAssignmentHelper = {
			MainItemId: this.packageDataService.getSelectedEntity()!.Id,
			PrcPackageFk: this.packageDataService.getSelectedEntity()!.Id,
		};
		// todo chi: common service is not available
		// if (selectedBoqItem && selectedBoqItem.BoqLineTypeFk === 0) {
		// 	creationData.BoqHeaderId = selectedBoqItem.BoqHeaderFk;
		// 	creationData.BoqItemId = selectedBoqItem.Id;
		// }
		return creationData;
	}

	protected override onCreateSucceeded(created: object): IPrcItemAssignmentEntity {
		return created as unknown as IPrcItemAssignmentEntity;
	}

	public override parentOf(element: IPrcItemAssignmentEntity): IPrcItemAssignmentEntity | null {
		if (!element.PrcItemAssignmentFk) {
			return null;
		}

		const parentId = element.PrcItemAssignmentFk;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	public override childrenOf(element: IPrcItemAssignmentEntity): IPrcItemAssignmentEntity[] {
		return element.PrcItemAssignments ?? [];
	}

	public override canDelete(): boolean {
		const can = super.canDelete();
		if (!can) {
			return can;
		}

		return !this.isProtectContractedPackage();
	}

	public override isParentFn(parentKey: IPrcPackageEntity, entity: IPrcItemAssignmentEntity): boolean {
		return entity.PrcPackageFk === parentKey.Id;
	}

	public override delete(entities: IPrcItemAssignmentEntity[] | IPrcItemAssignmentEntity) {
		super.delete(entities);

		const validationService = ServiceLocator.injector.get(ProcurementPackageItemAssignmentValidationService);
		const temp = Array.isArray(entities) ? entities : [entities];
		validationService.validateAfterDeleteEntities(temp);
	}

	public async relCalculationItemBudget() {
		const packageEntity = this.packageDataService.getSelectedEntity();
		if (!packageEntity) {
			return;
		}
		const packageId = packageEntity.Id;
		const reqUrl = 'procurement/common/prcitemassignment/relCalculationItemBudget?packageId=' + packageId;
		await this.httpService.get(reqUrl);
		const itemDataService = ServiceLocator.injector.get(ProcurementPackageItemDataService);
		itemDataService.load({ id: 0, pKey1: packageId });
		// todo chi: common logic is not available
		// var totalDataService = procurementCommonTotalDataService.getService(packageService);
		// totalDataService.load();
	}

	public isProtectContractedPackage() {
		const item = this.getSelectedEntity();
		if (!item) {
			return false;
		}
		const isProtectContractedPackageItemAssignment = this.packageDataService.isProtectContractedPackageItemAssignment();
		if (isProtectContractedPackageItemAssignment && item && item.Version) {
			if (item.IsContracted) {
				return true;
			}
			const parentItem = this.packageDataService.getSelectedEntity();
			if (parentItem) {
				const pakStatus = this.packageStatusService.syncService?.getListSync();
				const status = pakStatus?.find((e) => e.Id === parentItem.PackageStatusFk);
				if (status) {
					return status.IsContracted;
				}
			}
		}
		return false;
	}
}