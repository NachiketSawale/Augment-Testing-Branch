import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface ILogisticSundryGroupTaxCodeEntity extends IEntityIdentification, IEntityBase {

	 LedgerContextFk: number;
	 TaxCodeFk: number;
}
