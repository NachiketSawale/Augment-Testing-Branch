/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILookupContext } from './lookup-context.interface';
import { Translatable } from '@libs/platform/common';

/**
 * Lookup button configuration interface
 */
export interface IUiCommonLookupBtn<TItem extends object, TEntity extends object> {
	/**
	 * The id
	 */
	id: string;
	/**
	 * The order
	 */
	order: number;
	/**
	 * Disabled
	 */
	disabled: boolean;
	/**
	 * hidden
	 */
	hidden: boolean;
	/**
	 * Caption
	 */
	caption?: Translatable;
	/**
	 * Inner text content
	 */
	content?: Translatable;
	/**
	 * Image url
	 */
	image?: string;
	/**
	 * Only shown on readonly mode
	 */
	shownOnReadonly?: boolean;
	/**
	 * The css
	 */
	css?: {
		class?: string;
		style?: string;
	};

	/**
	 * Executor
	 * @param context
	 */
	execute(context?: ILookupContext<TItem, TEntity>): void;

	/**
	 * Can be executed
	 * @param context
	 */
	canExecute?(context?: ILookupContext<TItem, TEntity>): boolean;

	/**
	 * Is disabled
	 * @param context
	 */
	isDisabled(context?: ILookupContext<TItem, TEntity>): boolean;
}