/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ViewContainerRef } from '@angular/core';
import { IDropDownButtonList } from '../../components/dropdown-button/model/interfaces/dropdown-button.model';

export interface IUiLangOption {
	selectedId: {
		languageName: string;
	};
}

export interface IMenulist {
	dropDownList: IDropDownButtonList;
	isOpen: boolean;
	container: ViewContainerRef;
	// TODO: provide concrete type
	//template: TemplateRef<any>;
	existingLanguage: number | string;
	existingCulture: string;
	uiLangOptions: IUiLangOption;
	enableBootstrapTitle: string;
	classList: string;
	showModal(id: string): void;
}
