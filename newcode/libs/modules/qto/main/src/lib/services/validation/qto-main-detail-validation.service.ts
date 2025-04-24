/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { QtoMainDetailGridDataService } from '../qto-main-detail-grid-data.service';
import { IQtoMainDetailGridEntity } from '../../model/qto-main-detail-grid-entity.class';

import { QtoMainDetailGridComplete } from '../../model/qto-main-detail-grid-complete.class';
import { IQtoMainHeaderGridEntity } from '../../model/qto-main-header-grid-entity.class';
import { QtoMainHeaderGridComplete } from '../../model/qto-main-header-grid-complete.class';
import {QtoShareDetailValidationService} from '@libs/qto/shared';

@Injectable({
	providedIn: 'root'
})

export class QtoMainDetailValidationService extends QtoShareDetailValidationService<IQtoMainDetailGridEntity, QtoMainDetailGridComplete, IQtoMainHeaderGridEntity, QtoMainHeaderGridComplete> {

	private qtoMainDetailDataService: QtoMainDetailGridDataService = inject(QtoMainDetailGridDataService);

	public constructor() {
		const dataService = inject(QtoMainDetailGridDataService);
		super(dataService);
	}
}