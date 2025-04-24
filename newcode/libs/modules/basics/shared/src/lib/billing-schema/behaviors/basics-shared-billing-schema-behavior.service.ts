/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ICommonBillingSchemaEntity } from '../model/interfaces/common-billing-schema-entity.interface';
import { CommonBillingSchemaDataService } from '../services/basics-shared-billing-schema.service';
import { ItemType } from '@libs/ui/common';
import { set } from 'lodash';

/**
 * The common behavior for common billing schema entity containers
 */
export class BasicsSharedBillingSchemaBehaviorService<T extends ICommonBillingSchemaEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> implements IEntityContainerBehavior<IGridContainerLink<T>, T> {
	/**
	 * The constructor
	 * @param dataService
	 */
	public constructor(public dataService: CommonBillingSchemaDataService<T, PT, PU>) {}

	/**
	 * Handle container on create
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<T>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'basics.commonbillingschema.dirtyRecalculate' },
				disabled: () => {
					return this.dataService.disableRecalculateButton();
				},
				hideItem: false,
				iconClass: 'control-icons ico-recalculate',
				id: 't1000',
				fn: async () => {
					await this.dataService.recalculate();
				},
				sort: 1,
				type: ItemType.Item,
			},
		]);
		this.customizeToolbar(containerLink);
		const dataSub = this.dataService.listChanged$.subscribe((data) => {
			data.forEach((item) => {
				this.setCellStyle(item);
			});
			containerLink.gridData = data;
		});
		containerLink.registerSubscription(dataSub);
	}

	private customizeToolbar(containerLink: IGridContainerLink<T>) {}

	/**
	 * todo-pel: wait the ticket: https://rib-40.atlassian.net/browse/DEV-15667
	 */
	private setCellStyle(item: T): void {
		// Below implementation still a workaround, need to be fixed once DEV-15667 is done.
		let itemCss = '';
		if (item.IsBold) {
			itemCss += ' font-bold ';
		}
		if (item.IsUnderline) {
			//TODO: Such css is not defined
			itemCss += ' font-underline ';
		}
		if (item.IsItalic) {
			itemCss += ' font-italic ';
		}

		set(item, 'cssClass', itemCss);
	}
}
