/*
 * Copyright(c) RIB Software GmbH
 */
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	ServiceRole,
	ValidationInfo
} from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { CosMasterComplete } from '../model/entities/cos-master-complete.class';
import { ConstructionSystemMasterHeaderDataService } from './construction-system-master-header-data.service';
import { ICosWicEntity } from '../model/entities/cos-wic-entity.interface';
import { ICosHeaderEntity } from '@libs/constructionsystem/shared';
import { ICosBoqWicCatBoqFkEntity } from '../model/entities/cos-boq-wic-cat-boq-fk-entity.interface';
import { ICosWicBoqItemEntity } from '../model/entities/cos-wic-boq-item-entity.interface';
import { PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemMasterWicCatLookupService } from './lookup/construction-system-master-wiccat-lookup.service';
import {
	ConstructionSystemMasterWicValidationService
} from './validations/construction-system-master-wic-validation.service';

interface ICosMasterWicResponse {
	BoqItemFk: ICosWicBoqItemEntity[];
	BoqWicCatBoqFk: ICosBoqWicCatBoqFkEntity[];
	dtos: ICosWicEntity[];
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterWicDataService extends DataServiceFlatLeaf<ICosWicEntity, ICosHeaderEntity, CosMasterComplete> {
	private readonly http = inject(PlatformHttpService);

	public constructor(private cosMasterHeaderDataService: ConstructionSystemMasterHeaderDataService) {
		const options: IDataServiceOptions<ICosWicEntity> = {
			apiUrl: 'constructionsystem/master/Wic',
			roleInfo: <IDataServiceChildRoleOptions<ICosWicEntity, ICosHeaderEntity, CosMasterComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CosWic',
				parent: cosMasterHeaderDataService,
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: (ident) => {
					return {
						mainItemId: ident.pKey1,
					};
				},
			},
		};

		super(options);
	}

	public override isParentFn(parentKey: ICosHeaderEntity, entity: ICosWicEntity): boolean {
		return entity.CosHeaderFk === parentKey.Id;
	}

	protected override provideLoadPayload() {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id,
			};
		}
		throw new Error('There should be a selected master header record to load the wic value data');
	}

	public override onCreateSucceeded(created:ICosWicEntity): ICosWicEntity {
		const validation = ServiceLocator.injector.get(ConstructionSystemMasterWicValidationService);
		const result = validation.validateCode(new ValidationInfo<ICosWicEntity>(created, created.Code ?? undefined, 'Code'));
		if (!result.valid) {
			this.addInvalid(created, { result: result, field: 'Code' });
		} else {
			this.removeInvalid(created, { result: result, field: 'Code' });
		}
		return created;
	}

	protected override onLoadSucceeded(loaded: ICosMasterWicResponse): ICosWicEntity[] {
		if (loaded.BoqWicCatBoqFk && loaded.BoqWicCatBoqFk.length > 0) {
			const wicCatLookupService = ServiceLocator.injector.get(ConstructionSystemMasterWicCatLookupService);
			wicCatLookupService.cache.setList(loaded.BoqWicCatBoqFk);
		}

		return loaded.dtos as ICosWicEntity[];
	}

	public getBoqWicCatBoqFk(boqItem: ICosWicBoqItemEntity) {
		const wicAssignment = this.getSelectedEntity();
		if (wicAssignment && boqItem) {
			wicAssignment.BoqHeaderFk = boqItem.BoqHeaderFk;
			this.http
				.get<ICosBoqWicCatBoqFkEntity[]>('constructionsystem/master/wic/getboqwiccatfk', {
					params: {
						boqHeaderId: boqItem.BoqHeaderFk,
					},
				})
				.then((res) => {
					// update lookup Data
					const wicCatLookupService = ServiceLocator.injector.get(ConstructionSystemMasterWicCatLookupService);
					wicCatLookupService.cache.setList(res);
					wicAssignment.BoqWicCatBoqFk = res.length > 0 ? res[0].Id : null;
					this.entitiesUpdated(wicAssignment);
				});
		}
	}
}
