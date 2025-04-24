/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

// import { CompleteIdentification } from '@libs/platform/common';

export class PpsActualTimeRecordingComplete {// implements CompleteIdentification</* TODO add respective entity type */>{

 /*
  * ActionAssignmentToSave
  */
  // public ActionAssignmentToSave!: IGeneralProductActionAssignment[] | null;

 /*
  * DueDate
  */
  public DueDate!: string;

 /*
  * SiteId
  */
  public SiteId!: number;

 /*
  * TimeSymbolId
  */
  public TimeSymbolId!: number;
}
