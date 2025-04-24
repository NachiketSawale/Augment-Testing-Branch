/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ISimpleActionOptions } from './simple-action-options.interface';

/**
 * Accordion options
 * @typeParam T - entity type handled by the data service
 */
export interface ISimpleActionFilterHandleOptions<TEntity>{

	/**
	 * Filter function for selected entities that does not need to be handled
	 */
	filter(entities: TEntity[]): TEntity[];

	/**
	 * Handler function for doing the necessary changes to one entity, i.e. set IsLive to true
	 */
	handle(entity: TEntity): void;

	/**
	 * Validate if entities which may pass the filter, are in a state that allows the change
	 */
	validate?(entity: TEntity): boolean

	/**
	 * Validate if entities which may pass the filter, are in a state that allows the change
	 */
	validationErrMessage?: string

	/**
	 * baseOptions for the basicsimple action wizard servive
	 */
	baseOptions: ISimpleActionOptions<TEntity>
}


