/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, IEntityProcessor } from '@libs/platform/data-access';
import { ModelChangeSetComplete } from '../model/model-change-set-complete.class';
import { IChangeSetEntity, IChangeSetStatusEntity } from '../model/models';
import { isNil } from 'lodash';

@Injectable({
	providedIn: 'root'
})

export class ModelChangeSetDataService extends DataServiceFlatRoot<IChangeSetEntity, ModelChangeSetComplete> {

	public constructor() {
		const options: IDataServiceOptions<IChangeSetEntity> = {
			apiUrl: 'model/changeset',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IChangeSetEntity>>{
				role: ServiceRole.Root,
				itemName: 'Changeset',
			},
			entityActions: {
				createSupported: false,
				deleteSupported: true
			}
		};

		super(options);
	}

	private state: IChangeSetStatusEntity = {
		unfinishedComparisons: [],
		activeConsumerCount: 0,
		updateRequest: null,
		waitingRequests: []
	};

	protected override provideAllProcessor(options: IDataServiceOptions<IChangeSetEntity>): IEntityProcessor<IChangeSetEntity>[] {
		return [
			...super.provideAllProcessor(options),
			{
				process: (toProcess: IChangeSetEntity) => {
					this.doProcessItem(toProcess);
				},
				revertProcess: (toProcess: IChangeSetEntity) => {
					//this.removeTransientValues(toProcess);
				}
			}
		];
	}

	public doProcessItem(changeSetItem: IChangeSetEntity) {
		changeSetItem.CompoundId = changeSetItem.ModelFk + '/' + changeSetItem.Id;
		//changeSetItem.selModelRole = (changeSetItem.ModelFk === modelViewerModelSelectionService.getSelectedModelId() ? 'm' : 'c');

		const isFinished = !isNil(changeSetItem.ChangeSetStatusFk) && (changeSetItem.ChangeSetStatusFk >= 3);
		if (!isFinished) {
			this.state.unfinishedComparisons.push({
				modelId: changeSetItem.ModelFk,
				id: changeSetItem.Id
			});
		}

		//const canShowLog = isFinished && isInteger(changeSetItem.LogFileArchiveDocFk);//TODO
	}

	public addChangeSet(changeset: IChangeSetEntity) {
		// TODO: modelViewerModelSelectionService not ready
	}
	public override createUpdateEntity(modified: IChangeSetEntity | null): ModelChangeSetComplete {
		const complete = new ModelChangeSetComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.Datas = [modified];
		}

		return complete;
	}

}







