/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IMaterialCatalogEntity, IMaterialGroupEntity } from '@libs/basics/shared';

/**
 * Material catalog complete entity
 */
export class BasicsMaterialMaterialCatalogComplete extends CompleteIdentification<IMaterialCatalogEntity> {
	public MainItemId?: number;
	public MaterialCatalog?: IMaterialCatalogEntity;
	public MaterialMaterialGroup?: IMaterialGroupEntity;

	/**
	 * The constructor
	 * @param e
	 */
	public constructor(e: IMaterialCatalogEntity | null) {
		super();
		if (e) {
			this.MainItemId = e.Id;
			this.MaterialCatalog = e;
		}
	}
}
