/*
 * Copyright(c) RIB Software GmbH
 */



import { CompleteIdentification } from '@libs/platform/common';
import { IPrcItemScopeDetailEntity, IPrcItemScopeDetailPcEntity, IPrcItemScopeDtlBlobEntity } from '../entities';

export class PrcItemScopeDetailComplete implements CompleteIdentification<IPrcItemScopeDetailEntity>{

  /**
   * CostGroupToDelete
   */
  // public CostGroupToDelete?: IMainItem2CostGroupEntity[] | null = [];

  /**
   * CostGroupToSave
   */
  // public CostGroupToSave?: IMainItem2CostGroupEntity[] | null = [];

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * PrcItemScopeDetail
   */
  public PrcItemScopeDetail?: IPrcItemScopeDetailEntity | null;

  /**
   * PrcItemScopeDetailPcToDelete
   */
  public PrcItemScopeDetailPcToDelete?: IPrcItemScopeDetailPcEntity[] | null = [];

  /**
   * PrcItemScopeDetailPcToSave
   */
  public PrcItemScopeDetailPcToSave?: IPrcItemScopeDetailPcEntity[] | null = [];

  /**
   * PrcItemScopeDtlBlobToDelete
   */
  public PrcItemScopeDtlBlobToDelete?: IPrcItemScopeDtlBlobEntity[] | null = [];

  /**
   * PrcItemScopeDtlBlobToSave
   */
  public PrcItemScopeDtlBlobToSave?: IPrcItemScopeDtlBlobEntity[] | null = [];
}
