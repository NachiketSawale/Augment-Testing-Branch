/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	IDataServiceChildRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { DocumentDataLeafService } from '@libs/documents/shared';
import { ControllingRevenueRecognitionDataService } from '../revenue-recognition/revenue-recognition-data.service';
import { IPrrDocumentEntity } from '../model/entities/prr-document-entity.interface';
import { IPrrHeaderEntity } from '../model/entities/prr-header-entity.interface';
import { PrrHeaderComplete } from '../model/complete-class/prr-header-complete.class';

/**
 * The revenue recognition document data service
 */
@Injectable({
	providedIn: 'root',
})
export class ControllingRevenueRecognitionDocumentDataService extends DocumentDataLeafService<IPrrDocumentEntity, IPrrHeaderEntity, PrrHeaderComplete> {

	public constructor(private parentService: ControllingRevenueRecognitionDataService) {
		super({
			apiUrl: 'controlling/RevenueRecognition/document',
			roleInfo: <IDataServiceChildRoleOptions<IPrrDocumentEntity, IPrrHeaderEntity, PrrHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'PrrDocument',
				parent: parentService
			},
			readInfo: {
				endPoint: 'listbyparent',
				usePost: true
			}
		});
	}


	protected override provideLoadPayload(): object {
		const prrHeaderEntity = this.parentService.getSelectedEntity()!;
		return {
			PKey1: prrHeaderEntity.Id
		};
	}

	protected override onLoadSucceeded(loaded: IPrrDocumentEntity[]): IPrrDocumentEntity[] {
		return loaded;
	}


	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: PrrHeaderComplete, modified: IPrrDocumentEntity[], deleted: IPrrDocumentEntity[]): void {
		parentUpdate.MainItemId = this.parentService.getSelectedEntity()!.Id;
		if (modified && modified.some(() => true)) {
			parentUpdate.PrrDocumentToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.PrrDocumentToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: PrrHeaderComplete): IPrrDocumentEntity[] {
		if (complete && complete.PrrDocumentToSave) {
			return complete.PrrDocumentToSave;
		}

		return [];
	}

	public override isParentFn(parentKey: IPrrHeaderEntity, entity: IPrrDocumentEntity): boolean {
		return entity.PrrHeaderFk === parentKey.Id;
	}

}