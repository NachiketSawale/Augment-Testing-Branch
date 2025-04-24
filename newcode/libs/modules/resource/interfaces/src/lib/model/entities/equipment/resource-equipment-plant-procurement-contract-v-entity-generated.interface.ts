/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantProcurementContractVEntityGenerated extends IEntityIdentification, IEntityBase {
	 ItemFk: number;
	 PlantFk?: number | null;
	 ItemDescription1?: string | null;
	 ItemDescription2?: string | null;
	 Quantity: number;
	 UomFk: number;
	 Pricetotal: number;
	 Total: number;
	 ItemProcurementStructureFk?: number | null;
	 ItemProcurementStructureCode: string | null;
	 ItemProcurementStructureDescription?: string | null;
	 ItemControllingUnitFk?: number | null;
	 ItemControllingUnitCode?: string | null;
	 ItemControllingUnitDescription?: string | null;
	 ProcurementHeaderFk: number;
	 ProcurementHeaderCode: string | null;
	 ProcurementHeaderDescription?: string | null;
	 ContractHeaderFk?: number | null;
	 ContractCode?: string | null;
	 DateOrdered?: Date | null;
	 ContractDescription?: string | null;
	 BusinessPartnerFk?: number | null;
	 ContractStatusFk?: number | null;
	 ContractControllingUnitFk?: number | null;
	 ContractControllingUnitCode?: string | null;
	 ContractControllingUnitDescription?: string | null;
}