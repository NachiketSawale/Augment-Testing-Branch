/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILogisticCardActivityEntity, ILogisticCardDocumentEntity, ILogisticCardEntity, ILogisticCardWorkEntity } from '@libs/logistic/interfaces';
import { LogisticCardActivityComplete } from './logistic-card-activity-complete.class';
import { CompleteIdentification } from '@libs/platform/common';

export class LogisticCardComplete extends CompleteIdentification<ILogisticCardEntity>{

 /*
  * ActivitiesToDelete
  */
  public ActivitiesToDelete: ILogisticCardActivityEntity[] | null = [];

 /*
  * ActivitiesToSave
  */
  public ActivitiesToSave: LogisticCardActivityComplete[] | null = [];

 /*
  * CardId
  */
  public CardId?: number | null;

 /*
  * Cards
  */
  public Cards: ILogisticCardEntity[] | null = [];

 /*
  * JobCardDocumentToDelete
  */
  public JobCardDocumentToDelete?: ILogisticCardDocumentEntity[] | null = [];

 /*
  * JobCardDocumentToSave
  */
  public JobCardDocumentToSave?: ILogisticCardDocumentEntity[] | null = [];

 /*
  * WorksToDelete
  */
  public WorksToDelete?: ILogisticCardWorkEntity[] | null = [];

 /*
  * WorksToSave
  */
  public WorksToSave?: ILogisticCardWorkEntity[] | null = [];
}
