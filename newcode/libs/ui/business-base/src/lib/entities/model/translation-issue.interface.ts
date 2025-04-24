/*
 * Copyright(c) RIB Software GmbH
 */

import { ITranslationIssueOption } from './translation-issue-option.interface';

/**
 * Represents a structure of a Translation Issue
 */
export interface ITranslationIssue {
	/**
	 * The Tr value for the particular column
	 */
	BasTranslationFk: number;

	/**
	 * BasTranslation Value
	 */
	BasTranslationValue: string;

	/**
	 * Column Name of the item table
	 */
	ColumnName: string;

	/**
	 * Unique Guid for the issue
	 */
	IssueGuid: string;

	/**
	 * Issue title
	 */
	IssueTitle: string;

	/**
	 * The column value in item table
	 */
	ItemValue: string;

	/**
	 * Available options for the issue
	 */
	Options: ITranslationIssueOption[];
}