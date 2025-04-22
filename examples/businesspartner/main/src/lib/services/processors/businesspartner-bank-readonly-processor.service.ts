/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { AsyncReadonlyFunctions, BasicsSharedBpBankStatusLookupService, EntityAsyncReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { BusinessPartnerBankDataService } from '../businesspartner-bank-data.service';
import { firstValueFrom } from 'rxjs';
import { BusinesspartnerMainHeaderDataService } from '../businesspartner-data.service';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IBusinessPartnerBankEntity } from '@libs/businesspartner/interfaces';


@Injectable({
	providedIn: 'root',
})
export class BusinessPartnerBankReadonlyProcessorService extends EntityAsyncReadonlyProcessorBase<IBusinessPartnerBankEntity> {
	private readonly businesspartnerMainHeaderDataService = inject(BusinesspartnerMainHeaderDataService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly BpBankStatusLookupService = inject(BasicsSharedBpBankStatusLookupService);
	public constructor(protected dataService: BusinessPartnerBankDataService) {
		super(dataService);
	}

	private async generalIsNoReadonly(currentItem: IBusinessPartnerBankEntity): Promise<boolean> {
		const bpIsNoReadonly = true;
		const isNoReadonly = await this.isCanEditStatus(currentItem);
		const finallResult = bpIsNoReadonly && isNoReadonly;
		return finallResult;
	}

	public async isCanEditStatus(currentItem: IBusinessPartnerBankEntity): Promise<boolean> {
		const dataBp = this.businesspartnerMainHeaderDataService.getSelectedEntity();
		if (!dataBp) {
			return false;
		}
		const loginCompanyId = this.configService.getContext().clientId;
		if (currentItem.CompanyFk&&loginCompanyId && loginCompanyId !== currentItem.CompanyFk) {
			return false;
		}
		const dataBpBankStatus = await firstValueFrom(this.BpBankStatusLookupService.getItemByKey({id: currentItem.BpdBankStatusFk}));
		if (!dataBpBankStatus||dataBpBankStatus.IsReadOnly) {
			return false;
		}
		const isBpStatusHasRight = this.businesspartnerMainHeaderDataService.isBpStatusHasRight(dataBp, 'statusWithEidtRight');
		return isBpStatusHasRight;

	}



	public generateAsyncReadonlyFunctions(): AsyncReadonlyFunctions<IBusinessPartnerBankEntity> {
		return {
			BusinessPartnerFk: {
				shared: [
					'BusinessPartnerFk',
					'IsLive',
					'BankTypeFk',
					'BankFk',
					'Iban',
					'AccountNo',
					'IsDefault',
					'UserDefined1',
					'UserDefined2',
					'UserDefined3',
					'CompanyFk',
					'CountryFk',
					'BpdBankStatusFk',
					'IsDefaultCustomer',
					'BankName',
					'BankIbanWithName',
					'IbanNameOrBicAccountName',
			],
		readonly: async (info) => {
			const resulIsNoReadonly = await this.generalIsNoReadonly(info.item);
			return !resulIsNoReadonly;
		},
			},
		};
	}
	public generateReadonlyFunctions(): ReadonlyFunctions<IBusinessPartnerBankEntity> {
		return {};
	}


}
