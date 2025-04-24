/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Configuration interface for the display of material filter results
 */
export interface IMaterialFilterResultDisplayConfig {
	/**
	 * The sorting option to apply to filter.
	 */
	sortOption?: number;

	/**
	 * The number of items to display per page in the filter results.
	 */
	itemsPerPage?: number;

	/**
	 * A flag indicating whether to show images in the preview.
	 */
	showImageInPreview?: boolean;

	/**
	 * A JSON string representing the attributes to display in the preview.
	 */
	previewAttributes?: string;

	/**
	 * A flag indicating whether to filter by the header structure.
	 */
	isFilterByHeaderStructure?: boolean;
}

/**
 * Configuration interface for the display of material filter results within a company context.
 */
export interface IMaterialFilterResultDisplayConfigInCompany {
	/**
	 * The identifier for the company that is logged in.
	 */
	loginCompany: number;

	/**
	 * Configuration object for the material filter lookup.
	 */
	config: IMaterialFilterResultDisplayConfig;
}