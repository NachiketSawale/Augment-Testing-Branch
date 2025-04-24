/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEstLineItemEntity } from './estimate-line-item-base-entity.interface';

export interface IBoqPackageCriteriaSelectionResponseEntityGenerated {

/*
 * CostGroupCats
 */
 // CostGroupCats?: CostGroupCompleteEntity | null;

/*
 * EntityList
 */
  // EntityList?: IIIdentifyable[] | null;

/*
 * EstLineItems
 */
  EstLineItems?: IEstLineItemEntity[] | null;

/*
 * HooklineItemWithNoResourcesFlag
 */
  HooklineItemWithNoResourcesFlag?: boolean | null;

/*
 * IsResourcesResultExceed100
 */
  IsResourcesResultExceed100?: boolean | null;

/*
 * IsWithoutEligibleResource
 */
  IsWithoutEligibleResource?: boolean | null;

/*
 * IsWithoutPackage
 */
  IsWithoutPackage?: boolean | null;

/*
 * PackageSourceType
 */
  PackageSourceType?: 'PROJECT_BOQ' | 'WIC_BOQ' | 'PRC_STRUCTURE_LINE_ITEM' | 'PRC_STRUCTURE_PROJECT_BOQ' | 'RESOURCE' | null;

/*
 * ProjectBoQ2CostGroups
 */
 // ProjectBoQ2CostGroups?: IMainItem2CostGroupEntity[] | null;

/*
 * ProtectedAssemblyIdsOfResources
 */
  ProtectedAssemblyIdsOfResources?: number[] | null;

/*
 * Timestr
 */
  Timestr?: string | null;

/*
 * boqItemIds
 */
  boqItemIds?: number[] | null;

/*
 * filterResourceWithOutPackage
 */
  filterResourceWithOutPackage?: boolean | null;

/*
 * prcDirectCostFlag
 */
  prcDirectCostFlag?: boolean | null;

/*
 * prcIndirectCostFlag
 */
  prcIndirectCostFlag?: boolean | null;

/*
 * prcMarkupCostFlag
 */
  prcMarkupCostFlag?: boolean | null;
}
