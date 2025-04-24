/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialNewEntity } from './material-new-entity.interface';
import { IMaterialEventTypeEntity } from './material-event-type-entity.interface';
import { IMdcProductDescriptionEntity } from './mdc-product-description-entity.interface';
import { MdcProductDescriptionComplete } from './mdc-product-description-complete.class';
import { IPpsEventTypeRelEntity } from './pps-event-type-rel-entity.interface';
import { IPpsMaterialCompEntity } from './pps-material-comp-entity.interface';
import { IPpsMaterialMappingEntity } from './pps-material-mapping-entity.interface';
import { IPpsSummarizedMatEntity } from './pps-summarized-mat-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class PpsMaterialComplete implements CompleteIdentification<IMaterialNewEntity>{

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * Material
   */
  public Material?: IMaterialNewEntity | null;

  /**
   * MaterialEventTypeToDelete
   */
  public MaterialEventTypeToDelete?: IMaterialEventTypeEntity[] | null = [];

  /**
   * MaterialEventTypeToSave
   */
  public MaterialEventTypeToSave?: IMaterialEventTypeEntity[] | null = [];

  /**
   * MdcProductDescriptionToDelete
   */
  public MdcProductDescriptionToDelete?: IMdcProductDescriptionEntity[] | null = [];

  /**
   * MdcProductDescriptionToSave
   */
  public MdcProductDescriptionToSave?: MdcProductDescriptionComplete[] | null = [];

  /**
   * PpsEventTypeRelToDelete
   */
  public PpsEventTypeRelToDelete?: IPpsEventTypeRelEntity[] | null = [];

  /**
   * PpsEventTypeRelToSave
   */
  public PpsEventTypeRelToSave?: IPpsEventTypeRelEntity[] | null = [];

  /**
   * PpsMaterialCompToDelete
   */
  public PpsMaterialCompToDelete?: IPpsMaterialCompEntity[] | null = [];

  /**
   * PpsMaterialCompToSave
   */
  public PpsMaterialCompToSave?: IPpsMaterialCompEntity[] | null = [];

  /**
   * PpsMaterialMappingToDelete
   */
  public PpsMaterialMappingToDelete?: IPpsMaterialMappingEntity[] | null = [];

  /**
   * PpsMaterialMappingToSave
   */
  public PpsMaterialMappingToSave?: IPpsMaterialMappingEntity[] | null = [];

  /**
   * SummarizedMaterialToDelete
   */
  public SummarizedMaterialToDelete?: IPpsSummarizedMatEntity[] | null = [];

  /**
   * SummarizedMaterialToSave
   */
  public SummarizedMaterialToSave?: IPpsSummarizedMatEntity[] | null = [];
}
