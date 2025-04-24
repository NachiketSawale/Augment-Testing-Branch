/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEditorDialog, IEditorDialogOptions, IFormConfig } from '@libs/ui/common';
import { StaticProvider, Type } from '@angular/core';
import { EntityRuntimeData } from '@libs/platform/data-access';

/**
 *
 */
export interface ICustomFormEditorDialog<TItem extends object> extends IEditorDialog<TItem> {
	readonly options: ICustomFormDialogOptions<TItem>;
}

/**
 *
 */
export interface ICustomFormDialogOptions<TItem extends object> extends IEditorDialogOptions<TItem, ICustomFormEditorDialog<TItem>> {
	/**
	 * The form configuration to show in dialog.
	 */
	formConfiguration?: IFormConfig<TItem>;
	entityRuntimeData?: EntityRuntimeData<TItem>;
	sectionTop?: ICustomFormDialogSectionOptions;
	sectionLeft?: ICustomFormDialogSectionOptions;
	sectionRight?: ICustomFormDialogSectionOptions;
	sectionBottom?: ICustomFormDialogSectionOptions;
}


/**
 *
 */
export interface ICustomFormDialogSectionOptions {
	component: Type<unknown>;
	providers?: StaticProvider[];
	visible?: boolean;
}