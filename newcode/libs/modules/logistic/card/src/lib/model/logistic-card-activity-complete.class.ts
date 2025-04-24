/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { CompleteIdentification } from '@libs/platform/common';
import { ILogisticCardActClerkEntity, ILogisticCardActivityEntity, ILogisticCardRecordEntity } from '@libs/logistic/interfaces';

export class LogisticCardActivityComplete extends CompleteIdentification<ILogisticCardActivityEntity>{

 /*
  * Activities
  */
  public Activities: ILogisticCardActivityEntity | null = null;

 /*
  * JobCardActClerkToDelete
  */
  public JobCardActClerkToDelete: ILogisticCardActClerkEntity[] | null = [];

 /*
  * JobCardActClerkToSave
  */
  public JobCardActClerkToSave: ILogisticCardActClerkEntity[] | null = [];

 /*
  * JobCardActivityId
  */
  public JobCardActivityId: number | null = 0;

 /*
  * RecordsToDelete
  */
  public RecordsToDelete: ILogisticCardRecordEntity[] | null = [];

 /*
  * RecordsToSave
  */
  public RecordsToSave: ILogisticCardRecordEntity[] | null = [];
}
