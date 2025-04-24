/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { NgOptimizedImage } from '@angular/common';
import { COS_IMAGE_TOKEN } from '../../model/entities/token/cos-image-option.interface';

@Component({
	selector: 'constructionsystem-main-show-help-image',
	templateUrl: './show-help-image.component.html',
	styleUrls: ['./show-help-image.component.scss'],
	standalone: true,
	imports: [NgOptimizedImage],
})
export class ShowHelpImageComponent {
	protected dataItem: string = '';
	private readonly http = inject(PlatformHttpService);
	private readonly imageOption = inject(COS_IMAGE_TOKEN);

	public constructor() {
		this.loadDataItem();
	}

	private async loadDataItem() {
		if (this.imageOption.instanceId && this.imageOption.instanceHeaderFk) {
			this.dataItem = await this.http.get<string>('constructionsystem/master/help/getblobimage', {
				params: {
					instanceId: this.imageOption.instanceId,
					instanceHeaderFk: this.imageOption.instanceHeaderFk,
				},
			});
		}
	}
}
