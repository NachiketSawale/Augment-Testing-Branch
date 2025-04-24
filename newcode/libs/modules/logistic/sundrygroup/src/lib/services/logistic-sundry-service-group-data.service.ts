/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceHierarchicalRoot, EntityArrayProcessor, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { ILogisticSundryServiceGroupEntity, ILogisticSundryServiceGroupComplete } from '@libs/logistic/interfaces';

@Injectable({
	providedIn: 'root',
})
export class LogisticSundryServiceGroupDataService extends DataServiceHierarchicalRoot<ILogisticSundryServiceGroupEntity, ILogisticSundryServiceGroupComplete> {
	public constructor() {
		const options: IDataServiceOptions<ILogisticSundryServiceGroupEntity> = {
			apiUrl: 'logistic/sundrygroup',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<ILogisticSundryServiceGroupEntity>>{
				role: ServiceRole.Root,
				itemName: 'SundryServiceGroups',
			},
			entityActions: {createSupported: true, deleteSupported: true},
			processors: [new EntityArrayProcessor<ILogisticSundryServiceGroupEntity>(['SundryServiceGroups'])]
		};

		super(options);
	}

	protected override provideCreatePayload(): object {
		const selected = this.getSelectedEntity();
		if (selected === null) {
			return {};
		}

		const parent = this.parentOf(selected);
		if (parent) {
			return {
				PKey1: parent.Id
			};
		}else{
			return {};
		}
	}


	protected override provideCreateChildPayload(): object {
		return {
			PKey1: this.getSelectedEntity()?.Id,
		};
	}

	protected override onCreateSucceeded(created: object): ILogisticSundryServiceGroupEntity {
		return created as ILogisticSundryServiceGroupEntity;
	}

	public override createUpdateEntity(modified: ILogisticSundryServiceGroupEntity | null): ILogisticSundryServiceGroupComplete {
		return {
			SundryServiceGroups : modified ? [modified] : null
		} as ILogisticSundryServiceGroupComplete;
	}

	public override getModificationsFromUpdate(complete: ILogisticSundryServiceGroupComplete): ILogisticSundryServiceGroupEntity[] {
		if (complete.SundryServiceGroups === null) {
			complete.SundryServiceGroups = [];
		}

		return complete.SundryServiceGroups;
	}

	protected override checkCreateIsAllowed(entities: ILogisticSundryServiceGroupEntity[] | ILogisticSundryServiceGroupEntity | null): boolean {
		return true;
	}

	public override childrenOf(element: ILogisticSundryServiceGroupEntity): ILogisticSundryServiceGroupEntity[] {
		return element.SundryServiceGroups ?? [];
	}

	public override parentOf(element: ILogisticSundryServiceGroupEntity): ILogisticSundryServiceGroupEntity | null {
		if(element.SundryServiceGroupFk === undefined) {
			return null;
		}

		const parentId = element.SundryServiceGroupFk;
		const foundParent =  this.flatList().find(candidate => candidate.Id === parentId);

		if(foundParent === undefined) {
			return null;
		}

		return foundParent;
	}
}
