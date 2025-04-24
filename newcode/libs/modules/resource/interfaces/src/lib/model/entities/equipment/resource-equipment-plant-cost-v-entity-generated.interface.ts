/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantCostVEntityGenerated extends IEntityIdentification, IEntityBase {
	 ItemKind: string | null;
	 DisplayInPlant?: boolean | null;
	 JobCode: string | null;
	 JobDescription?: string | null;
	 JobUserdefined1?: string | null;
	 JobValidfrom?: Date | null;
	 JobValidto?: Date | null;
	 PlantGroupFk?: number | null;
	 PlantFk?: number | null;
	 JobTypeDescription?: IDescriptionInfo | null;
	 Projectno: string | null;
	 ItemheaderDate?: Date | null;
	 ItemheaderCode: string | null;
	 ItemheaderDescription?: IDescriptionInfo | null;
	 ItemheaderFrom?: Date | null;
	 ItemheaderTo?: Date | null;
	 Currency: string | null;
	 ItemPrcStructureCode?: string | null;
	 ItemPrcStructureDescription?: IDescriptionInfo | null;
	 ItemDescription1?: IDescriptionInfo | null;
	 ItemDescription2?: IDescriptionInfo | null;
	 ItemQuantity: number;
	 ItemQuantityMultiplier: number;
	 ItemFk: number;
	 ItemPriceportion1: number;
	 ItemPriceportion2: number;
	 ItemPriceportion3: number;
	 ItemPriceportion4: number;
	 ItemPriceportion5: number;
	 ItemPriceportion6: number;
	 ItemPriceTotal?: number | null;
	 ItemTotalCost?: number | null;
	 ItemUnitInfo?: IDescriptionInfo | null;
	 SettlementstatusIsStorno?: boolean | null;
	 ContractStatusIsRejected?: boolean | null;
	 InvoiceHeaderStatusIsCanceled?: boolean | null;
}