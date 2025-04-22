/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityProcessor } from '@libs/platform/data-access';
import { IInvHeaderEntity } from '../../model/entities';
import { ProcurementInvoiceHeaderDataService } from '../../header/procurement-invoice-header-data.service';
import { inject } from '@angular/core';
import { ProcurementShareContractLookupService } from '@libs/procurement/shared';
import { firstValueFrom } from 'rxjs';

export class ProcurementInvoiceCallOffProcessor implements IEntityProcessor<IInvHeaderEntity> {
	private readonly contractLookupService = inject(ProcurementShareContractLookupService);

	public constructor(private dataService: ProcurementInvoiceHeaderDataService) {}

	public process(toProcess: IInvHeaderEntity): void {
		this.setCallOffMainContractCodeAndDes(toProcess);
	}

	public revertProcess(toProcess: IInvHeaderEntity): void {}

	public async setCallOffMainContractCodeAndDes(toProcess: IInvHeaderEntity) {
		if (!toProcess.ConHeaderFk) {
			return;
		}

		const contract = await firstValueFrom(this.contractLookupService.getItemByKey({ id: toProcess.ConHeaderFk }));
		if (!contract) {
			return;
		}

		const mainContract = await firstValueFrom(this.contractLookupService.getItemByKey({ id: contract.ConHeaderFk }));
		if (mainContract) {
			toProcess.CallOffMainContractFk = mainContract.Id;
			toProcess.CallOffMainContract = mainContract.Code;
			toProcess.CallOffMainContractDes = mainContract.Description;
		}
	}
}
