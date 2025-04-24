/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcItemEntity } from '../model/entities';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ProcurementCommonItemDataService } from '../services/procurement-common-item-data.service';
import { FieldKind } from '@libs/procurement/shared';

/**
 * The common behavior for procurement item entity containers
 */
export class ProcurementCommonItemBehavior<T extends IPrcItemEntity, U extends CompleteIdentification<T>, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> implements IEntityContainerBehavior<IGridContainerLink<T>, T> {
	/**
	 * The constructor
	 * @param dataService
	 */
	public constructor(public dataService: ProcurementCommonItemDataService<T, U, PT, PU>) {}

	/**
	 * Handle container on create
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<T>): void {
		const prcHeaderChangedSub = this.dataService.parentService.selectionChanged$.subscribe((selectData) => {
			if (selectData && selectData.length > 0) {
				this.dataService.refreshEntityActionsByPrcConfig();
			}
		});
		const prcConfigChangedSub = this.dataService.parentService.entityProxy.propertyChanged$.subscribe((e) => {
			switch (e.fieldKind) {
				case FieldKind.PrcConfigurationFk:
					this.dataService.refreshEntityActionsByPrcConfig();
					break;
			}
		});
		containerLink.registerSubscription(prcHeaderChangedSub);
		containerLink.registerSubscription(prcConfigChangedSub);
	}
}
