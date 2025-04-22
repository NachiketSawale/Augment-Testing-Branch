/*
 * Copyright(c) RIB Software GmbH
 */

import { IEditorDialog, IEditorDialogOptions } from '@libs/ui/common';
import { IComparePrintProfileEntity } from './compare-print-profile-entity.interface';
import { CompareProfileSaveLocations } from '../../enums/compare-profile-save-locations.enum';
import { IComparePrintGenericProfile } from './compare-print-generic-profile.interface';
import { IComparePrintRfqProfile } from './compare-print-rfq-profile.interface';

/**
 * Options for configuring the compare print dialog.
 */
export interface IComparePrintSaveProfileDialogOptions extends IEditorDialogOptions<IComparePrintProfileEntity[], IComparePrintSaveProfileEditorDialog> {

}

/**
 * Represents the editor dialog for compare print.
 */
export interface IComparePrintSaveProfileEditorDialog extends IEditorDialog<IComparePrintProfileEntity[]> {
	/** Indicates if the dialog is loading. */
	loading: boolean;
	/** Selected save location */
	location: CompareProfileSaveLocations;
	/** New profile name */
	profileName?: string;
	/** Selected profile */
	profile?: IComparePrintProfileEntity;
	/** Dialog profiles */
	profiles: IComparePrintProfileEntity[];
}

/**
 * Events of handle profiles.
 */
export interface IComparePrintSaveProfileDialogEvents {
	toPropertyConfig: (item: IComparePrintProfileEntity) => IComparePrintGenericProfile | IComparePrintRfqProfile;
	delete: (item: IComparePrintProfileEntity, profiles: IComparePrintProfileEntity[]) => Promise<boolean>;
	setDefault: (location: CompareProfileSaveLocations, item: IComparePrintProfileEntity, profiles: IComparePrintProfileEntity[]) => Promise<boolean>;
	save: (location: CompareProfileSaveLocations, item: IComparePrintProfileEntity, profiles: IComparePrintProfileEntity[]) => Promise<boolean>;
}

/**
 * Context for the compare print dialog.
 */
export interface IComparePrintSaveProfileDialogContext {
	/** The profiles for the dialog. */
	profiles: IComparePrintProfileEntity[];
	/** Dialog events */
	events: IComparePrintSaveProfileDialogEvents;
}