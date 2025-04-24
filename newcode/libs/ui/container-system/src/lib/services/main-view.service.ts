/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IEditorPanels } from '../components/container-layouts/interfaces/container-layout.interface';
import { ISplitterLayout } from '../components/container-layouts/interfaces/container-layout.interface';

import { ContainerDefinition } from '../model/container-definition.class';

/**
 * Service is used to provide layout views.
 */

@Injectable({
	providedIn: 'root',
})
export class UiContainerSystemMainViewService {
	public layoutId = new BehaviorSubject<string>('layout1');
	public editorlayoutId = new BehaviorSubject<string>('layout1');
	public layoutchange = new BehaviorSubject<string>('null');
	public containers = new BehaviorSubject<Array<ContainerDefinition>>([]);
	public layoutInfo: ISplitterLayout[] = [];
	public panelInfo: IEditorPanels[] = [
		{
			panel: [{
				content: ['f01193df20e34b8d917250ad17a433f1', 'c2dd899746024732aa0fc583526f04eb'],
				pane: 'pane-l'
			}],
		},
		{
			panel: [{
				content: ['8b10861ea9564d60ba1a86be7e7da568', '6122eee3bf1a41ce994e0f1e5c165850', 'dde598002bbf4a2d96c82dc927e3e578'],
				pane: 'pane-r'
			}],
		}
	];


	/**
	 * To get panel information
	 * @returns {IEditorPanels[]} panelInfo The Editor Panel
	 */
	public getPaneData(): IEditorPanels[] {
		return this.panelInfo;
	}

	/**
	 * To set panel information
	 * @param {IEditorPanels[]} data The Editor Panel
	 */
	public setPaneData(data: IEditorPanels[]) {
		this.panelInfo = data;
	}

}
