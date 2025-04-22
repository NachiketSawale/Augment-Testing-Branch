/*
 * Copyright(c) RIB Software GmbH
 */

import { IConHeaderEntity } from '../../model/entities';
import { ReadonlyInfo } from '@libs/basics/shared';
import { firstValueFrom } from 'rxjs';
import { isNil } from 'lodash';
import { IPrcGeneralsEntity, ProcurementCommonGeneralsReadonlyProcessor } from '@libs/procurement/common';
import { ContractComplete } from '../../model/contract-complete.class';
import { ProcurementContractGeneralsDataService } from '../procurement-contract-generals-data.service';
import { ProcurementContractHeaderDataService } from '../procurement-contract-header-data.service';
import { inject } from '@angular/core';

/**
 * Procurement Contract Generals entity readonly processor
 */
export class ProcurementContractGeneralsReadonlyProcessor extends ProcurementCommonGeneralsReadonlyProcessor<IPrcGeneralsEntity, IConHeaderEntity, ContractComplete> {
	private readonly contractHeaderDataService = inject(ProcurementContractHeaderDataService);

	public constructor(protected override dataService: ProcurementContractGeneralsDataService) {
		super(dataService);
	}

	protected override readonlyEntity(item: IPrcGeneralsEntity): boolean {
		let isReadOnly = false;

		const currentContract = this.dataService.getContract();
		if (currentContract) {
			isReadOnly = !isNil(currentContract.ConHeaderFk) && !isNil(currentContract.ProjectChangeFk);
		}

		return super.readonlyEntity(item) && isReadOnly;
	}

	protected override async readonlyValue(info: ReadonlyInfo<IPrcGeneralsEntity>): Promise<boolean> {
		const generalsType = await firstValueFrom(this.generalTypeLookupService.getItemByKey({ id: info.item.PrcGeneralstypeFk }));

		if (!isNil(generalsType.CrbPriceConditionTypeFk)){
			return true;
		}

		const currentContract = this.dataService.getContract();
		if(currentContract){
			return this.contractHeaderDataService.isChangeOrder(currentContract) && generalsType!.IsPercent;
		}

		return false;
	}
}
