/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { ITransactionEntity } from '@libs/sales/interfaces';

export class TransactionComplete implements CompleteIdentification<ITransactionEntity>{

  /**
   * BilTransaction
   */
  public BilTransaction?: ITransactionEntity | null;

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * controllingStructureGrpSetDTLToDelete
   */
  //public controllingStructureGrpSetDTLToDelete?: {}[] | null = [];

  /**
   * controllingStructureGrpSetDTLToSave
   */
  //public controllingStructureGrpSetDTLToSave?: {}[] | null = [];
}
