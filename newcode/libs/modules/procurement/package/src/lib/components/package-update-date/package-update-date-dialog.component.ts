import {Component, inject} from '@angular/core';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { IPackageUpdateDateDialogOptionEntity, IPackageUpdateDateMessageEntity } from '../../model/entities/package-update-date-dialog-option.interface';
import { ProcurementPackageHeaderDataService } from '../../services/package-header-data.service';
import { UiCommonMessageBoxService } from '@libs/ui/common';

@Component({
	selector: 'procurement-package-import-dialog',
	templateUrl: './package-update-date-dialog.component.html',
	styleUrls: ['package-update-date-dialog.component.scss'],
})
export class ProcurementPackageUpdateDateDialogComponent  {
	private readonly translateService = inject(PlatformTranslateService);
	private readonly packageDataService = inject(ProcurementPackageHeaderDataService);
	private readonly http = inject(PlatformHttpService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	public dialogOption: IPackageUpdateDateDialogOptionEntity = {
		BodyText: this.translateService.instant('procurement.package.wizard.updateDate.bodyTitle').text,
		ContainerItemsText: this.translateService.instant('procurement.package.wizard.updateDate.containerItems').text,
		AllItemsText: this.translateService.instant('procurement.package.wizard.updateDate.allItems').text,
		RadioSelect: 'containerItems',
	};

	public async oK() {
		const dataPackage = this.packageDataService.getList();

		if (dataPackage) {
			const packageUpdateDateMessageEntity: IPackageUpdateDateMessageEntity = {
				ContainerListIds: [],
				IsUpdateAll: false,
				IsUpdated: false,
				MainItemId: -1,
				UpdatedCount: 0,
			};
			switch (this.dialogOption.RadioSelect) {
				case 'containerItems': {
					packageUpdateDateMessageEntity.IsUpdateAll = false;
					const updatedList = dataPackage.filter( (item) => {
						return item.ActivityFk && this.packageDataService.checkIfCurrentLoginCompany(item);
					});

					if ( updatedList.length > 0) {
						packageUpdateDateMessageEntity.ContainerListIds = updatedList.map(e=>e.Id);
					}
					if (updatedList.length === 0) {
						return this.handleUpdateDateResult(packageUpdateDateMessageEntity);
					}
					break;
				}
				case 'allItems': {
					packageUpdateDateMessageEntity.IsUpdateAll = true;
					break;
				}
			}
			const selectData=this.packageDataService.getSelectedEntity();
			if (selectData) {
				packageUpdateDateMessageEntity.MainItemId = selectData.Id;
			} else {
				packageUpdateDateMessageEntity.MainItemId = -1;
			}
			const respond = await this.http.post<IPackageUpdateDateMessageEntity>('procurement/package/wizard/updatedate', packageUpdateDateMessageEntity);
			if (respond) {
				await this.handleUpdateDateResult(respond);
			}
		}
	}

	private async handleUpdateDateResult(result: IPackageUpdateDateMessageEntity) {
		let bodyText: string;
		let isUpdated = result.IsUpdated;
		const updatedCount = result.UpdatedCount;
		if (!result.IsUpdated) {
			bodyText = this.translateService.instant('procurement.package.wizard.updateDate.noActivity').text;
		} else if (result.UpdatedCount === 0) {
			bodyText = this.translateService.instant('procurement.package.wizard.updateDate.notUpdate').text;
			isUpdated = false;
		} else if (result.UpdatedCount === 1) {
			bodyText = this.translateService.instant('procurement.package.wizard.updateDate.bodyTextKey').text.replace('(qty)', updatedCount.toString()).replace('(s)', '');
		} else {
			bodyText = this.translateService.instant('procurement.package.wizard.updateDate.bodyTextKey').text.replace('(qty)', updatedCount.toString()).replace('(s)', 's');
		}

		if (isUpdated) {
			    const reloadData = await this.packageDataService.refreshAllLoaded();
				 if (reloadData) {
					 await this.packageDataService.select(null);
					 const  firstSelectData=reloadData.find(e => e.Id === result.MainItemId);
					 if(firstSelectData){
						 await this.packageDataService.select(firstSelectData);
					 }
				 }
		}

		await this.messageBoxService.showMsgBox(bodyText, this.translateService.instant('cloud.common.informationDialogHeader').text,
			'ico-info',
			'message',
			false,
		);
	}

}