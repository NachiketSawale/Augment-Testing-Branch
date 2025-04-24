/*
 * Copyright(c) RIB Software GmbH
 */

import { StaticProvider, Type } from '@angular/core';
import { ITranslatable } from '@libs/platform/common';
import { IEditorDialog, IEditorDialogOptions } from '@libs/ui/common';
import { ICompositeBaseEntity } from './composite-base-entity.interface';
import { ICompareSettingBase } from './compare-setting-base.interface';

export interface ICompareSettingSection {
	id: string;
	title: ITranslatable;
	component: Type<unknown>;
	providers?: StaticProvider[];
	expanded?: boolean;
	order: number;
}

export interface ICompareSettingDialogOptions<T extends ICompositeBaseEntity<T>, ST extends ICompareSettingBase<T>> extends IEditorDialogOptions<ST, ICompareSettingEditorDialog<T, ST>> {
	customSections?: ICompareSettingSection[];
	handleSectionsFn?: (sections: ICompareSettingSection[]) => ICompareSettingSection[];
}

export interface ICompareSettingEditorDialog<T extends ICompositeBaseEntity<T>, ST extends ICompareSettingBase<T>> extends IEditorDialog<ST> {
	loading: boolean;
}

export interface ICompareSettingDialogContext<T extends ICompositeBaseEntity<T>, ST extends ICompareSettingBase<T>> {
	settings: () => Promise<ST>;
	sections: ICompareSettingSection[];
}