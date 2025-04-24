/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * update material price option enum
 */
export enum BasicsMaterialUpdatePriceWizardOption{
    /**
     * has select material, then the select material option set value=1
     */
    HighlightedMaterial= 1,
    /**
     * has select material Catalog, no select material, then the  material option set value=2
     */
    MaterialResultSet= 2,
    /**
     *  has select material Catalog and have group, no select material
     */
    HighlightedMaterialCatalog= 3
}

