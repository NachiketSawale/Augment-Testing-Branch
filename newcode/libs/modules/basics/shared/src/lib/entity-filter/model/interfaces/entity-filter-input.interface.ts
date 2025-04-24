/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityFilterExpression } from './entity-filter-expression.interface';

/**
 * Interface representing the input for entity filtering.
 */
export interface IEntityFilterInput {
	/** The user input */
	UserInput?: string;

	/** Requested page number */
	PageNumber: number;

	/** Request page size */
	PageSize: number;

	/** Retrieve count */
	CountAll?: boolean;

	/** The additional filters */
	Filters?: IEntityFilterExpression[];

	/** The contract name of customized material filter */
	ContractName?: string;

	/** Material filter context */
	Context?: { [key: string]: unknown };

	/** Show logging message in frontend */
	ShowTraceLog?: boolean;
}
