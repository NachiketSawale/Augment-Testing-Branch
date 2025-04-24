/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, Input} from '@angular/core';
import {Translatable} from '@libs/platform/common';

/**
 * Collapsable panel
 */
@Component({
	selector: 'basics-shared-material-search-collapse',
	templateUrl: './material-search-collapse.component.html',
	styleUrls: ['./material-search-collapse.component.scss'],
})
export class BasicsSharedMaterialSearchCollapseComponent {
	/**
	 * title
	 */
	@Input()
	public title: Translatable = 'Title';
	/**
	 * Is collapsed
	 */
	@Input()
	public collapsed: boolean = false;
}
