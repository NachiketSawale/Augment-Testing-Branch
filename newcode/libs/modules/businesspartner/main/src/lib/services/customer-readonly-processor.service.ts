import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { BusinesspartnerMainCustomerDataService } from './customer-data.service';
import { ICustomerEntity } from '@libs/businesspartner/interfaces';

export class CustomerReadonlyProcessorService extends EntityReadonlyProcessorBase<ICustomerEntity> {
	public constructor(protected dataService: BusinesspartnerMainCustomerDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<ICustomerEntity> {
		return {
			CustomerStatusFk: {
				shared: [
					'Code',
					'CustomerLedgerGroupFk',
					'SupplierNo',
					'SubsidiaryFk',
					'CustomerBranchFk',
					'BusinessUnitFk',
					'PaymentTermFiFk',
					'PaymentTermPaFk',
					'BillingSchemaFk',
					'SubledgerContextFk',
					'VatGroupFk',
					'SubsidiaryFk',
					'UserDefined1',
					'UserDefined2',
					'UserDefined3',
					'UserDefined4',
					'UserDefined5',
					'BusinessPostingGroupFk',
					'BasPaymentMethodFk',
					'BpdDunninggroupFk',
					'BlockingReasonFk',
					'Description',
					'Description2',
					'Einvoice',
					'CustomerLedgerGroupIcFk',
				],
				readonly: this.readonlyFields,
			},
		};
	}

	protected readonlyFields() {
		const item = this.dataService.getSelectedEntity();
		return item ? this.dataService.isEntityReadOnly(item) : true;
	}
}
