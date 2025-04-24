/*
 * Copyright(c) RIB Software GmbH
 */
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';

import { Injectable } from '@angular/core';
import { IMaterialNewEntity, IPpsSummarizedMatEntity, PpsMaterialComplete } from '../../model/models';
import { PpsMaterialRecordDataService } from '../material/material-record-data.service';
import { isNull } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class PpsMaterialSummarizedDataService extends DataServiceFlatLeaf<IPpsSummarizedMatEntity, IMaterialNewEntity, PpsMaterialComplete> {

	private parentService: PpsMaterialRecordDataService;

	public constructor(parentService: PpsMaterialRecordDataService) {
		const options: IDataServiceOptions<IPpsSummarizedMatEntity> = {
			apiUrl: 'productionplanning/ppsmaterial/summarizedmaterial',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByPpsMaterial',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsSummarizedMatEntity, IMaterialNewEntity, PpsMaterialComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'SummarizedMaterial',
				parent: parentService
			}
		};

		super(options);
		this.parentService = parentService;
	}

	protected override provideCreatePayload(): object {
		return {
			Id: this.getSelectedParent()?.PpsMaterial?.Id
		};
	}

	protected override onCreateSucceeded(created: IPpsSummarizedMatEntity): IPpsSummarizedMatEntity {
		return created;
	}

	protected override provideLoadPayload(): object {
		return {
			ppsmaterialId: this.getSelectedParent()?.PpsMaterial?.Id
		};
	}

	protected override onLoadSucceeded(loaded: object): IPpsSummarizedMatEntity[] {
		return loaded as IPpsSummarizedMatEntity[];
	}

	public override isParentFn(parentKey: IMaterialNewEntity, entity: IPpsSummarizedMatEntity): boolean {
		return entity.MaterialTargetFk === parentKey?.PpsMaterial?.Id;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: PpsMaterialComplete, modified: IPpsSummarizedMatEntity[], deleted: IPpsSummarizedMatEntity[]): void {
		if (modified && modified.length > 0) {
			parentUpdate.SummarizedMaterialToSave = modified;
		}

		if (deleted && deleted.length > 0) {
			parentUpdate.SummarizedMaterialToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: PpsMaterialComplete): IPpsSummarizedMatEntity[] {
		if (parentUpdate && !isNull(parentUpdate.SummarizedMaterialToSave)) {
			return parentUpdate.SummarizedMaterialToSave!;
		}
		return [];
	}
}