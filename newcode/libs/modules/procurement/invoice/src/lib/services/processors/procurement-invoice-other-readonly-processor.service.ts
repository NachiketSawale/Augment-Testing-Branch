/*
 * Copyright(c) RIB Software GmbH
 */

import { AsyncReadonlyFunctions, BasicsShareControllingUnitLookupService, EntityReadonlyProcessorBase, ReadonlyFunctions, ReadonlyInfo } from '@libs/basics/shared';
import { IInvOtherEntity } from '../../model';
import { ProcurementInvoiceOtherDataService } from '../procurement-invoice-other-data.service';
import { ProcurementInvoiceHeaderDataService } from '../../header/procurement-invoice-header-data.service';
import { firstValueFrom } from 'rxjs';
import { inject } from '@angular/core';

export class ProcurementInvoiceOtherReadonlyProcessor extends EntityReadonlyProcessorBase<IInvOtherEntity> {
	private readonly basicsShareControllingUnitLookupService = inject(BasicsShareControllingUnitLookupService);

	public constructor(protected dataService: ProcurementInvoiceOtherDataService, protected headDataService: ProcurementInvoiceHeaderDataService) {
		super(dataService);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<IInvOtherEntity> {
		return {
			BasCompanyDeferalTypeFk: {
				shared: ['DateDeferalStart'],
				readonly: e => this.headDataService.getSelectedEntity()?.BillSchemeIsChained || false,
			},
			FixedAssetFk: e => !e.item.IsAssetManagement,
		};
	}

	public generateAsyncReadonlyFunctions(): AsyncReadonlyFunctions<IInvOtherEntity> {
		return {
			IsAssetManagement: async e => await this.readonlyByAssetManagement(e),
		};
	}


	protected async readonlyByAssetManagement(info: ReadonlyInfo<IInvOtherEntity>) {
		const controllingUnit = await firstValueFrom(this.basicsShareControllingUnitLookupService.getItemByKey({id: info.item.ControllingUnitFk as number}));
		return !controllingUnit?.Isaccountingelement;
	}
}