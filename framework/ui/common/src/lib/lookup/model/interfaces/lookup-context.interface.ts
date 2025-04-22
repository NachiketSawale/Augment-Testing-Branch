/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken, Injector } from '@angular/core';
import { ILookupConfig } from './lookup-options.interface';
import { IEntityContext } from '@libs/platform/common';
import { ILookupInput } from './lookup-input.interface';
import { ILookupIdentificationData } from './lookup-identification-data.interface';

export const LOOKUP_CONTEXT = new InjectionToken<ILookupContext<object, object>>('LOOKUP_CONTEXT');

/**
 * Lookup context interface
 */
export interface ILookupContext<TItem extends object, TEntity extends object> extends IEntityContext<TEntity> {
	/**
	 * Context injector
	 */
	readonly injector: Injector;
	/**
	 * The lookup component
	 */
	readonly lookupInput?: ILookupInput<TItem, TEntity>;
	/**
	 * Lookup config
	 */
	readonly lookupConfig: ILookupConfig<TItem, TEntity>;
	/**
	 * Selected id
	 */
	readonly selectedId?: ILookupIdentificationData | null;
	/**
	 * The value from input element
	 */
	readonly inputValue?: string;
	/**
	 * Used in grid editor
	 */
	readonly inGridEditor?: boolean;
	/**
	 * used in grid formatter
	 */
	readonly inGridFormatter?: boolean;
}

/**
 * Lookup entity interface
 */
export interface ILookupEntity {
	[index: string]: unknown;
}