/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcPackageEntity, IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { IRequisitionEntity } from '@libs/resource/interfaces';
import { IQuoteHeaderEntity } from '@libs/procurement/quote';
import { IConHeaderEntity } from '@libs/procurement/common';


/**
 * Procurement information for the generic wizard.
 */
export type PrcInfoForGenericWizard = {
	/**
	 * Details of the package.
	 */
	Package: IPrcPackageEntity[];

	/**
	 * Details of the requisition.
	 */
	Requisition: (IRequisitionEntity & { PackageFk: number })[];

	/**
	 * Details of the rfq.
	 */
	Rfq: IRfqHeaderEntity[];

	/**
	 * Details of the quote.
	 */
	Quote: IQuoteHeaderEntity[];

	/**
	 * Details of the contract.
	 */
	Contract: IConHeaderEntity[];
}