/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ColumnDef, IEditorDialog, IEditorDialogOptions, IFormConfig } from '@libs/ui/common';
import { ITranslatable, PropertyType } from '@libs/platform/common';
import { EntityRuntimeData } from '@libs/platform/data-access';

/**
 * The options to define the behavior in the search dialog.
 */
export interface ICustomSearchDialogOptions<TItem extends object, TEntity extends object> extends IEditorDialogOptions<ISearchResult<TItem>, IEditorDialog<ISearchResult<TItem>>> {
	/**
	 *
	 * @param entity
	 */
	onDialogOpening?: (entity: ISearchEntity, runtimeData?: EntityRuntimeData<ISearchEntity>) => ISearchEntity;

	/**
	 * The search form options.
	 */
	form?: {
		title?: ITranslatable,
		configuration?: IFormConfig<ISearchEntity>;
		entityRuntimeData?: EntityRuntimeData<ISearchEntity>;
		entity?: (entity: TEntity) => ISearchEntity;
	},

	/**
	 * The grid options for search dialog.
	 */
	grid?: {
		config?: {
			uuid: string,
			columns: ColumnDef<TItem>[];
		};
	}
}

/**
 *
 */
export interface ISearchEntity {
	[key: string]: PropertyType;
}

/**
 *
 */
export interface ISearchResult<TItem extends object> {
	formValue: ISearchEntity;
	selectedItem?: TItem;
}