/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { ISearchResult, PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { IPrrHeaderEntity } from '../model/entities/prr-header-entity.interface';
import { PrrHeaderComplete } from '../model/complete-class/prr-header-complete.class';
import { MainDataDto } from '@libs/basics/shared';
import { UiCommonFormDialogService } from '@libs/ui/common';
import { ControllingRevenueRecognitionCreateDialogService } from './revenue-recognition-create-dialog.service';
import { ICreatePrrHeaderParam } from '../model/entities/create-prr-header-param.interface';

/**
 * Controlling Revenue Recognition data service
 */
@Injectable({
	providedIn: 'root',
})
export class ControllingRevenueRecognitionDataService extends DataServiceFlatRoot<IPrrHeaderEntity, PrrHeaderComplete> {
	private readonly http = inject(PlatformHttpService);
	public formDialogService = inject(UiCommonFormDialogService);

	public constructor() {
		const options: IDataServiceOptions<IPrrHeaderEntity> = {
			apiUrl: 'controlling/RevenueRecognition',
			readInfo: {
				endPoint: 'list',
			},
			createInfo: {
				endPoint: 'createRevenueRecognitionHeaderFromDialog',
				usePost: true,
				// todo - creation dialog
				// preparePopupDialogData:() =>{
				// 	return  this.createDialogService.openCreateDialogForm();
				// }
			},
			roleInfo: <IDataServiceRoleOptions<IPrrHeaderEntity>>{
				role: ServiceRole.Root,
				itemName: 'PrrHeader',
			},
			entityActions: {
				createDynamicDialogSupported: true,
			},
		};
		super(options);
	}

	/**
	 * Provide the load payload here
	 * @protected
	 */
	protected override provideLoadPayload(): object {
		return {};
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IPrrHeaderEntity> {

		const dto = new MainDataDto<IPrrHeaderEntity>(loaded);

		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: 0,
				RecordsRetrieved: 0,
				ResultIds: []
			},
			dtos: dto.Main
		};
	}

	/**
	 * create update entity
	 * @param modified
	 */
	public override createUpdateEntity(modified: IPrrHeaderEntity | null): PrrHeaderComplete {
		return new PrrHeaderComplete(modified);
	}

	/**
	 *when click save button  ,system give tip ,should override getModificationsFromUpdate function
	 */
	public override getModificationsFromUpdate(complete: PrrHeaderComplete): IPrrHeaderEntity[] {
		if (complete.PrrHeader === null) {
			return [];
		}
		if (complete.PrrHeader) {
			return [complete.PrrHeader];
		}
		return [];
	}

	protected override onCreateSucceeded(created: object): IPrrHeaderEntity {
		return created as IPrrHeaderEntity;
	}

	protected override isCreateByFixDialogSupported(): boolean {
		return true;
	}

	protected override async createByFixDialog(): Promise<ICreatePrrHeaderParam> {
		const defaultPrrHeaderEntity = await this.http.get<IPrrHeaderEntity>('controlling/RevenueRecognition/getdefaultvalues');
		return ServiceLocator.injector.get(ControllingRevenueRecognitionCreateDialogService).showCreateDialog(defaultPrrHeaderEntity) as unknown as ICreatePrrHeaderParam;
	}

}
