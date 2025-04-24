/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import {IRubricCategoryEntity} from '../model/entities/rubric-category-entity.interface';

export const QTO_FORMULA_RUBRIC_CATEGORY_GRID_BEHAVIOR_TOKEN = new InjectionToken<QtoFormulaRubricCategoryGridBehavior>('qtoFormulaRubricCategoryGridBehavior');

@Injectable({
	providedIn: 'root'
})
export class QtoFormulaRubricCategoryGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IRubricCategoryEntity>, IRubricCategoryEntity> {


	public onCreate(containerLink: IGridContainerLink<IRubricCategoryEntity>): void {
		this.customizeToolbar(containerLink);
	}

	private customizeToolbar(containerLink: IGridContainerLink<IRubricCategoryEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
	}
}