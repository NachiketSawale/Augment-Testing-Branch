/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IPaymentGroupSurEntity } from './payment-group-sur-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IPaymentGroupRateEntity } from './payment-group-rate-entity.interface';


export interface IPaymentGroupEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * IsDefault
 */
  IsDefault: boolean;

/*
 * IsLive
 */
  IsLive: boolean;

/*
 * PaymentGroupRateEntities
 */
  PaymentGroupRateEntities?: IPaymentGroupRateEntity[] | null;

/*
 * PaymentGroupSurEntities
 */
  PaymentGroupSurEntities?: IPaymentGroupSurEntity[] | null;

/*
 * Sorting
 */
  Sorting: number;

/*
 * TimesheetContextFk
 */
  TimesheetContextFk: number;
}
