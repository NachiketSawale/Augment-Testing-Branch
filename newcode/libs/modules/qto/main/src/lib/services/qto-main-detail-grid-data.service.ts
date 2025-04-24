/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IQtoMainDetailGridEntity } from '../model/qto-main-detail-grid-entity.class';
import { QtoMainDetailGridComplete } from '../model/qto-main-detail-grid-complete.class';
import { QtoMainHeaderGridComplete } from '../model/qto-main-header-grid-complete.class';
import { QtoMainHeaderGridDataService } from '../header/qto-main-header-grid-data.service';
import { IQtoMainHeaderGridEntity } from '../model/qto-main-header-grid-entity.class';
import { IQtoShareHeaderEntity, QtoShareDetailDataService } from '@libs/qto/shared';
import {QtoDetailReadonlyProcessor} from './processors/qto-detail-readonly-processor.service';
import {BlobsEntity} from '@libs/basics/shared';


@Injectable({
	providedIn: 'root'
})

export class QtoMainDetailGridDataService extends QtoShareDetailDataService<IQtoMainDetailGridEntity, QtoMainDetailGridComplete,
	IQtoMainHeaderGridEntity, QtoMainHeaderGridComplete> {

	private  readonly qtoHeaderService: QtoMainHeaderGridDataService;

	public constructor() {
		const qtoHeaderService = inject(QtoMainHeaderGridDataService);
		super(qtoHeaderService, {});

		// parent service
		this.qtoHeaderService = qtoHeaderService;

		// set as child servie for qto header service
		this.qtoHeaderService.childDetailService = this;
	}

	protected override createReadonlyProcessor() {
		return new QtoDetailReadonlyProcessor(this);
	}

	// region initReadData

	/**
	 * Get qto selected Header
	 * @protected
	 */
	protected override getQtoHeaderSelected(): IQtoShareHeaderEntity | undefined {
		if (this.qtoHeaderService) {
			const qtoHeader = this.qtoHeaderService.getSelectedEntity();
			if (qtoHeader) {
				return qtoHeader;
			}
		}

		return undefined;
	}

	/**
	 * Get MainItemId
	 * @protected
	 */
	protected override getMainItemId(): number {
		const qtoHeader = this.qtoHeaderService.getSelectedEntity();
		if (qtoHeader){
			return qtoHeader.Id;
		}

		return -1;
	}
	/**
	 * selected change, set the blobs
	 */
	public override setBlobsToQtoMainDetailItem(){
		const itemSelected = this.getSelectedEntity();
		if (itemSelected && itemSelected.BasBlobsFk && !itemSelected.Blob){
			this.http.get(this.configurationService.webApiBaseUrl + 'cloud/common/blob/getblobbyid?id=' + itemSelected.BasBlobsFk).subscribe((response) => {
				const blob = response as BlobsEntity;
				if (blob) {
					itemSelected.Blob = blob;
				}
			});
		}
	}
	// endregion

}
