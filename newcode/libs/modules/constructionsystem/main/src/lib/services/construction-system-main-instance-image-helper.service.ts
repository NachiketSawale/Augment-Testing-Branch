/*
 * Copyright(c) RIB Software GmbH
 */
import { ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemMainInstanceDataService } from './construction-system-main-instance-data.service';
import { Injectable } from '@angular/core';
import { ICustomDialogOptions, UiCommonDialogService } from '@libs/ui/common';
import { ShowHelpImageComponent } from '../components/show-help-image/show-help-image.component';
import { COS_IMAGE_TOKEN } from '../model/entities/token/cos-image-option.interface';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainInstanceImageHelperService {
	private readonly instanceService = ServiceLocator.injector.get(ConstructionSystemMainInstanceDataService);
	private readonly modalDialogService = ServiceLocator.injector.get(UiCommonDialogService);
	public showDialog() {
		const selected = this.instanceService.getSelectedEntity();
		if (selected) {
			this.modalDialogService.show(this.getImageModalOptions(selected.Id, selected.InstanceHeaderFk))?.then();
		}
	}
	private getImageModalOptions(instanceId: number | null, instanceHeaderFk: number) {
		const getImageModalOptions: ICustomDialogOptions<number, ShowHelpImageComponent> = {
			headerText: {
				text: 'Get Help Image',
				key: 'constructionsystem.main.instanceGetHelpImage',
			},
			bodyComponent: ShowHelpImageComponent,
			showCloseButton: true,
			resizeable: true,
			minWidth: '60px',
			id: 'instance-get-image',
			backdrop: false,
			bodyProviders: [
				{
					provide: COS_IMAGE_TOKEN,
					useValue: {
						instanceId: instanceId,
						instanceHeaderFk: instanceHeaderFk,
					},
				},
			],
		};
		return getImageModalOptions;
	}
}
