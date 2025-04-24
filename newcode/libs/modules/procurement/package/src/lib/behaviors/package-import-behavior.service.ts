import { Injectable, inject } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPrcPackageImportEntity } from '../model/entities/prc-package-import-entity.interface';
import { PackageImportDataService } from '../services/package-import-data.service';
import { InsertPosition, ItemType } from '@libs/ui/common';
import { ImportStatus } from '../model/enums/import-status.enum';

@Injectable({
	providedIn: 'root',
})
export class PackageImportBehavior implements IEntityContainerBehavior<IGridContainerLink<IPrcPackageImportEntity>, IPrcPackageImportEntity> {
	private dataService = inject(PackageImportDataService);

	public onCreate(containerLink: IGridContainerLink<IPrcPackageImportEntity>) {
		containerLink.uiAddOns.toolbar.addItemsAtId(
			[
				{
					id: 'taskBarImport',
					caption: { key: 'cloud.common.taskBarImport' },
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-rec-new',
					disabled: () => {
						const currentItem = this.dataService.getSelectedEntity();
						if (!currentItem || !currentItem.Id || currentItem.Status !== ImportStatus.Failed) {
							return true;
						}
						return false;
					},
					fn: async () => {
						await this.dataService.importAgain();
					},
				},
				{
					id: 'taskBarCancel',
					caption: { key: 'cloud.common.taskBarCancel' },
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-rec-delete',
					disabled: () => {
						const currentItem = this.dataService.getSelectedEntity();
						if (!currentItem || !currentItem.Id || currentItem.Status !== ImportStatus.Failed) {
							return true;
						}
						return false;
					},
					fn: async () => {
						await this.dataService.cancel();
					},
				},
			],
			EntityContainerCommand.CreateRecord,
			InsertPosition.Before,
		);
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);
	}
}
