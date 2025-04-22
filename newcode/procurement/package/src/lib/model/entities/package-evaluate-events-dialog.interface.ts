/*
 * Copyright(c) RIB Software GmbH
 */
import { InjectionToken } from '@angular/core';

export interface ICompletePackageEvaluateEventsDialogOption extends IPackageEvaluateEventsDialogOption {
	BodyText: string;
	selectCurrentItem: string;
	selectAllItems: string;
	RadioSelect: string;
}

export interface IPackageEvaluateEventsDialogOption {
	PackageFk?: number;
	StructureFk?: number;
	ProjectFk?: number;
}

export const PACKAGE_EVALUATE_EVENTS_DIALOG_OPTION = new InjectionToken<IPackageEvaluateEventsDialogOption>('PACKAGE_EVALUATE_EVENTS_DIALOG_OPTION');
