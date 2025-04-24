/*
 * Copyright(c) RIB Software GmbH
 */



import { IMaterialCatalogEntity, IMaterialGroupEntity, IMaterialPriceVersionEntity } from '@libs/basics/shared';
import { CompleteIdentification } from '@libs/platform/common';
import { IMaterialDiscountGroupEntity } from './entities/material-discount-group-entity.interface';
import { MaterialGroupComplete } from './material-group-complete.class';
import { MaterialPriceVersionComplete } from './material-price-version-complete.class';
import { ICompanies2MaterialCatalogEntity } from './entities/companies-2-material-catalog-entity.interface';

export class MaterialCatalogComplete implements CompleteIdentification<IMaterialCatalogEntity>{

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * MaterialCatalog
   */
  public MaterialCatalog?: IMaterialCatalogEntity | null;

  /**
   * MaterialCatalogs
   */
  public MaterialCatalogs?: IMaterialCatalogEntity[] | null = [];

  /**
   * MaterialDiscountGroupToDelete
   */
  public MaterialDiscountGroupToDelete?: IMaterialDiscountGroupEntity[] | null = [];

  /**
   * MaterialDiscountGroupToSave
   */
  public MaterialDiscountGroupToSave?: IMaterialDiscountGroupEntity[] | null = [];

  /**
   * MaterialGroupToDelete
   */
  public MaterialGroupToDelete?: IMaterialGroupEntity[] | null = [];

  /**
   * MaterialGroupToSave
   */
  public MaterialGroupToSave?: MaterialGroupComplete[] | null = [];

  /**
   * MaterialPriceVersionToDelete
   */
  public MaterialPriceVersionToDelete?: IMaterialPriceVersionEntity[] | null = [];

  /**
   * MaterialPriceVersionToSave
   */
  public MaterialPriceVersionToSave?: MaterialPriceVersionComplete[] | null = [];

  /**
   * MdcMaterialCatCompanyToSave
   */
  public MdcMaterialCatCompanyToSave?: ICompanies2MaterialCatalogEntity[] | null = [];

  public constructor(e: IMaterialCatalogEntity | null) {
		if (e) {
			this.MainItemId = e.Id;
			this.MaterialCatalog = e;
		}
	}
}
