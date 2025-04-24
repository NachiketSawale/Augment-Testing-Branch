/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import {
	ICustomDialogOptions,
	StandardDialogButtonId,
	UiCommonDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import { ProcurementPackageBoqScopeReplacementDialogComponent } from '../components/boq-scope-replacement-dialog/boq-scope-replacement-dialog.component';
import {BOQ_SCOPE_REPLACEMENT_DATA_TOKEN} from '../model/entities/boq-scope-replacement-info.interface';
import {IPackageBoqItemEntity} from '../model/entities/package-boq-item-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageBoqScopeReplacementDialogService {
	private readonly packageService = inject(ProcurementPackageHeaderDataService);
	private readonly httpService = inject(PlatformHttpService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly dialogService = inject(UiCommonDialogService);
	
	public async show() {
		const packageItem = this.packageService.getSelectedEntity();
		// todo chi: boq service is not available
		// const boqNodeService = prcBoqMainService.getService(procurementContextService.getMainService());
		if (!packageItem) {
			return;
		}

		// todo chi: boq service is not available, maybe refactor the way of get structure of the boq item selected.
		// let selectedBoqItem = boqNodeService.getSelected();
		// if (!selectedBoqItem) {
		// 	platformModalService.showMsgBox('procurement.package.boqScopeReplacement.noSelectBoqItem', 'procurement.package.boqScopeReplacement.title', 'ico-warning');
		// 	return;
		// }
		// let rootPrcBoq = boqNodeService.getRootBoqItem();
		// let rootBoq = angular.copy(rootPrcBoq);
		// if (rootBoq && rootBoq.BoqItems !== null) {
		// 	recursionBoqItems(rootBoq, rootBoq.BoqItems, selectedBoqItem.Id);
		// }

		const isValid = await this.httpService.get('procurement/package/wizard/isvalidboqtobereplaced',
			{
				params: {
					packageId: packageItem.Id,
					// todo chi: do it later
					// boqHeaderId: selectedBoqItem.BoqHeaderFk,
					// boqItemId: selectedBoqItem.Id
				}
			});

		if (!isValid) {
			this.messageBoxService.showMsgBox({
				headerText: this.translateService.instant('procurement.package.boqScopeReplacement.title').text,
				bodyText: 'procurement.package.boqScopeReplacement.notValidToBeReplaced',
				iconClass: 'ico-warning',
				buttons: [{id: StandardDialogButtonId.Ok}]
			});
			return;
		}

		const modalOptions: ICustomDialogOptions<StandardDialogButtonId, ProcurementPackageBoqScopeReplacementDialogComponent> = {
			headerText: 'procurement.package.boqScopeReplacement.title',
			buttons: [
				{
					id: 'update',
					caption: 'procurement.package.boqScopeReplacement.update',
					isDisabled: (info) => {
						return !info.dialog.body.canUpdate();
					},
					fn: async (event, info) => {
						const isClose = await info.dialog.body.update();
						if (isClose) {
							info.dialog.close(StandardDialogButtonId.Ok);
						}
					},
				},
				{
					id: StandardDialogButtonId.Cancel
				}
			],
			resizeable: true,
			showCloseButton: true,
			bodyComponent: ProcurementPackageBoqScopeReplacementDialogComponent,
			bodyProviders: [
				{
					provide: BOQ_SCOPE_REPLACEMENT_DATA_TOKEN,
					useValue: {
						packageItem: packageItem,
						// todo chi: do it later
						// targetBoqItem: selectedBoqItem,
						// targetBoqTree: rootBoq
					}
				}
			],
			width: '800px',
			height: '650px',
		};

		await this.dialogService.show(modalOptions);
	}

	private recursionBoqItems(parentBoqNode: IPackageBoqItemEntity, boqItems: IPackageBoqItemEntity[], currentBoqId: number) {
		boqItems.forEach((item) => {
			if (item.BoqItems && item.BoqItems.length > 0) {
				this.recursionBoqItems(item, item.BoqItems, currentBoqId);
			} else {
				if (parentBoqNode.BoqItems) {
					parentBoqNode.BoqItems = parentBoqNode.BoqItems.filter((bitem) => {
						return bitem.Id === currentBoqId;
					});
				}
				/* if(item.Id !== currentBoqId) {
					delete parentBoqNode.BoqItems[item];
				} */
			}
		});
	}
}