
import { IEntityBase, IEntityIdentification } from '@libs/platform/common';
export interface IBusinessPartnerBankEntity extends IEntityBase, IEntityIdentification {
	 Id: number;
	 BusinessPartnerFk: number;
	 IsLive: boolean;
	 BankTypeFk: number;
	 BankFk?: number | null;
	 Iban?: string | null;
	 AccountNo?: string | null;
	 IsDefault: boolean;
	 UserDefined1?: string | null;
	 UserDefined2?: string | null;
	 UserDefined3?: string | null;
	 CompanyFk?: number | null;
	 CountryFk: number;
	 BpdBankStatusFk: number;
	 IsDefaultCustomer: boolean;
	 BankName?: string | null;
	 BankIbanWithName?: string | null;
	 IbanNameOrBicAccountName?: string | null;
}
