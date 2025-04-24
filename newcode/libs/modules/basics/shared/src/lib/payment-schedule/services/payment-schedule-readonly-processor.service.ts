/*
 * Copyright(c) RIB Software GmbH
 */

import { IPaymentScheduleBaseEntity } from '@libs/basics/interfaces';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { EntityReadonlyProcessorBase, ReadonlyFunctions, ReadonlyInfo } from '../../readonly';
import { IBasicsSharedPaymentScheduleDataServiceInterface } from './interfaces/payment-schedule-data-service.interface';

/**
 * Payment schedule basics readonly processor
 */
export abstract class BasicsSharedPaymentScheduleReadonlyProcessor<
	T extends IPaymentScheduleBaseEntity,
	PT extends IEntityIdentification & { ProjectFk?: number },
	PU extends CompleteIdentification<PT>>
	extends EntityReadonlyProcessorBase<T> {

	/**
	 * The constructor
	 * @param dataService
	 */
	public constructor(protected readonly dataService: IBasicsSharedPaymentScheduleDataServiceInterface<T, PT, PU>) {
		super(dataService);
	}

	protected readOnlyFieldsWhenIsDone: Partial<keyof IPaymentScheduleBaseEntity>[] = [
		'Code',
		'DatePayment',
		'DateRequest',
		'PercentOfContract',
		'AmountNet',
		'AmountGross',
		'Remaining',
		'AmountNetOc',
		'AmountGrossOc',
		'RemainingOc',
		'CommentText',
		'PsdScheduleFk',
		'PsdActivityFk',
		'BasPaymentTermFk',
		'Sorting'
	];

	/**
	 * Generate readonly functions
	 */
	public generateReadonlyFunctions(): ReadonlyFunctions<T> {
		return {
			PsdScheduleFk: () => !(this.dataService.parentService.getSelectedEntity()?.ProjectFk),
			PsdActivityFk: e => !e.item.PsdScheduleFk,
			Code: {
				shared: this.readOnlyFieldsWhenIsDone,
				readonly: this.readonlyIsDone
			}
		};
	}

	protected readonlyIsDone(info: ReadonlyInfo<T>) {
		return info.item.IsDone;
	}
}