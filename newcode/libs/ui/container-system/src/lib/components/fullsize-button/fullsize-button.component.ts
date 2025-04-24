/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { ModuleLayoutService } from '../../services/module-layout.service';

import { ILayoutSplitter } from '../../model/container-pane.model';

/**
 * Implements a full-size button functionality and toggles fullscreen mode.
 */
@Component({
	selector: 'ui-container-system-fullsize-button',
	templateUrl: './fullsize-button.component.html',
	styleUrl: './fullsize-button.component.scss',
})
export class UiContainerSystemFullsizeButtonComponent {
	/**
	 * Event emitter for container resize
	 */
	@Output() public containerResized = new EventEmitter<string>();

	/**
	 * Used to inject layout service.
	 */
	public readonly layoutService = inject(ModuleLayoutService);

	/**
	 * Used to get updated panel data on edit view.
	 * @param {ILayoutSplitter} value Layout splitter data
	 */
	@Input() public set paneData(value: ILayoutSplitter) {
		if (value.panes && value.panes?.length > 1) {
			this.layoutService.isContainerFullSize = false;
		}
	}

	/**
	 * Toggles fullscreen mode and updates container size accordingly.
	 * @method toggleFullScreen
	 */
	public toggleFullScreen(): void {
		this.layoutService.updateContainerSize();
		this.containerResized.emit();
	}
}
