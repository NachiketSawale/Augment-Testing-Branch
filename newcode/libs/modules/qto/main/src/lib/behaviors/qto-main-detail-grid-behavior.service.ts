/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { QtoMainDetailGridDataService } from '../services/qto-main-detail-grid-data.service';
import { IQtoMainDetailGridEntity } from '../model/qto-main-detail-grid-entity.class';
import { QtoShareDetailBehavior } from '@libs/qto/shared';
import { QtoMainDetailGridComplete } from '../model/qto-main-detail-grid-complete.class';
import { IQtoMainHeaderGridEntity } from '../model/qto-main-header-grid-entity.class';
import { QtoMainHeaderGridComplete } from '../model/qto-main-header-grid-complete.class';
import {IGridContainerLink} from '@libs/ui/business-base';

@Injectable({
	providedIn: 'root'
})

/**
 * qto detail behavior
 */
export class QtoMainDetailGridBehavior extends QtoShareDetailBehavior<IQtoMainDetailGridEntity, QtoMainDetailGridComplete,
	IQtoMainHeaderGridEntity, QtoMainHeaderGridComplete> {

	/**
	 * The constructor
	 */
	public constructor() {
		super(inject(QtoMainDetailGridDataService));
	}
	public override onCreate(containerLink: IGridContainerLink<IQtoMainDetailGridEntity>): void {

		const qtoMainDetailChanged = this.dataService.selectionChanged$.subscribe(() => {
			this.dataService.setBlobsToQtoMainDetailItem();
		});

		containerLink.registerSubscription(qtoMainDetailChanged);

	}
}