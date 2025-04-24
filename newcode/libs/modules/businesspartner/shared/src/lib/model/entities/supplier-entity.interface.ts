/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';


/**
 * @deprecated will be removed later, use the new {@link ISupplierLookupEntity} in businesspartner\interfaces instead.
 */

export interface ISupplierLookupEntity extends IEntityIdentification {

	 Id: number;
	 BusinessPartnerFk: number;
	 Code?: string | null;
	 Description?: string | null;
	 PaymentTermPaFk?: number | null;
	 PaymentTermFiFk?: number | null;
	 SupplierLedgerGroupFk: number;
	 BillingSchemaFk?: number | null;
	 CustomerNo?: string | null;
	 BpdVatGroupFk?: number | null;
	 SubsidiaryFk?: number | null;
	 BusinessPostingGroupFk: number;
	 BankFk?: number | null;
	 SupplierStatusFk?: number | null;
	 BasPaymentMethodFk?: number | null;
	 BusinessPartnerName1?: string | null;
}


