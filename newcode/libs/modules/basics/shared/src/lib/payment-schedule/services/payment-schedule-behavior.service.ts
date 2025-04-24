/*
 * Copyright(c) RIB Software GmbH
 */

import { ItemType } from '@libs/ui/common';
import { IPaymentScheduleBaseEntity } from '@libs/basics/interfaces';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IBasicsSharedPaymentScheduleDataServiceInterface } from './interfaces/payment-schedule-data-service.interface';

/**
 * Payment schedule basic behavior service
 */
export abstract class BasicsSharedPaymentScheduleBehaviorService<
	T extends IPaymentScheduleBaseEntity,
	PT extends IEntityIdentification,
	PU extends CompleteIdentification<PT>>
	implements IEntityContainerBehavior<IGridContainerLink<T>, T> {

	/**
	 * The constructor
	 * @param dataService
	 * @protected
	 */
	protected constructor(protected readonly dataService: IBasicsSharedPaymentScheduleDataServiceInterface<T, PT, PU>) {
	}

	/**
	 * Handle container on create
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<T>): void {
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord]);
		containerLink.uiAddOns.toolbar.addItems([
			{
				id: 'createWithTarget',
				sort: 0,
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-rec-new',
				caption: {key: 'cloud.common.taskBarNewRecord'},
				disabled: ctx => {
					return !this.dataService.canCreate();
				},
				fn: () => {
					this.dataService.createEntityNTarget();
				}
			},
			{
				id: 'to100',
				sort: 1000,
				type: ItemType.Item,
				iconClass: 'control-icons ico-recalculate',
				caption: {key: 'procurement.common.paymentSchedule.reBalanceTo100'},
				disabled: () => {
					return this.dataService.disabledRecalculateTo100();
				},
				fn: () => {
					this.dataService.recalculateTo100();
				},
			}
		]);
	}
}