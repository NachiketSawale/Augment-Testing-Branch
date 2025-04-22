/*
 * Copyright(c) RIB Software GmbH
 */

import { IViewerSettingsEntity } from '../../viewer-settings/model/entities/viewer-settings-entity.interface';
import {
	IStaticHlSchemeCompleteEntity
} from '../../hl-schemes/model/entities/static-hl-scheme-complete-entity.interface';
import { IHighlightingSchemeEntity } from '../../hl-schemes/model/entities/highlighting-scheme-entity.interface';
import { IDynHlSchemeCompleteEntity } from '../../hl-schemes/model/entities/dyn-hl-scheme-complete-entity.interface';
import { IPropertyKeyTagCategoryComplete } from '../../property-keys/model/entities/property-key-tag-category-complete.interface';
import { IPropertyKeyTagCategoryEntity } from '../../property-keys/model/entities/property-key-tag-category-entity.interface';
import { IPropertyKeyEntity } from '../../property-keys/model/entities/property-key-entity.interface';
import { IPropertyKeyComparisonExclusionEntity } from '../../property-keys/model/entities/property-key-comparison-exclusion-entity.interface';
import { IDataTreeComplete } from '../../data-trees/model/entities/data-tree-complete.interface';
import { IDataTreeEntity } from '../../data-trees/model/entities/data-tree-entity.interface';
import { IModelImportProfileComplete } from '../../model-import/model/entities/model-import-profile-complete.interface';
import { IModelImportProfileEntity } from '../../model-import/model/entities/model-import-profile-entity.interface';

/**
 * Represents the complete data managed in the model.administration module.
 */
export interface IModelAdministrationCompleteEntity {

	/**
	 * The viewer settings to save.
	 */
	ViewerSettingsToSave: IViewerSettingsEntity[] | null;

	/**
	 * The viewer settings to delete.
	 */
	ViewerSettingsToDelete: IViewerSettingsEntity[] | null;

	/**
	 * Static highlighting schemes to save.
	 */
	StaticHighlightingSchemesToSave: IStaticHlSchemeCompleteEntity[] | null;

	/**
	 * Static highlighting schemes to delete.
	 */
	StaticHighlightingSchemesToDelete: IHighlightingSchemeEntity[] | null;

	/**
	 * Static highlighting schemes to save.
	 */
	DynamicHighlightingSchemesToSave: IDynHlSchemeCompleteEntity[] | null;

	/**
	 * Static highlighting schemes to delete.
	 */
	DynamicHighlightingSchemesToDelete: IHighlightingSchemeEntity[] | null;

	/**
	 * Property key tag categories to save.
	 */
	PropertyKeyTagCategoriesToSave: IPropertyKeyTagCategoryComplete[] | null;

	/**
	 * Property key tag categories to delete.
	 */
	PropertyKeyTagCategoriesToDelete: IPropertyKeyTagCategoryEntity[] | null;

	/**
	 * Property keys to save.
	 */
	PropertyKeysToSave: IPropertyKeyEntity[] | null;

	/**
	 * Property key comparison exclusions to save.
	 */
	ModelComparePropertykeyBlackListToSave: IPropertyKeyComparisonExclusionEntity[] | null;

	/**
	 * Property key comparison exclusions to delete.
	 */
	ModelComparePropertykeyBlackListToDelete: IPropertyKeyComparisonExclusionEntity[] | null;

	/**
	 * Data trees and associated data to save.
	 */
	DataTreesToSave: IDataTreeComplete[] | null;

	/**
	 * Data trees to delete.
	 */
	DataTreesToDelete: IDataTreeEntity[] | null;

	/**
	 * Model import profiles to save.
	 */
	ModelImportProfilesToSave: IModelImportProfileComplete[] | null;

	/**
	 * Model import profiles to delete.
	 */
	ModelImportProfilesToDelete: IModelImportProfileEntity[] | null;
}
