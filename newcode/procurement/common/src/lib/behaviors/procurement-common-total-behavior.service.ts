/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import {CompleteIdentification, IEntityIdentification} from '@libs/platform/common';
import { ItemType } from '@libs/ui/common';
import {ProcurementCommonTotalDataService} from '../services';
import { IPrcCommonTotalEntity } from '@libs/procurement/interfaces';

/**
 * The common behavior for procurement total entity containers
 */
export class ProcurementCommonTotalBehavior<T extends IPrcCommonTotalEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> implements IEntityContainerBehavior<IGridContainerLink<T>, T> {


	/**
	 * The constructor
	 * @param dataService
	 */
	public constructor(public dataService: ProcurementCommonTotalDataService<T, PT, PU>) {

	}

	public onCreate(containerLink: IGridContainerLink<T>): void {

		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'procurement.common.total.dirtyRecalculate' },
				hideItem: false,
				iconClass: 'control-icons ico-recalculate',
				id: 'dirtyRecalculate',
				sort: 1000,
				disabled: () => {
					return false;
				},
				fn: () => {
					this.dataService.recalculate();
				},
				type: ItemType.Item
			},
			{
				caption: { key: 'procurement.common.total.toolbarFilter' },
				hideItem: false,
				iconClass: 'tlb-icons ico-on-off-zero',
				id: 'toolbarFilter',
				sort: 1001,
				disabled: () => {
					return false;
				},
				fn: () => {
					this.dataService.toggleListAll();
				},
				type: ItemType.Check,
				//Toggle button not working correctly. Reference to ticket https://rib-40.atlassian.net/browse/DEV-31687
				value: !this.dataService.isListAll
			}
		]);
	}

}