import { inject, Injectable } from '@angular/core';
import { FrmStyle, ICreatePrcItemDto, IPrjStockContext, ProcurementCommonItemDataService, ProcurementCommonPriceConditionDataService } from '@libs/procurement/common';
import { ServerSideFilterValueType } from '@libs/ui/common';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { Package2HeaderDataService } from './package-2header-data.service';
import { IPackageItemEntity } from '../model/entities/package-item-entity.interface';
import { PackageItemComplete } from '../model/entities/package-item-complete.class';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { PrcPackage2HeaderComplete } from '../model/entities/package-2header-complete.class';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';
import { ServiceLocator } from '@libs/platform/common';
import { ProcurementPackagePriceConditionDataService } from './procurement-package-price-condition-data.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { ProcurementPackageItemValidationService } from './validations/procurement-package-item-validation.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageItemDataService extends ProcurementCommonItemDataService<IPackageItemEntity, PackageItemComplete, IPackage2HeaderEntity, PrcPackage2HeaderComplete> {
	private readonly packageHeaderDataService = inject(ProcurementPackageHeaderDataService);

	public constructor(public readonly package2HeaderDataService: Package2HeaderDataService) {
		super(
			package2HeaderDataService,
			{
				readInfo: {
					endPoint: 'list',
				},
				createInfo: {
					endPoint: 'create',
					usePost: true,
				},
			},
			ProcurementPackageItemValidationService,
		);

		this.package2HeaderDataService = package2HeaderDataService;
	}

	// region basic overload
	protected override provideLoadPayload(): object {
		const subPackage = this.package2HeaderDataService.getSelectedEntity();
		if (subPackage) {
			const dataPackage: IPrcPackageEntity | null = this.packageHeaderDataService.getSelectedEntity();
			if (dataPackage) {
				return {
					MainItemId: subPackage.PrcHeaderFk,
					projectId: dataPackage.ProjectFk,
					moduleName: ProcurementInternalModule.Package,
				};
			} else {
				throw new Error('There should be a selected package data');
			}
		} else {
			throw new Error('There should be a selected subpackage data');
		}
	}

	protected override provideCreatePayload(): object {
		const subPackage: IPackage2HeaderEntity | null = this.package2HeaderDataService.getSelectedEntity();
		if (subPackage) {
			const payload = super.provideCreatePayload() as ICreatePrcItemDto;
			if (subPackage.PrcHeaderEntity && subPackage.PrcHeaderEntity.TaxCodeFk) {
				payload.TaxCodeFk = subPackage.PrcHeaderEntity.TaxCodeFk;
			}
			payload.ProjectFk = this.headerContext.projectFk;
			payload.ConfigurationFk = this.headerEntity.ConfigurationFk;
			payload.PrcPackageFk = subPackage.PrcPackageFk;
			payload.PrcHeaderFk = subPackage.PrcHeaderFk;
			payload.IsPackage = true;
			payload.FrmStyle = FrmStyle.Package;
			payload.FrmHeaderFk = subPackage.PrcPackageFk;
			return payload;
		} else {
			throw new Error('There should be a selected subpackage data');
		}
	}

	protected override onCreateSucceeded(created: object): IPackageItemEntity {
		return super.onCreateSucceeded(created);
	}

	// endregion
	// region advance override
	public override createUpdateEntity(modified: IPackageItemEntity | null): PackageItemComplete {
		const complete = new PackageItemComplete();
		if (modified !== null) {
			complete.PrcItem = modified;
			complete.MainItemId = modified.Id;
		}
		return complete;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: PrcPackage2HeaderComplete, modified: PackageItemComplete[], deleted: IPackageItemEntity[]) {
		if (modified && modified.some(() => true)) {
			parentUpdate.PrcItemToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.PrcItemToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: PrcPackage2HeaderComplete): IPackageItemEntity[] {
		if (parentUpdate.PrcItemToSave) {
			const dataPackage2Header = [] as IPackageItemEntity[];
			parentUpdate.PrcItemToSave.forEach((updated) => {
				if (updated.PrcItem) {
					dataPackage2Header.push(updated.PrcItem);
				}
			});
			return dataPackage2Header;
		}
		return [];
	}

	public override isParentFn(parentKey: IPackage2HeaderEntity, entity: IPackageItemEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}

	// endregion
	// region item overload
	public override getStockContext(): IPrjStockContext {
		const selected = this.getSelectedEntity();
		if (selected) {
			return {
				materialFk: selected.MdcMaterialFk ?? undefined,
				materialStockFk: selected.MaterialStockFk ?? undefined,
			};
		}
		return {};
	}

	public override getAgreementLookupFilter(): ServerSideFilterValueType {
		return {
			filterDate: 'all',
		};
	}

	protected getPriceConditionService(): ProcurementCommonPriceConditionDataService<IPackageItemEntity, PackageItemComplete> {
		return ServiceLocator.injector.get(ProcurementPackagePriceConditionDataService);
	}

	// endregion
}
