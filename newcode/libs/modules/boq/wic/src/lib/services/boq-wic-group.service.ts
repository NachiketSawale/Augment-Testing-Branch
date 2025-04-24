/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { CollectionHelper } from '@libs/platform/common';
import { BaseValidationService, DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, IEntityRuntimeDataRegistry, IValidationFunctions, ServiceRole, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IWicGroupEntity } from '../model/entities/wic-group-entity.interface';
import { WicGroupComplete } from '../model/wic-group-complete.class';

@Injectable({providedIn: 'root'})
export class WicGroupDataService extends DataServiceHierarchicalRoot<IWicGroupEntity, WicGroupComplete> {
	protected selectedWicBoqId: number;

	public constructor() {
		const options: IDataServiceOptions<IWicGroupEntity> = {
			apiUrl: 'boq/wic/group',
			roleInfo: <IDataServiceRoleOptions<IWicGroupEntity>>{
				role: ServiceRole.Root,
				itemName: 'WicGroups'
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree?asMap=true',
				usePost: false
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			}
		};
		super(options);

		this.selectedWicBoqId = -1;

		this.processor.addProcessor({
			process: (wicGroup) => {
				// TODO-BOQ: This enables the wic groups to be presented in the tree grid. To be checked again the performance and if that can be implemented in the backend.
				const parent = this.flatList().find(wg => wg.Id===wicGroup.WicGroupFk);
				wicGroup.WicGroupParent = parent === undefined ? null : parent;
				if (wicGroup.WicGroups === null) {
					wicGroup.WicGroups = [];
				}
			},
			revertProcess() {
			}
		});
	}

	protected override onCreateSucceeded?(created: object): IWicGroupEntity {
		return (<any>created).WicGroup;
	}

	// TODO-BOQ - To be inplemented when 2 create buttons are available
	protected override provideCreatePayload(): object {
		const wicGroup = this.getSelectedEntity();
		if(wicGroup){
			return {
				ParentId: wicGroup.Id,
			};
		}

		return {};
	}
	/*protected override provideCreatePayload?(): object {
		return new IWicGroupEntity;
	}*/

	public override createUpdateEntity(modified: IWicGroupEntity | null): WicGroupComplete {
		const completeWicGroup = new WicGroupComplete();
		if (modified !== null) {
			completeWicGroup.WicGroups = [modified];
		}

		return completeWicGroup;
	}

	public override getModificationsFromUpdate(complete: WicGroupComplete): IWicGroupEntity[] {
		if (complete.WicGroups === null) {
			complete.WicGroups = [];
		}

		return complete.WicGroups;
	}

	public override childrenOf(wicGroup: IWicGroupEntity): IWicGroupEntity[] {
		return wicGroup.WicGroups ?? [];
	}

	public override parentOf(wicGroup: IWicGroupEntity): IWicGroupEntity | null {
		return wicGroup.WicGroupParent ?? null;
	}

	public setSelectedWicBoqId(wicBoqId: number) {
		this.selectedWicBoqId = wicBoqId;
	}

	public getSelectedWicBoqId() : number {
		return this.selectedWicBoqId ;
	}

	public clearSelectedWicBoqId() {
		this.selectedWicBoqId  = -1;
	}
}

// TODO-FWK-DEV-6943: A red marker does not appear in the grid cell
@Injectable({providedIn: 'root'})
export class WicGroupValidationService extends BaseValidationService<IWicGroupEntity> {
	private wicGroupDataService = inject(WicGroupDataService);

	protected generateValidationFunctions(): IValidationFunctions<IWicGroupEntity> {
		return { Code: this.validateCode };
	}

	private validateCode(info: ValidationInfo<IWicGroupEntity>): ValidationResult {
		let result = this.validateIsMandatory(info);
		if (result.valid) {
			result = this.validateIsUnique(info);
		}

		return result;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IWicGroupEntity> {
		return this.wicGroupDataService;
	}

	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<IWicGroupEntity>): IWicGroupEntity[] => {
		const wicGroups = CollectionHelper.Flatten(this.wicGroupDataService.getList(), (wicGroup) => {
			return wicGroup.WicGroups || [];
		});

		return wicGroups.filter(wicGroup => {
			return (wicGroup as never)[info.field]===info.value && wicGroup.Id!==info.entity.Id // TODO-FWK-DEV-6943: Always the same. Basics code?
						&& wicGroup.WicGroupFk===info.entity.WicGroupFk;
		});
	};
}
