/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IPaymentGroupEntity } from './payment-group-entity.interface';


export interface IPaymentGroupRateEntityGenerated extends IEntityBase {

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * CompanyFk
 */
  CompanyFk: number;

/*
 * ControllingUnitFk
 */
  ControllingUnitFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * PaymentGroupEntity
 */
  PaymentGroupEntity?: IPaymentGroupEntity | null;

/*
 * PaymentGroupFk
 */
  PaymentGroupFk: number;

/*
 * Rate
 */
  Rate: number;

/*
 * SurchargeTypeFk
 */
  SurchargeTypeFk: number;

/*
 * ValidFrom
 */
  ValidFrom: dateFns;
}
