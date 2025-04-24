/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { GridComponent } from '@libs/ui/common';
import { CompleteIdentification, IEntityIdentification, PlatformCommonModule } from '@libs/platform/common';
import { Subscription } from 'rxjs';
import { IPrcItemEntity } from '../../model/entities/prc-item-entity.interface';
import { ProcurementCommonDeliveryScheduleDataService } from '../../services/procurement-common-deliveryschedule-data.service';
import { IProcurementCommonDeliveryScheduleEntity } from '../../model/entities/procurement-common-deliveryschedule-entity.interface';
import { ProcurementCommonRoundingService } from '../../services/helper/procurement-common-rounding.service';
import { ProcurementCommonGridCompositeComponentBase } from '../grid-composite-base/grid-composite-base.component';

@Component({
	templateUrl: 'procurement-common-delivery-schema-container.component.html',
	standalone: true,
	imports: [GridComponent, PlatformCommonModule],
	styleUrl: 'procurement-common-delivery-schema-container.component.scss',
})
export class ProcurementCommonDeliveryScheduleContainerComponent extends ProcurementCommonGridCompositeComponentBase<
	ProcurementCommonDeliveryScheduleDataService<IProcurementCommonDeliveryScheduleEntity, IEntityIdentification, CompleteIdentification<IEntityIdentification>>
> {
	protected openQuantity: number | null = 0;
	protected quantityScheduled: number | null = 0;
	protected totalQuantity: number | null = 0;

	private readonly prcRoundingService = inject(ProcurementCommonRoundingService);
	private readonly roundingType = this.prcRoundingService.getRoundingType<IProcurementCommonDeliveryScheduleEntity>();

	private parentSelectionSubscription?: Subscription;
	public constructor() {
		super();

		this.parentSelectionSubscription = this.dataService.getParentService().selectionChanged$.subscribe((e) => {
			this.calculateQuantity();
		});
		this.parentSelectionSubscription.add(
			this.dataService.getParentService().entitiesModified$.subscribe((e) => {
				this.calculateQuantity();
			}),
		);
	}

	private calculateQuantity(): void {
		if(!this.dataService.getParentSelection()){
			return;
		}
		const itemQuantityList = this.dataService.getList().map((e) => e.Quantity);
		const quantityScheduled = itemQuantityList.reduce((e, f) => {
			return e + f;
		}, 0);
		//todo-parentSelectedItem should get prcitem lookup data
		const parentSelectedItem = this.dataService.getParentSelection() as IPrcItemEntity;
		this.totalQuantity = this.prcRoundingService.round(this.roundingType.Quantity, parentSelectedItem.Quantity) ?? 0;
		this.quantityScheduled = this.prcRoundingService.round(this.roundingType.quantityScheduled, quantityScheduled);
		this.openQuantity = this.prcRoundingService.round(this.roundingType.openQuantity, this.totalQuantity - this.quantityScheduled);
	}

	public ngOnDestroy() {
		if (this.parentSelectionSubscription) {
			this.parentSelectionSubscription.unsubscribe();
		}
	}
}
