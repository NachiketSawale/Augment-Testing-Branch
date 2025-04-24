/*
 * Copyright(c) RIB Software GmbH
 */



import { CompleteIdentification } from '@libs/platform/common';
import { IMdcSalesTaxCodeEntity } from '@libs/basics/interfaces';

import { IMdcSalesTaxMatrixEntity } from '../interface/mdc-sales-tax-matrix-entity.interface';

export class MdcSalesTaxCodeComplete implements CompleteIdentification<IMdcSalesTaxCodeEntity>{

  /**
   * EntitiesCount
   */
  public EntitiesCount: number = 0;

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * MdcSalesTaxCode
   */
  public MdcSalesTaxCode?: IMdcSalesTaxCodeEntity | null;

  /**
   * MdcSalesTaxMatrixToDelete
   */
  public MdcSalesTaxMatrixToDelete?: IMdcSalesTaxMatrixEntity[] | null = [];

  /**
   * MdcSalesTaxMatrixToSave
   */
  public MdcSalesTaxMatrixToSave?: IMdcSalesTaxMatrixEntity[] | null = [];

  public constructor(e: IMdcSalesTaxCodeEntity | null) {
		if (e) {
			this.MainItemId = e.Id;
			this.MdcSalesTaxCode = e;
			this.EntitiesCount = e ? 1 : 0;
		}
	}
}
