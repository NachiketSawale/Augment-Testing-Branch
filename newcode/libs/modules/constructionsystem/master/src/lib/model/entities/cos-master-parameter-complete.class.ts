/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { ICosParameter2TemplateEntity } from './cos-parameter-2-template-entity.interface';
import { ICosParameterEntity, ICosParameterValueEntity } from '@libs/constructionsystem/shared';

export class CosMasterParameterComplete implements CompleteIdentification<ICosParameterEntity>{

  /**
   * CosMasterParameterValueToDelete
   */
  public CosMasterParameterValueToDelete?: ICosParameterValueEntity[] | null = [];

  /**
   * CosMasterParameterValueToSave
   */
  public CosMasterParameterValueToSave?: ICosParameterValueEntity[] | null = [];

  /**
   * CosParameter
   */
  public CosParameter?: ICosParameterEntity | null;

  /**
   * CosParameter2TemplateToDelete
   */
  public CosParameter2TemplateToDelete?: ICosParameter2TemplateEntity[] | null = [];

  /**
   * CosParameter2TemplateToSave
   */
  public CosParameter2TemplateToSave?: ICosParameter2TemplateEntity[] | null = [];

  /**
   * EntitiesCount
   */
  public EntitiesCount: number = 0;

  /**
   * MainItemId
   */
  public MainItemId: number = 0;
}
