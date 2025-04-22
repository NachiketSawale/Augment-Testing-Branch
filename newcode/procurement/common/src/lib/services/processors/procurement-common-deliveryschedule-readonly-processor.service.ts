/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementCommonDeliveryScheduleDataService } from '../procurement-common-deliveryschedule-data.service';
import {IProcurementCommonDeliveryScheduleEntity} from '../../model/entities/procurement-common-deliveryschedule-entity.interface';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';

export abstract class ProcurementCommonDeliveryScheduleProcessor<T extends IProcurementCommonDeliveryScheduleEntity,PT extends IEntityIdentification,PU extends CompleteIdentification<PT>>extends EntityReadonlyProcessorBase<T>{

	public constructor(protected dataService: ProcurementCommonDeliveryScheduleDataService<T, PT, PU>) {
		super(dataService);
	}


	public generateReadonlyFunctions(): ReadonlyFunctions<T> {
		return {
			DateRequired:e=>this.isReadonly(),
			TimeRequired:e=>this.isReadonly(),
			Description:e=>this.isReadonly(),
			Quantity:e=>this.isReadonly(),
			CommentText:e=>this.isReadonly(),
			RunningNumber:e=>this.isReadonly(),
			AddressDto:e=>this.isReadonly(),
		};
	}

	public abstract isReadonly():boolean;

	protected override readonlyEntity(item: T): boolean {
		return this.isReadonly();
	}
}