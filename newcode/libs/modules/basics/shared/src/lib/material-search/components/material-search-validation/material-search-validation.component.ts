/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, inject} from '@angular/core';
import {
	MATERIAL_SEARCH_VALIDATIONS
} from '../../model/interfaces/material-search-validation.interface';

/**
 * Validation list view
 */
@Component({
	selector: 'basics-shared-material-search-validation',
	templateUrl: './material-search-validation.component.html',
	styleUrls: ['./material-search-validation.component.scss'],
})
export class BasicsSharedMaterialSearchValidationComponent {
	/**
	 * validation list
	 */
	public validations = inject(MATERIAL_SEARCH_VALIDATIONS);
}
