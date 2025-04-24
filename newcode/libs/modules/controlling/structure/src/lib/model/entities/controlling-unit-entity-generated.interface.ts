/*
 * Copyright(c) RIB Software GmbH
 */

import { IControllingUnitStatusEntity } from '../models';
import { IControllingUnitEntity } from './controlling-unit-entity.interface';
import { IControllingUnitGroupEntity } from './controlling-unit-group-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IControllingUnitEntityGenerated extends IEntityBase {

/*
 * Assignment01
 */
  Assignment01?: string | null;

/*
 * Assignment02
 */
  Assignment02?: string | null;

/*
 * Assignment03
 */
  Assignment03?: string | null;

/*
 * Assignment04
 */
  Assignment04?: string | null;

/*
 * Assignment05
 */
  Assignment05?: string | null;

/*
 * Assignment06
 */
  Assignment06?: string | null;

/*
 * Assignment07
 */
  Assignment07?: string | null;

/*
 * Assignment08
 */
  Assignment08?: string | null;

/*
 * Assignment09
 */
  Assignment09?: string | null;

/*
 * Assignment10
 */
  Assignment10?: string | null;

/*
 * Budget
 */
  Budget: number;

/*
 * BudgetCostDiff
 */
  BudgetCostDiff?: number | null;

/*
 * BudgetDifference
 */
  BudgetDifference?: number | null;

/*
 * ClerkFk
 */
  ClerkFk?: number | null;

/*
 * Code
 */
  Code: string;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * CompanyFk
 */
  CompanyFk: number;

/*
 * CompanyResponsibleFk
 */
  CompanyResponsibleFk: number;

/*
 * ContextFk
 */
  ContextFk: number;

/*
 * ContrFormulaPropDefFk
 */
  ContrFormulaPropDefFk?: number | null;

/*
 * ControllingCatFk
 */
  ControllingCatFk: number;

/*
 * ControllingGrpDetail01Fk
 */
  ControllingGrpDetail01Fk?: number | null;

/*
 * ControllingGrpDetail02Fk
 */
  ControllingGrpDetail02Fk?: number | null;

/*
 * ControllingGrpDetail03Fk
 */
  ControllingGrpDetail03Fk?: number | null;

/*
 * ControllingGrpDetail04Fk
 */
  ControllingGrpDetail04Fk?: number | null;

/*
 * ControllingGrpDetail05Fk
 */
  ControllingGrpDetail05Fk?: number | null;

/*
 * ControllingGrpDetail06Fk
 */
  ControllingGrpDetail06Fk?: number | null;

/*
 * ControllingGrpDetail07Fk
 */
  ControllingGrpDetail07Fk?: number | null;

/*
 * ControllingGrpDetail08Fk
 */
  ControllingGrpDetail08Fk?: number | null;

/*
 * ControllingGrpDetail09Fk
 */
  ControllingGrpDetail09Fk?: number | null;

/*
 * ControllingGrpDetail10Fk
 */
  ControllingGrpDetail10Fk?: number | null;

/*
 * ControllingUnitChildren
 */
  ControllingUnitChildren?: IControllingUnitEntity[] | null;

/*
 * ControllingUnitGroups
 */
  ControllingUnitGroups?: IControllingUnitGroupEntity[] | null;

/*
 * ControllingUnitParent
 */
  ControllingUnitParent?: IControllingUnitEntity | null;

/*
 * ControllingUnitStatusEntity
 */
  ControllingUnitStatusEntity?: IControllingUnitStatusEntity | null;

/*
 * ControllingUnits
 */
  ControllingUnits?: IControllingUnitEntity[] | null;

/*
 * ControllingunitFk
 */
  ControllingunitFk?: number | null;

/*
 * ControllingunitstatusFk
 */
  ControllingunitstatusFk: number;

/*
 * ControltemplateFk
 */
  ControltemplateFk?: number | null;

/*
 * ControltemplateUnitFk
 */
  ControltemplateUnitFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstimateCost
 */
  EstimateCost?: number | null;

/*
 * EtmPlantFk
 */
  EtmPlantFk?: number | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * Id
 */
  Id: number;

/*
 * IsAccountingElement
 */
  IsAccountingElement: boolean;

/*
 * IsAssetmanagement
 */
  IsAssetmanagement: boolean;

/*
 * IsBillingElement
 */
  IsBillingElement: boolean;

/*
 * IsDefault
 */
  IsDefault: boolean;

/*
 * IsFixedBudget
 */
  IsFixedBudget: boolean;

/*
 * IsIntercompany
 */
  IsIntercompany: boolean;

/*
 * IsPlanningElement
 */
  IsPlanningElement: boolean;

/*
 * IsPlantmanagement
 */
  IsPlantmanagement: boolean;

/*
 * IsStockmanagement
 */
  IsStockmanagement: boolean;

/*
 * IsTimekeepingElement
 */
  IsTimekeepingElement: boolean;

/*
 * PlannedDuration
 */
  PlannedDuration: number;

/*
 * PlannedEnd
 */
  PlannedEnd?: string | null;

/*
 * PlannedStart
 */
  PlannedStart?: string | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * Quantity
 */
  Quantity: number;

/*
 * StockFk
 */
  StockFk?: number | null;

/*
 * UomFk
 */
  UomFk?: number | null;

/*
 * UserDefined1
 */
  UserDefined1?: string | null;

/*
 * UserDefined2
 */
  UserDefined2?: string | null;

/*
 * UserDefined3
 */
  UserDefined3?: string | null;

/*
 * UserDefined4
 */
  UserDefined4?: string | null;

/*
 * UserDefined5
 */
  UserDefined5?: string | null;
}
