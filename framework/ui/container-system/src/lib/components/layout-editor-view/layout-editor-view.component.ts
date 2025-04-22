/*
 * Copyright(c) RIB Software GmbH
 */

//import {sumBy} from 'lodash';
import {Component, Input, OnInit} from '@angular/core';
import {Orientation} from '@libs/platform/common';
import {ILayoutSplitter, IPaneDefinition} from '../../model/container-pane.model';
import {UiContainerSystemLayoutEditorContext} from '../../model/layout-editor-context';

/**
 * The layout editor view
 */
@Component({
	selector: 'ui-container-system-layout-editor-view',
	templateUrl: './layout-editor-view.component.html',
	styleUrls: ['./layout-editor-view.component.scss'],
})
export class UiContainerSystemLayoutEditorViewComponent implements OnInit {
	protected readonly Orientation = Orientation;

	/**
	 * The data model
	 */
	@Input()
	public data!: ILayoutSplitter;

	/**
	 * Layout editor context.
	 */
	@Input()
	public context!: UiContainerSystemLayoutEditorContext;

	/**
	 *
	 */
	public ngOnInit() {

	}

	/**
	 * Pane tracker.
	 * @param index
	 * @param pane
	 */
	public trackByPane(index: number, pane: IPaneDefinition) {
		return pane.name;
	}
}
