/*
 * Copyright(c) RIB Software GmbH
 */

import { StaticProvider, Type } from '@angular/core';
import { ITranslatable } from '@libs/platform/common';
import { IEditorDialog, IEditorDialogOptions } from '@libs/ui/common';
import { IComparePrintBase } from './compare-print-base.interface';
import { ICompositeBaseEntity } from '../composite-base-entity.interface';
import { IComparePrintProfileEntity } from './compare-print-profile-entity.interface';

/**
 * Represents a section in the compare print dialog.
 */
export interface IComparePrintSection {
	/** Unique identifier for the section. */
	id: string;

	/** Title of the section, which can be translated. */
	title: ITranslatable;

	/** Component type to be used for the section. */
	component: Type<unknown>;

	/** Optional providers for the section. */
	providers?: StaticProvider[];

	/** Indicates if the section is active. */
	active?: boolean;

	/** Order of the section in the dialog. */
	order: number;
}

/**
 * Options for configuring the compare print dialog.
 */
export interface IComparePrintDialogOptions<T extends ICompositeBaseEntity<T>, PT extends IComparePrintBase<T>> extends IEditorDialogOptions<PT, IComparePrintEditorDialog<T, PT>> {
	/** Custom sections to be included in the dialog. */
	customSections?: IComparePrintSection[];

	/** Function to handle and modify the sections. */
	handleSectionsFn?: (sections: IComparePrintSection[]) => IComparePrintSection[];
}

/**
 * Represents the editor dialog for compare print.
 */
export interface IComparePrintEditorDialog<T extends ICompositeBaseEntity<T>, PT extends IComparePrintBase<T>> extends IEditorDialog<PT> {
	/** Indicates if the dialog is loading. */
	loading: boolean;
}

export interface IComparePrintDialogEvents<T extends ICompositeBaseEntity<T>, PT extends IComparePrintBase<T>> {
	loadModeChanged: (value: string, settings: PT) => void;
	genericProfileChanged: (value: IComparePrintProfileEntity, settings: PT) => void;
	rfqProfileChanged: (value: IComparePrintProfileEntity, settings: PT) => void;
}

/**
 * Context for the compare print dialog.
 */
export interface IComparePrintDialogContext<T extends ICompositeBaseEntity<T>, PT extends IComparePrintBase<T>> {
	/** Function to get the settings for the dialog. */
	settings: () => Promise<PT>;

	/** Sections to be included in the dialog. */
	sections: IComparePrintSection[];

	/** Dialog events */
	events?: IComparePrintDialogEvents<T, PT>;
}