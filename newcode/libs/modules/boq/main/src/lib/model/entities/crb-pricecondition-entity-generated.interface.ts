/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICrbPriceconditionEntity } from './crb-pricecondition-entity.interface';
import { ICrbPriceconditionScopeEntity } from './crb-pricecondition-scope-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IBoqHeaderEntity } from '@libs/boq/interfaces';
import { ICrbPriceconditionTypeEntity } from './crb-pricecondition-type-entity.interface';

export interface ICrbPriceconditionEntityGenerated extends IEntityBase {

/*
 * BoqHeaderEntity
 */
  BoqHeaderEntity?: IBoqHeaderEntity | null;

/*
 * BoqHeaderFk
 */
  BoqHeaderFk: number;

/*
 * CalculationAmount
 */
  CalculationAmount: number;

/*
 * CalculationType
 */
  CalculationType: number;

/*
 * ChildPriceconditions
 */
  ChildPriceconditions?: ICrbPriceconditionEntity[] | null;

/*
 * ConditionAmount
 */
  ConditionAmount: number;

/*
 * ConditionPercentage
 */
  ConditionPercentage: number;

/*
 * CrbPriceconditionFk
 */
  CrbPriceconditionFk?: number | null;

/*
 * CrbPriceconditionType
 */
  CrbPriceconditionType?: ICrbPriceconditionTypeEntity | null;

/*
 * CrbPriceconditionTypeFk
 */
  CrbPriceconditionTypeFk: number;

/*
 * Description
 */
  Description: string;

/*
 * Id
 */
  Id: number;

/*
 * IsConsidered
 */
  IsConsidered: boolean;

/*
 * Level
 */
  Level: string;

/*
 * ParentPricecondition
 */
  ParentPricecondition?: ICrbPriceconditionEntity | null;

/*
 * PaymentTerm
 */
  PaymentTerm?: number | null;

/*
 * PaymentTermFk
 */
  PaymentTermFk?: number | null;

/*
 * ReferenceAmount
 */
  ReferenceAmount: number;

/*
 * Scopes
 */
  Scopes?: ICrbPriceconditionScopeEntity[] | null;

/*
 * TaxCodeFk
 */
  TaxCodeFk?: number | null;
}
