/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import {Injectable} from '@angular/core';
import { IProcurementCommonOverviewEntity } from '../model/entities/procurement-common-overview-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonOverviewBehaviorService<T extends IProcurementCommonOverviewEntity> implements IEntityContainerBehavior<IGridContainerLink<T>, T>{

	public constructor() {
	}

	public onCreate(containerLink: IGridContainerLink<T>): void {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
	}

}