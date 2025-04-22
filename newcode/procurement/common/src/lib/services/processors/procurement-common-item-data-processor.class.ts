/*
 * Copyright(c) RIB Software GmbH
 */

import { isNil } from 'lodash';
import { bignumber } from 'mathjs';
import { IPrcItemEntity } from '../../model/entities';
import { IEntityProcessor } from '@libs/platform/data-access';
import { PrcCommonItemComplete } from '../../model/procurement-common-item-complete.class';
import { ProcurementCommonItemDataService } from '../procurement-common-item-data.service';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';

export class ProcurementCommonItemDataProcessor<T extends IPrcItemEntity, U extends PrcCommonItemComplete,
	PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> implements IEntityProcessor<T> {

	/**
	 * The constructor
	 * @param dataService
	 */
	public constructor(protected dataService: ProcurementCommonItemDataService<T, U, PT, PU>) {
	}

	public process(toProcess: T): void {
		this.processSpecification(toProcess);

		toProcess.QuantityRemaining = this.calculateQuantityRemaining(toProcess);

		if (isNil(toProcess.Co2SourceTotal) || toProcess.Co2SourceTotal <= 0) {
			toProcess.Co2SourceTotal = bignumber(toProcess.Co2Source).mul(toProcess.Quantity).toNumber();
		}
		if (isNil(toProcess.Co2ProjectTotal) || toProcess.Co2ProjectTotal <= 0) {
			toProcess.Co2ProjectTotal = bignumber(toProcess.Co2Project).mul(toProcess.Quantity).toNumber();
		}
	}

	public revertProcess(toProcess: T): void {
	}

	protected calculateQuantityRemaining(toProcess: T) {
		return this.dataService.calculateQuantityRemaining(toProcess.Quantity, toProcess.QuantityDelivered);
	}

	public processSpecification(toProcess: T) {
		if (toProcess.Specification) {
			// TODO: ALM #63501 don't contain html tag
			toProcess.Specification = toProcess.Specification.replace(/<[^>]+>/g, '').replace(/(&nbsp;)/g, '');
		}
	}
}