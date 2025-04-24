import { IEntityIdentification } from '@libs/platform/common';

export interface ICustomerLookupEntity extends IEntityIdentification{
	Id: number;
	BusinessPartnerFk: number;
	Code?: string | null;
	PaymentTermPaFk?: number | null;
	PaymentTermFiFk?: number | null;
	CustomerLedgerGroupFk: number;
	BillingSchemaFk?: number | null;
	SupplierNo?: string | null;
	BusinessUnitFk: number;
	CustomerBranchFk?: number | null;
	UserDefined1?: string | null;
	CustomerStatusFk?: number | null;
	Description?: string | null;
	Description2?: string | null;
}