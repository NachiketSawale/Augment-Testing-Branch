/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IEngDrawingEntityGenerated } from '../../model/drawing/eng-drawing-entity-generated.interface';

/**
 * Eng Drawing Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class ProductionplanningDrawingLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IEngDrawingEntityGenerated, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('EngDrawing', {
			uuid: '31a7fb353eda43d590f2a5b285b7cb29',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			showClearButton: true
		});
	}
}