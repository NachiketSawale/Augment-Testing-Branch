/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityProcessor } from '@libs/platform/data-access';
import { IPesItemEntity } from '../../model/entities';
import { ProcurementPesItemDataService } from '../procurement-pes-item-data.service';
import { bignumber } from 'mathjs';

export class ProcurementPesItemCalculationProcessor implements IEntityProcessor<IPesItemEntity> {
	private get roundingService() {
		return this.dataService.roundingService;
	}

	private get roundingType() {
		return this.dataService.roundingType;
	}

	public constructor(private dataService: ProcurementPesItemDataService) {}

	public process(toProcess: IPesItemEntity): void {
		this.calculateQuantity(toProcess);
		this.calculateVat(toProcess);
	}

	public revertProcess(toProcess: IPesItemEntity): void {}

	public calculateQuantity(toProcess: IPesItemEntity) {
		toProcess.QuantityRemaining = this.calculateQuantityRemaining(toProcess.QuantityContracted, toProcess.QuantityDelivered);
		toProcess.QuantityRemainingConverted = this.roundingService.doRounding(this.roundingType.QuantityRemainingConverted, bignumber(toProcess.QuantityRemaining).mul(toProcess.PrcItemFactorPriceUnit).toNumber());
	}

	public calculateVat(toProcess: IPesItemEntity) {
		const vatPercent = this.dataService.getVatPercent(toProcess);

		toProcess.Vat = this.roundingService.doRounding(this.roundingType.Vat, bignumber(toProcess.Total).mul(vatPercent).div(100).toNumber());
		toProcess.VatOC = this.roundingService.doRounding(this.roundingType.VatOC, bignumber(toProcess.TotalOc).mul(vatPercent).div(100).toNumber());
	}

	private calculateQuantityRemaining(quantityContracted: number, quantityDelivered: number) {
		if (quantityContracted !== null && quantityDelivered !== null) {
			return this.roundingService.doRounding(this.roundingType.QuantityRemaining, bignumber(quantityContracted).sub(quantityDelivered).toNumber());
		}
		return 0.0;
	}
}
