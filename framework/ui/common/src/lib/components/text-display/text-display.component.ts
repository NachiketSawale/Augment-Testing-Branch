/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Component, Input } from '@angular/core';
import { TextDisplayType } from '../../model/text-display/enums/text-display-type.enum';

@Component({
	selector: 'ui-common-text-display',
	templateUrl: './text-display.component.html',
	styleUrl: './text-display.component.scss',
})
export class TextDisplayComponent {
	/**
	 * Enum for display type.
	 */
	public DisplayType = TextDisplayType;

	/**
	 * Display type.
	 */
	@Input() public type!: TextDisplayType;

	/**
	 * Data to be displayed.
	 */
	@Input() public text!: string;
}
