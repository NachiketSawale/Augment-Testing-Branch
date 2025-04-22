/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents the parameter to resolve a translation issue
 */
export interface ITranslationIssueResolveParam {
	/**
	 * Issue Guid
	 */
	IssueGuid: string;

	/**
	 * Selected action on the issue
	 */
	OptionGuid: string;

	/**
	 * BasTranslationFk
	 */
	BasTranslationFk: number;

	/**
	 * The item property value
	 */
	ItemValue: string;

	/**
	 * The item property name
	 */
	ColumnName: string;
}