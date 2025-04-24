/*
 * Copyright(c) RIB Software GmbH
 */

import { ITimeSymbolAccountEntity } from './time-symbol-account-entity.interface';
import { ITimeSymbolEntity } from './time-symbol-entity.interface';
import { ITimeSymbol2GroupEntity } from './time-symbol-2-group-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class TimeSymbolComplete implements CompleteIdentification<ITimeSymbolEntity>{

  /**
   * AccountsToDelete
   */
  public AccountsToDelete?: ITimeSymbolAccountEntity[] | null = [];

  /**
   * AccountsToSave
   */
  public AccountsToSave?: ITimeSymbolAccountEntity[] | null = [];

  /**
   * Id
   */
  public Id: number = 0;

  /**
   * MainItemId
   */
  public MainItemId?: number;

  /**
   * TimeSymbol
   */
  public TimeSymbol?: ITimeSymbolEntity | null = null;

  /**
   * TimeSymbol2GroupToDelete
   */
  public TimeSymbol2GroupToDelete?: ITimeSymbol2GroupEntity[] | null = [];

  /**
   * TimeSymbol2GroupToSave
   */
  public TimeSymbol2GroupToSave?: ITimeSymbol2GroupEntity[] | null = [];

  /**
   * TimeSymbols
   */
  public TimeSymbols?: ITimeSymbolEntity[] | null = [];
}
