/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICustomFormDialogOptions, ICustomSearchDialogOptions } from './../';
import { IEntityContext } from '@libs/platform/common';
import { ColumnDef, ILookupOptions, IPopupOptions } from '@libs/ui/common';
import { Type } from '@angular/core';

/**
 * A custom dialog lookup context to provide data for render.
 */
export interface ICustomDialogLookupContext<TItem extends object, TEntity extends object> extends IEntityContext<TEntity> {
	entity: TEntity;
	value: TItem | null | undefined;
	options?: CustomDialogLookupOptions<TItem, TEntity>;
}

/**
 * Options to handle lookup item created behavior.
 */
export interface ICreateOptions<TItem extends object, TEntity extends object> {
	/**
	 * Title field.
	 */
	titleField?: string;

	/**
	 *
	 */
	createUrl?: string;

	/**
	 *
	 */
	useUrlPost?: boolean;

	/**
	 *
	 * @param item
	 * @param entity
	 */
	initCreationData?: (request: object, entity: TEntity) => object;

	/**
	 *
	 * @param item
	 * @param entity
	 */
	handleCreateSucceeded?: (item: TItem, entity: TEntity) => TItem;

	/**
	 *
	 */
	formDialogOptions?: ICustomFormDialogOptions<TItem>;

	/**
	 *
	 * @param formEntity
	 */
	onDialogOpening?: (formEntity: TItem) => void;
}

/**
 *
 */
export type CustomDialogLookupOptions<TItem extends object, TEntity extends object> = {
	/**
	 * If the binding model is the dto, this field must be the respective foreign key, like 'AddressFk'.
	 * Can not configure at the same time as 'objectKey'.
	 */
	foreignKey?: string;

	/**
	 * If the binding model is the foreign key, this field must be the respective dto name, like 'Address'.
	 * Can not configure at the same time as 'foreignKey'.
	 */
	objectKey?: string;

	/**
	 * If true, clone the selected item otherwise using reference directly.
	 */
	cloneOnly?: boolean;
	/**
	 *
	 * @param oldValue
	 * @param newValue
	 */
	cloneFn?: (oldValue: TItem, newValue: TItem) => TItem;
	/**
	 * Options to handle create item.
	 */
	createOptions?: ICreateOptions<TItem, TEntity>;
	/**
	 *
	 */
	showSearchButton?: boolean;
	/**
	 *
	 */
	showPopupButton?: boolean;
	/**
	 * The search options.
	 */
	searchOptions?: ICustomSearchDialogOptions<TItem, TEntity>;
	/**
	 *
	 */
	searchButtonCss?: string;
	/**
	 *
	 */
	popupOptions?: {
		gridView?: Type<unknown>,
		options?: {
			config?: {
				uuid: string,
				columns: ColumnDef<TItem>[];
			};
		} & IPopupOptions
	};
} & Omit<ILookupOptions<TItem, TEntity>, 'popupOptions'>;

/**
 *
 */
export type CustomLookupPopupResult<TItem extends object> = {
	apply: boolean;
	result?: TItem
}