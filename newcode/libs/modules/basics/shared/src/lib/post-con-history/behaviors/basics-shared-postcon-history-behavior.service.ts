/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import {Injectable} from '@angular/core';
import { ItemType } from '@libs/ui/common';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IBasicsSharedPostConHistoryEntity } from '../model/entities/basics-shared-postcon-history-entity.interface';
import { BasicsSharedPostConHistoryDataService } from '../services/basics-shared-postcon-history-data.service';
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedPostConHistoryBehavior<T extends IBasicsSharedPostConHistoryEntity,PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> implements IEntityContainerBehavior<IGridContainerLink<T>, T>{

	public constructor(public dataService:BasicsSharedPostConHistoryDataService<T,PT,PU>) {

	}

	public onCreate(containerLink: IGridContainerLink<T>): void {
		//remove create and delete btn
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);
		//add cus btn
		containerLink.uiAddOns.toolbar.addItems([
			{
				id: 'download',
				caption: {key: 'basics.common.upload.button.downloadCaption'},
				iconClass: 'tlb-icons ico-download',
				sort: 1,
				type: ItemType.Item,
				disabled: () => {
					return !this.dataService.canDownloadFiles();
				},
				fn: () => {
					this.dataService.downloadFiles();
				},
			},
			{
				id: 'preview',
				caption: 'basics.common.preview.button.previewCaption',
				iconClass: 'tlb-icons ico-preview-form',
				type: ItemType.Item,
				sort: 2,
				disabled: () => {
					return !this.dataService.canPreview();
				},
				fn: () => {
					//todo-when preview service is ready,uncomment blew code
					//basicsCommonServiceUploadExtension.extendWidthPreview(this.dataService,{});
				},
			}
		]);
	}

}