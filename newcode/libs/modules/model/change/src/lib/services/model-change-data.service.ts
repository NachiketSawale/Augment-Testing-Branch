/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, IEntityProcessor } from '@libs/platform/data-access';

import { ModelChangeComplete } from '../model/model-change-complete.class';
import { IChangeEntity } from '../model/models';
import { isInteger } from 'lodash';

@Injectable({
	providedIn: 'root'
})

export class ModelChangeDataService extends DataServiceFlatRoot<IChangeEntity, ModelChangeComplete> {
 
	public constructor() {
		const options: IDataServiceOptions<IChangeEntity> = {
			apiUrl: 'model/change',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IChangeEntity>>{
				role: ServiceRole.Root,
				itemName: 'Change',
			},
			entityActions: {
				createSupported: false,
				deleteSupported: true
			}
		};

		super(options);
		setTimeout(() => {
			if (this.state.isChangeSetDetermined()) {
				//this.service.load(); //TODO
			}
			this.isInitialized = true;
		});
	}

	public override createUpdateEntity(modified: IChangeEntity | null): ModelChangeComplete {
		const complete = new ModelChangeComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.Datas = [modified];
		}

		return complete;
	}

	protected override provideAllProcessor(options: IDataServiceOptions<IChangeEntity>): IEntityProcessor<IChangeEntity>[] {
		return [
			...super.provideAllProcessor(options),
			{
				process: (toProcess: IChangeEntity) => {
					this.doProcessItem(toProcess);
				},
				revertProcess: (toProcess: IChangeEntity) => {
					//this.removeTransientValues(toProcess);
				}
			}
		];
	}

	private state = {
		modelId: 0,
		changeSetId: 0,
		isChangeSetDetermined: () => isInteger(this.state.modelId) && isInteger(this.state.changeSetId)
	};

	private isInitialized = false;

	public doProcessItem(change: IChangeEntity) {
		change.CompoundId = change.ModelFk + '/' + change.ChangeSetFk + '/' + change.Id;
		change.Value = '';
		change.ValueCmp = '';
	}

	public selectAfterNavigation(changeSet: IChangeEntity) {
		this.state.modelId = changeSet.ModelFk;
		this.state.changeSetId = changeSet.Id;
		if (this.isInitialized) {
			//service.load(); //TODO Need to check how service.load();
		}
	}

	public getChangeSetId() {
		return this.state.isChangeSetDetermined() ? {
			modelId: this.state.modelId,
			changeSetId: this.state.changeSetId
		} : null;
	}
}







