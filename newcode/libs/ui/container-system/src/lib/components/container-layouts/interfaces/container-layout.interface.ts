/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface ISplitterLayouts {
	groups: IContainerGroupLayout[];
	splitterDef: ISplitterLayout[];
	layoutId: string;
}

export interface IContainerGroupLayout {
	content: string[];
	pane: string;
}


export interface IEditorPanels {
	panel: IContainerGroupLayout[];
}

export interface ISplitterLayout {
	selectorName: string;
	panes: ISplitterPaneLayout[];
	orientation?: string;
	layoutId?: string;
}

export interface ISplitterPaneLayout {
	collapsed: boolean;
	size: string;
	selectorName?: string;
	orientation?: string;
	panes?: ISplitterPaneLayout[];
}


