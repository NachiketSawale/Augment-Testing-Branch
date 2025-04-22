/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvOtherEntity } from '../../model/entities';
import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { ProcurementInvoiceOtherDataService } from '../procurement-invoice-other-data.service';


export class ProcurementInvoiceOtherDataProcessor implements IEntityProcessor<IInvOtherEntity> {

	public constructor(protected dataService: ProcurementInvoiceOtherDataService) {
	}

	public processItem(itemToProcess: IInvOtherEntity, fieldName: string, isReadOnly: boolean) {
		const readonlyFields: IReadOnlyField<IInvOtherEntity>[] = [
			{field: fieldName, readOnly: isReadOnly}
		];
		this.dataService.setEntityReadOnlyFields(itemToProcess, readonlyFields);
	}

	public process(toProcess: IInvOtherEntity): void {
	}

	public revertProcess(toProcess: IInvOtherEntity): void {
	}
}