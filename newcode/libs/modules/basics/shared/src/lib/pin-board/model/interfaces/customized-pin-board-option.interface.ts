/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * The options used to define non-standard pin board container.
 */
export interface ICustomizedPinBoardOptions {
	/**
	 * Used as the parameter for comment status lookup.
	 *
	 * It only takes effect when 'commentType' is 'CommentType.Customized'.
	 * If defined, please also provide `dataService` parameter in the `IPinBoardContainerCreationOptions`.
	 * The 'dataService' should provide an `entityDescriptor` getter which returns a 'statusIdAccessor' for accessing status icon ID.
	 */
	readonly statusLookupQualifier?: string;

	/**
	 * Indicates the field name of the comment data within the parent complete entity.
	 * This is used to identify and access the comments related to the entity.
	 *
	 * If this parameter is not provided, the default value is `'CommentData'`.
	 *
	 * Example Usage:
	 * Consider a complete entity for the Defect module that contains `DfmCommentsToSave` field
	 * and `DfmCommentsToDelete` field to store comments related to defects.
	 * In this case, you would set the `itemName` parameter to 'DfmComments'.
	 *
	 * ```typescript
	 * // complete entity for Defect module:
	 * {
	 *     "MainItemId": 0,
	 *     "DfmDefect": [],
	 *     "DfmCommentsToSave": [...],
	 *     "DfmCommentsToDelete": null,
	 *     ...
	 * }
	 *
	 * const options: ICustomizedPinBoardOptions = {
	 *   itemName: 'DfmComments',
	 * }
	 * ```
	 */
	readonly itemName?: string;
}
