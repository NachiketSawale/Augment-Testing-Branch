import {  IEntityIdentification } from '@libs/platform/common';


export interface ProjectMainCostGroupEntityGenerated extends IEntityIdentification {

	 Id: number;
	 CostGroupCatalogFk?: number;
	 CostGroupFk?: number;
	 Code?: string;
	 UomFk?: number;
	 IsLive?: boolean;
	 IsCrbPrimaryVariant?: boolean;
	 LeadQuantityCalc?: boolean;
	 NoLeadQuantity?: boolean;
	 ReferenceQuantityCode?: string;
	 CostGroupLevel1Fk?: boolean;
	 CostGroupLevel2Fk?: boolean;
	 CostGroupLevel3Fk?: boolean;
	 CostGroupLevel4Fk?: boolean;
	 CostGroupLevel5Fk?: boolean;
	 ChildItems?: Array<ProjectMainCostGroupEntityGenerated>;

}