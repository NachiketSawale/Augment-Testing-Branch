/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';

/**
 * Interface representing the output for entity filtering.
 */
export interface IEntityFilterOutput<TEntity extends IEntityIdentification> {
	/** Entity count found */
	EntitiesFound: number;

	/** entities */
	Entities: TEntity[];

	/** Additional output */
	Addition?: { [key: string]: unknown };

	/** The logging message */
	TraceLog?: string;

	/**
	 * Whether it has more entities
	 */
	HasMoreEntities?: boolean;
}
