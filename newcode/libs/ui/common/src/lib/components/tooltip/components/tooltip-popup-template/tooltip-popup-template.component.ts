/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { ITooltip } from '../../model/interfaces/tooltip-popup-template.interface';
@Component({
	selector: 'ui-common-tooltip-popup-template',
	templateUrl: './tooltip-popup-template.component.html',
	styleUrls: ['./tooltip-popup-template.component.scss'],
})
export class UiCommonTooltipPopupTemplateComponent {
	/**
	 * For tooltip data
	 */
	public fields!: ITooltip[];
}
