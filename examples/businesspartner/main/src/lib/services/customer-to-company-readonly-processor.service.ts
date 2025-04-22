import {EntityReadonlyProcessorBase, ReadonlyFunctions} from '@libs/basics/shared';
import {BusinesspartnerMainCustomer2CompanyDataService} from './customer-to-company-data.service';
import { ICustomerCompanyEntity } from '@libs/businesspartner/interfaces';

export class CustomerToCompanyReadonlyProcessorService extends EntityReadonlyProcessorBase<ICustomerCompanyEntity> {
	public constructor(protected dataService: BusinesspartnerMainCustomer2CompanyDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<ICustomerCompanyEntity> {
		return {
			BasCompanyFk: {
				shared: ['Supplierno', 'CustomerLedgerGroupFk', 'BusinessPostingGroupFk', 'VatGroupFk', 'CustomerLedgerGroupIcFk'],
				readonly: this.readonlyFields
			}
		};
	}

	protected readonlyFields() {
		return !this.dataService.parentService.bPCustomerhasRight();
	}
}