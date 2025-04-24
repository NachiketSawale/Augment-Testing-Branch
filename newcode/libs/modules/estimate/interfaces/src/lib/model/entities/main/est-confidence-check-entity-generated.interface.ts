/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstConfidenceCheckEntity } from './est-confidence-check-entity.interface';
import { IDescriptionInfo } from '@libs/platform/common';

export interface IEstConfidenceCheckEntityGenerated {

/*
 * Count
 */
  Count?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstConfidenceCheckChildrens
 */
  EstConfidenceCheckChildrens?: IEstConfidenceCheckEntity[] | null;

/*
 * EstConfidenceCheckParent
 */
  EstConfidenceCheckParent?: IEstConfidenceCheckEntity | null;

/*
 * EstConfidenceParentFk
 */
  EstConfidenceParentFk?: number | null;

/*
 * FilterColumnName
 */
  FilterColumnName?: 'EstimateConfidence' | 'Costing' | 'Budgeting' | 'Packages' | 'Pricing' | 'MetadataAssociation' | 'ProjectChanges' | 'IsGc' | 'GrandTotal' | 'IsLumpsum' | 'IsNoEscalation' | 'IsDisabled' | 'IsFixedBudget' | 'IsFixedBudgetUnit' | 'Budget' | 'PrcPackageFk' | 'IsIncluded' | 'IsFixedPrice' | 'IsNoMarkup' | 'BoqItemFk' | 'PsdActivityFk' | 'MdcControllingUnitFk' | 'PrjChangesIdentified' | 'PrjChangesAnnounced' | 'PrjChangesSubmitted' | 'PrjChangesWithdrawn' | 'PrjChangesRejected' | 'PrjChangesRejectedWithProtest' | 'PrjChangesAcceptedInPrinciple' | 'PrjChangesApproved' | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * Id
 */
  Id: number;
}
