/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { IDialogAlarmConfig } from '../../model/interfaces/dialog-alarm-config.interface';

/**
 * Component renders the overlay message.
 */
@Component({
	selector: 'ui-common-alarm-overlay',
	templateUrl: './alarm-overlay.component.html',
	styleUrls: ['./alarm-overlay.component.scss'],
})
export class UiCommonAlarmOverlayComponent implements OnChanges {
	/**
	 * Overlay input data.
	 */
	@Input()
	public config: IDialogAlarmConfig | string | undefined;

	/**
	 * Overlay message.
	 */
	public message: string = '';

	/**
	 * To show/Hide overlay.
	 */
	public show: boolean = false;

	/**
	 * Class for overlay.
	 */
	public cssClass: string = '';

	/**
	 * Function detects the changes in the input property.
	 *
	 * @param {SimpleChanges} change
	 */
	public ngOnChanges(change: SimpleChanges) {
		if (change['config'] && change['config'].currentValue) {
			this.show = true;
			if (typeof change['config'].currentValue === 'string') {
				this.setTextIfInfo();
			} else {
				this.setTextIfConfig();
			}
		}
	}

	/**
	 * Function sets the text message and cssclass when input data type is IDialogAlarmConfig.
	 */
	private setTextIfConfig() {
		if (typeof this.config === 'object') {
			this.setValue(<string>this.config.info);
			this.cssClass = <string>this.config.cssClass;
		}
	}

	/**
	 * Function sets the text message when input data type is string.
	 */
	private setTextIfInfo() {
		this.setValue(<string>this.config);
	}

	/**
	 * Function sets the value in message variable.
	 *
	 * @param {string} text
	 */
	private setValue(text: string) {
		this.message = text;
		this.setValueToUndefined();
	}

	/**
	 * Function resets the value of input variable.
	 */
	private setValueToUndefined() {
		setTimeout(() => {
			this.show = false;
			this.config = undefined;
		}, 2000);
	}
}
