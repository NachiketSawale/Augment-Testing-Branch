/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';

import { IRfqSendHistoryEntity } from '../model/entities/rfq-send-history-entity.interface';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { RfqHeaderEntityComplete } from '../model/entities/rfq-header-entity-complete.class';
import { ProcurementRfqHeaderMainDataService } from '../services/procurement-rfq-header-main-data.service';
import { BasicsShareFileDownloadService } from '@libs/basics/shared';
import { PlatformPermissionService } from '@libs/platform/common';
import * as _ from 'lodash';
export const PROCUREMENT_RFQ_SEND_HISTORY_DATA_TOKEN = new InjectionToken<ProcurementRfqSendHistoryDataService>('procurementRfqSendHistoryDataToken');

/**
 * Procurement Send History entity data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementRfqSendHistoryDataService extends DataServiceFlatLeaf<IRfqSendHistoryEntity, IRfqHeaderEntity, RfqHeaderEntityComplete> {

	protected readonly downLoadService = inject(BasicsShareFileDownloadService);
	private readonly permissionService = inject(PlatformPermissionService);
	public constructor(private readonly procurementRfqHeaderMainDataService: ProcurementRfqHeaderMainDataService) {
		super({
			apiUrl: 'procurement/rfq/sendhistory',
			roleInfo: <IDataServiceChildRoleOptions<IRfqSendHistoryEntity, IRfqHeaderEntity, RfqHeaderEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'RfqSendHistory',
				parent: procurementRfqHeaderMainDataService
			},
			readInfo: {
				endPoint: 'list',
				usePost: false
			}
		});

	}

	protected override provideLoadPayload(): object {
		const rfqHeader = this.getSelectedParent();
		if (rfqHeader){
			return {
				rfqId: rfqHeader.Id
			};
		} else {
			throw new Error('There should be a selected parent RfQ Header to load the send history to customer data');
		}
	}

	protected override provideCreatePayload(): object {
		const catalog = this.getSelectedParent();
		if (catalog){
			return {
				mainItemId: catalog.Id
			};
		} else {
			throw new Error('There should be a selected parent price version to create the price version to customer data');
		}
	}

	public override registerByMethod(): boolean {
		return true;
	}
	public override registerModificationsToParentUpdate(parentUpdate: RfqHeaderEntityComplete, modified: IRfqSendHistoryEntity[], deleted: IRfqSendHistoryEntity[]): void {
		if (modified && modified.length > 0) {
			parentUpdate.RfqSendHistoryToSave = modified;
		}
	}
	public override getSavedEntitiesFromUpdate(complete: RfqHeaderEntityComplete): IRfqSendHistoryEntity[] {

		return [];
	}

	public downloadFiles() {
		const selectedDocumentDtos = this.getList();
		if (selectedDocumentDtos.length >= 2) {
			const docIdArray = _.map(selectedDocumentDtos, function (item) {
				if (item.FileArchiveDocFk != undefined){
					return item.FileArchiveDocFk;
				} else {
					return 0;
				}
			});
			this.downLoadService.download(docIdArray);
		} else {
			let fileArchiveDocFk = 0;
			if (selectedDocumentDtos[0].FileArchiveDocFk != undefined){
				fileArchiveDocFk = selectedDocumentDtos[0].FileArchiveDocFk;
			}
			this.downLoadService.download([fileArchiveDocFk]);
		}
	}

	public canDownloadFiles() {
		const currentItem = this.getSelection()[0];
		if (currentItem) {
			return (!!currentItem.OriginFileName && 1000 !== currentItem.DocumentTypeFk) && this.permissionService.hasRead('4eaa47c530984b87853c6f2e4e4fc67e');
		}
		return false;
	}
}
