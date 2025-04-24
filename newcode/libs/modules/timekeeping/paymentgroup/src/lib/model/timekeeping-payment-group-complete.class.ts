/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */




import { CompleteIdentification } from '@libs/platform/common';
import { IPaymentGroupEntity, IPaymentGroupRateEntity, IPaymentGroupSurEntity } from '@libs/timekeeping/interfaces';

export class TimekeepingPaymentGroupComplete implements CompleteIdentification<IPaymentGroupEntity>{

	/*
 * MainItemId
 */
  public MainItemId: number = 0;
 /*
  * PaymentGroup
  */
  public PaymentGroup?: IPaymentGroupEntity | null =null;

 /*
  * PaymentGroupId
  */
  public PaymentGroupId?: number | null = 10;

 /*
  * PaymentGroups
  */
  public PaymentGroups?: IPaymentGroupEntity[] | null = [];

 /*
  * RatesToDelete
  */
  public RatesToDelete?: IPaymentGroupRateEntity[] | null = [];

 /*
  * RatesToSave
  */
  public RatesToSave?: IPaymentGroupRateEntity[] | null = [];

 /*
  * SurchargesToDelete
  */
  public SurchargesToDelete?: IPaymentGroupSurEntity[] | null = [];

 /*
  * SurchargesToSave
  */
  public SurchargesToSave?: IPaymentGroupSurEntity[] | null = [];
}
