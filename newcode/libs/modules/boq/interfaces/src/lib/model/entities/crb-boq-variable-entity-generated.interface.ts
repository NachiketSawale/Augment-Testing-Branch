/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqItemDocumentEntity } from './boq-item-document-entity.interface';
import { ICrbBoqVariableConditionEntity } from './crb-boq-variable-condition-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ICrbBoqVariableEntityGenerated extends IEntityBase {

/*
 * BoqHeaderFk
 */
  BoqHeaderFk: number;

/*
 * BoqItemFk
 */
  BoqItemFk: number;

/*
 * ContractorTextDe
 */
  ContractorTextDe?: string | null;

/*
 * ContractorTextFr
 */
  ContractorTextFr?: string | null;

/*
 * ContractorTextIt
 */
  ContractorTextIt?: string | null;

/*
 * CrbBoqVariableConditions
 */
  CrbBoqVariableConditions?: ICrbBoqVariableConditionEntity[] | null;

/*
 * DescriptionDe
 */
  DescriptionDe?: string | null;

/*
 * DescriptionFr
 */
  DescriptionFr?: string | null;

/*
 * DescriptionIt
 */
  DescriptionIt?: string | null;

/*
 * DescriptionMutableDe
 */
  DescriptionMutableDe?: string | null;

/*
 * DescriptionMutableFr
 */
  DescriptionMutableFr?: string | null;

/*
 * DescriptionMutableIt
 */
  DescriptionMutableIt?: string | null;

/*
 * Documents
 */
  Documents?: IBoqItemDocumentEntity[] | null;

/*
 * EcoDevisMark
 */
  EcoDevisMark?: string | null;

/*
 * EntryStartCtDe
 */
  EntryStartCtDe?: number | null;

/*
 * EntryStartCtFr
 */
  EntryStartCtFr?: number | null;

/*
 * EntryStartCtIt
 */
  EntryStartCtIt?: number | null;

/*
 * EntryStartDe
 */
  EntryStartDe: number;

/*
 * EntryStartFr
 */
  EntryStartFr?: number | null;

/*
 * EntryStartIt
 */
  EntryStartIt?: number | null;

/*
 * EntryStartRowCtDe
 */
  EntryStartRowCtDe?: number | null;

/*
 * EntryStartRowCtFr
 */
  EntryStartRowCtFr?: number | null;

/*
 * EntryStartRowCtIt
 */
  EntryStartRowCtIt?: number | null;

/*
 * Group
 */
  Group?: string | null;

/*
 * Grp
 */
  Grp?: string | null;

/*
 * HintDe
 */
  HintDe?: string | null;

/*
 * HintFr
 */
  HintFr?: string | null;

/*
 * HintIt
 */
  HintIt?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * Number
 */
  Number: string;

/*
 * PublicationCode
 */
  PublicationCode?: string | null;
}
