/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, Input} from '@angular/core';
import {MaterialSearchScope} from '../../model/material-search-scope';

/**
 * Material search view
 */
@Component({
	selector: 'basics-shared-material-search-view',
	templateUrl: './material-search-view.component.html',
	styleUrls: ['./material-search-view.component.scss'],
})
export class BasicsSharedMaterialSearchViewComponent {
	/**
	 * Search scope
	 */
	@Input()
	public scope!: MaterialSearchScope;
}
