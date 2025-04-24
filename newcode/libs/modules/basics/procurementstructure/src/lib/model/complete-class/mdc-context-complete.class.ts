/*
 * Copyright(c) RIB Software GmbH
 */




import { CompleteIdentification } from '@libs/platform/common';
import { IInterCompanyStructureEntity } from '../entities/inter-company-structure-entity.interface';
import { IMdcContextEntity } from '../entities/mdc-context-entity.interface';

export class MdcContextComplete implements CompleteIdentification<IMdcContextEntity>{

  /**
   * InterCompanyStructureToDelete
   */
  public InterCompanyStructureToDelete?: IInterCompanyStructureEntity[] | null = [];

  /**
   * InterCompanyStructureToSave
   */
  public InterCompanyStructureToSave?: IInterCompanyStructureEntity[] | null = [];

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * MdcContext
   */
  public MdcContext?: IMdcContextEntity | null;

  public constructor(e: IMdcContextEntity | null) {
    if (e) {
        this.MainItemId = e.Id;
        
    }
}

}
