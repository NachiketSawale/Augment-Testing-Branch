/*
 * Copyright(c) RIB Software GmbH
 */



import { IMaterialEntity, IMaterialPriceConditionEntity, IMaterialScopeEntity } from '@libs/basics/interfaces';
import { CompleteIdentification } from '@libs/platform/common';
import { IMaterial2CertificateEntity } from '../entities/material-2-certificate-entity.interface';
import { IMaterial2ProjectStockEntity } from '../entities/material-2-project-stock-entity.interface';
import { IMaterial2ProjectStockToSaveEntity } from '../entities/material-2-project-stock-to-save-entity.interface';
import { IMdcMaterial2basUomEntity } from '../entities/mdc-material-2-bas-uom-entity.interface';
import { IMaterialDocumentEntity } from '../entities/material-document-entity.interface';
import { MaterialGroupCharComplete } from './material-group-char-complete.class';
import { IMaterialPortionEntity } from '../entities/material-portion-entity.interface';
import { IMaterialPriceListEntity } from '../entities/material-price-list-entity.interface';
import { IMdcMaterialReferenceEntity } from '../entities/mdc-material-reference-entity.interface';
import { MaterialPriceListComplete } from './material-price-list-complete.class';
import { MaterialScopeComplete } from './material-scope-complete.class';
import { IStock2matPriceverEntity } from '../entities/stock-2-mat-pricever-entity.interface';
import { IMaterialCharacteristicEntity } from '@libs/basics/shared';

export class MaterialComplete implements CompleteIdentification<IMaterialEntity>{

  /**
   * BlobSpecificationToDelete
   */
  // public BlobSpecificationToDelete?: IBlobStringEntity | null = {};

  /**
   * BlobSpecificationToSave
   */
  // public BlobSpecificationToSave?: IBlobStringEntity | null = {};

  /**
   * BlobToDelete
   */
  // public BlobToDelete?: IBlobEntity[] | null = [];

  /**
   * BlobToSave
   */
  // public BlobToSave?: IBlobEntity[] | null = [];

  /**
   * EntitiesCount
   */
  public EntitiesCount: number = 0;

  /**
   * ErrorMessage
   */
  public ErrorMessage?: string | null = '';

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * Material
   */
  public Material?: IMaterialEntity | null;

  /**
   * Material2CertificateToDelete
   */
  public Material2CertificateToDelete?: IMaterial2CertificateEntity[] | null = [];

  /**
   * Material2CertificateToSave
   */
  public Material2CertificateToSave?: IMaterial2CertificateEntity[] | null = [];

  /**
   * Material2ProjectStockToDelete
   */
  public Material2ProjectStockToDelete?: IMaterial2ProjectStockEntity[] | null = [];

  /**
   * Material2ProjectStockToSave
   */
  public Material2ProjectStockToSave?: IMaterial2ProjectStockToSaveEntity[] | null = [];

  /**
   * Material2basUomToDelete
   */
  public Material2basUomToDelete?: IMdcMaterial2basUomEntity[] | null = [];

  /**
   * Material2basUomToSave
   */
  public Material2basUomToSave?: IMdcMaterial2basUomEntity[] | null = [];

  /**
   * MaterialCharacteristicToDelete
   */
  public MaterialCharacteristicToDelete?: IMaterialCharacteristicEntity[] | null = [];

  /**
   * MaterialCharacteristicToSave
   */
  public MaterialCharacteristicToSave?: IMaterialCharacteristicEntity[] | null = [];

  /**
   * MaterialDocumentToDelete
   */
  public MaterialDocumentToDelete?: IMaterialDocumentEntity[] | null = [];

  /**
   * MaterialDocumentToSave
   */
  public MaterialDocumentToSave?: IMaterialDocumentEntity[] | null = [];

  /**
   * MaterialGroupCharCompleteToSave
   */
  public MaterialGroupCharCompleteToSave?: MaterialGroupCharComplete[] | null = [];

  /**
   * MaterialPortionToDelete
   */
  public MaterialPortionToDelete?: IMaterialPortionEntity[] | null = [];

  /**
   * MaterialPortionToSave
   */
  public MaterialPortionToSave?: IMaterialPortionEntity[] | null = [];

  /**
   * MaterialPriceConditionToDelete
   */
  public MaterialPriceConditionToDelete?: IMaterialPriceConditionEntity[] | null = [];

  /**
   * MaterialPriceConditionToSave
   */
  public MaterialPriceConditionToSave?: IMaterialPriceConditionEntity[] | null = [];

  /**
   * MaterialPriceListToDelete
   */
  public MaterialPriceListToDelete?: IMaterialPriceListEntity[] | null = [];

  /**
   * MaterialPriceListToSave
   */
  public MaterialPriceListToSave?: MaterialPriceListComplete[] | null = [];

  /**
   * MaterialReferenceToDelete
   */
  public MaterialReferenceToDelete?: IMdcMaterialReferenceEntity[] | null = [];

  /**
   * MaterialReferenceToSave
   */
  public MaterialReferenceToSave?: IMdcMaterialReferenceEntity[] | null = [];

  /**
   * MaterialScopeToDelete
   */
  public MaterialScopeToDelete?: IMaterialScopeEntity[] | null = [];

  /**
   * MaterialScopeToSave
   */
  public MaterialScopeToSave?: MaterialScopeComplete[] | null = [];

  /**
   * Materials
   */
  public Materials?: IMaterialEntity[] | null = [];

  /**
   * SelectedMaterialId
   */
  public SelectedMaterialId: number = 0;

  /**
   * Stock2matPriceverToDelete
   */
  public Stock2matPriceverToDelete?: IStock2matPriceverEntity[] | null = [];

  /**
   * Stock2matPriceverToSave
   */
  public Stock2matPriceverToSave?: IStock2matPriceverEntity[] | null = [];


  public Material2ProjectStock?: IMaterial2ProjectStockEntity;


}

