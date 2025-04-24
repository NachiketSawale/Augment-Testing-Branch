import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IPrcPackageImportEntity } from '../model/entities/prc-package-import-entity.interface';
import { inject, Injectable } from '@angular/core';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';
import { PlatformHttpService } from '@libs/platform/common';
import { ImportStatus } from '../model/enums/import-status.enum';
import { merge } from 'lodash';
import { IPrcPackageImportDialogEntity } from '../model/entities/prc-package-import-dialog-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class PackageImportDataService extends DataServiceFlatLeaf<IPrcPackageImportEntity, IPrcPackageEntity, PrcPackageCompleteEntity> {
	private readonly httpService = inject(PlatformHttpService);

	public constructor(protected procurementPackageHeaderDataService: ProcurementPackageHeaderDataService) {
		const options: IDataServiceOptions<IPrcPackageImportEntity> = {
			apiUrl: 'procurement/package/import',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IPrcPackageImportEntity, IPrcPackageEntity, PrcPackageCompleteEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcPackageImport',
				parent: procurementPackageHeaderDataService,
			},
		};
		super(options);
	}

	// region basic override
	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id,
			};
		}
		return {
			mainItemId: -1,
		};
	}

	protected override onLoadSucceeded(loaded: IPrcPackageImportEntity[]): IPrcPackageImportEntity[] {
		if (loaded) {
			loaded.forEach((item) => {
				if (item.WarningMessages) {
					item.WarningMessage = item.WarningMessages[0];
				} else {
					item.WarningMessage = '';
				}
				this.processFrontEndData(item);
			});
			return loaded;
		} else {
			return [];
		}
	}

	private processFrontEndData(item: IPrcPackageImportEntity): void {
		item.InsertTime = item.InsertedAt;
		if (item.WarningMessages && item.WarningMessages.length > 0) {
			const listPackageImportDialogEntity = [];
			for (let j = 0; j < item.WarningMessages.length; j++) {
				const packageImportDialogEntity: IPrcPackageImportDialogEntity = {
					Id: j,
					WarningMessage: item.WarningMessages[j],
				};
				listPackageImportDialogEntity.push(packageImportDialogEntity);
			}
			item.PrcPackageImportDialogEntity = listPackageImportDialogEntity;
		}
	}

	// endregion
	// region button logic
	public async importAgain(): Promise<void> {
		const selectedEntity = this.getSelectedEntity();
		if (selectedEntity) {
			const response = await this.httpService.get<IPrcPackageImportEntity>('procurement/package/import/importagain?id=' + selectedEntity.Id);
			if (response) {
				this.processFrontEndData(response);
				merge(selectedEntity, response);
			}
		}
	}

	public async cancel(): Promise<void> {
		const selectedEntity = this.getSelectedEntity();
		if (selectedEntity) {
			const response = await this.httpService.get<IPrcPackageImportEntity>('procurement/package/import/cancel?id=' + selectedEntity.Id);
			if (response) {
				if (response && response.Status === ImportStatus.Failed) {
					this.processFrontEndData(response);
					merge(selectedEntity, response);
					return;
				}
				if (response.Status === ImportStatus.Canceled) {
					const selectedEntitys = this.getSelection();
					const index = selectedEntitys.indexOf(selectedEntity);
					selectedEntitys.splice(index, 1);
				}
			}
		}
	}
	public override isParentFn(parentKey: IPrcPackageEntity, entity: IPrcPackageImportEntity): boolean {
		return entity.PrcPackageFk === parentKey.Id;
	}
	// endregion
}
