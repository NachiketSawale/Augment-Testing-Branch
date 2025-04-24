/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IMtwoPowerbiItemEntity } from '@libs/mtwo/interfaces';

/**
 * Mtwo Control Tower Report Behavior Service.
 */
@Injectable({
	providedIn: 'root',
})
export class MtwoControlTowerProReportBehavior implements IEntityContainerBehavior<IGridContainerLink<IMtwoPowerbiItemEntity>, IMtwoPowerbiItemEntity> {
	/**
	 * On container creation callback
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IMtwoPowerbiItemEntity>) {
		containerLink.uiAddOns.toolbar.clear();
	}
}
