/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	DataServiceFlatRoot,
	ServiceRole,
	IRootDataProvider,
	IDataServiceOptions,
	IDataProvider,
	HttpRootDataProvider
} from '@libs/platform/data-access';
import { IModelAdministrationRootEntity } from '../model/entities/model-administration-root-entity.interface';
import { IModelAdministrationCompleteEntity } from '../model/entities/model-administration-complete-entity.interface';
import {lastValueFrom} from 'rxjs';
import {
	IIdentificationData,
	ISearchPayload,
	ISearchResult,
	PlatformConfigurationService,
	ServiceLocator
} from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';

class ModelAdministrationRootDataProvider extends HttpRootDataProvider<IModelAdministrationRootEntity, IModelAdministrationCompleteEntity> {

	public constructor(
		options: IDataServiceOptions<IModelAdministrationRootEntity>,
		private readonly owner: ModelAdministrationRootDataService
	) {
		super(options);
	}

	public override create(identificationData: IIdentificationData | null): Promise<IModelAdministrationRootEntity> {
		throw new Error('Creation is not supported in this implementation.');
	}

	public override async load(identificationData: IIdentificationData | null): Promise<IModelAdministrationRootEntity[]> {
		return [this.owner.rootItem];
	}

	public override async filter(payload: ISearchPayload): Promise<ISearchResult<IModelAdministrationRootEntity>> {
		const searchResult: ISearchResult<IModelAdministrationRootEntity> = {
			FilterResult: {
				RecordsFound: 1,
				RecordsRetrieved: 1,
				ResultIds: [this.owner.rootItem.Id],
				ExecutionInfo: ''
			},
			dtos: [this.owner.rootItem]
		};

		return searchResult;
	}
}

@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationRootDataService
	extends DataServiceFlatRoot<IModelAdministrationRootEntity, IModelAdministrationCompleteEntity> {

	public constructor() {
		const rootItem: IModelAdministrationRootEntity = {
			Id: 1,
			Version: 1
		};

		const dsOptions: IDataServiceOptions<IModelAdministrationRootEntity> = {
			apiUrl: 'model/administration',
			roleInfo: {
				itemName: 'Dummy',
				role: ServiceRole.Root
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false
			},
			// TODO: remove when the custom provider class is actually used
			provider: <IRootDataProvider<IModelAdministrationRootEntity, IModelAdministrationCompleteEntity>>{
				create(identificationData: IIdentificationData | null): Promise<IModelAdministrationRootEntity> {
					throw new Error('Creation is not supported in this implementation.');
				},
				async load(identificationData: IIdentificationData | null): Promise<IModelAdministrationRootEntity[]> {
					return [rootItem];
				},
				async filter(payload: ISearchPayload): Promise<ISearchResult<IModelAdministrationRootEntity>> {
					const searchResult: ISearchResult<IModelAdministrationRootEntity> = {
						FilterResult: {
							RecordsFound: 1,
							RecordsRetrieved: 1,
							ResultIds: [rootItem.Id],
							ExecutionInfo: ''
						},
						dtos: [rootItem]
					};

					return searchResult;
				},
				async update(complete: IModelAdministrationCompleteEntity): Promise<IModelAdministrationCompleteEntity> {
					const http = ServiceLocator.injector.get(HttpClient);
					// TODO: even if we stick to this approach of specifying provider methods, construction of the full URL
					//   must work differently.
					const configSvc = ServiceLocator.injector.get(PlatformConfigurationService);
					const endPoint = configSvc.webApiBaseUrl + 'model/administration/update'; //this.endPoint(this.serviceOptions.updateInfo, 'update');
					const httpOption = {
						...({body: complete})
					};

					return lastValueFrom(http.request<IModelAdministrationCompleteEntity>('POST', endPoint, httpOption));
				}
			}
		};

		super(dsOptions);

		this.dataProvider = new ModelAdministrationRootDataProvider(dsOptions, this);

		//const dp = this.provider as IRootDataProvider<IModelAdministrationRootEntity, IModelAdministrationCompleteEntity>;
		//dp.load = () => this.singleItem;
		//dp.filter = () => of(this.singleSearchResult);

		this.rootItem = rootItem;

		this.setList([rootItem]);
	}

	private readonly dataProvider: ModelAdministrationRootDataProvider;

	public override getProvider(): IDataProvider<IModelAdministrationRootEntity> {
		return this.dataProvider;
	}

	public readonly rootItem: IModelAdministrationRootEntity;

	/**
	 * Gets the current selection set
	 * @return all selected elements, in case of none selected, an empty array
	 */
	public override getSelection(): IModelAdministrationRootEntity[] {
		return [this.rootItem];
	}

	/**
	 * Checks if currenty at least one entity is selected
	 * @return true iff at least one element is selected
	 */
	public override hasSelection(): boolean {
		return true;
	}

	/**
	 * Selects the passed entities.
	 * @param toSelect
	 */
	public override async select(toSelect: IModelAdministrationRootEntity[] | IModelAdministrationRootEntity | null): Promise<IModelAdministrationRootEntity | null> {
		return this.rootItem;
	}

	/**
	 * Selects entities matching the passed ids.
	 * @param toSelect identifier (array) for the elements to select
	 */
	public override async selectById(toSelect: IIdentificationData[] | IIdentificationData | null): Promise<IModelAdministrationRootEntity | null> {
		return this.rootItem;
	}

	/**
	 * Deselects all currently selected entities
	 */
	public override deselect() {
		// This implementation is intentionally empty.
	}

	/**
	 * Selects the next element. In case none is selected, the first entity is selected
	 * @return The selected element, null in case, no selection was possible
	 */
	public override async selectNext(): Promise<IModelAdministrationRootEntity | null> {
		return this.rootItem;
	}

	/**
	 * Selects the previous element. In case none is selected, the last entity is selected
	 * @return The selected element, null in case, no selection was possible
	 */
	public override async selectPrevious(): Promise<IModelAdministrationRootEntity | null> {
		return this.rootItem;
	}

	/**
	 * Selects the first element
	 * @return The selected element, null in case, no selection was possible
	 */
	public override async selectFirst(): Promise<IModelAdministrationRootEntity | null> {
		return this.rootItem;
	}

	/**
	 * Selects the last element
	 * @return The selected element, null in case, no selection was possible
	 */
	public override async selectLast(): Promise<IModelAdministrationRootEntity | null> {
		return this.rootItem;
	}

	public override async refreshAll(): Promise<void> {
		await super.refreshAll();
		await super.select([this.rootItem]);
	}

	public override getList(): IModelAdministrationRootEntity[] {
		return [this.rootItem];
	}

	public override any(): boolean {
		return true;
	}

	public override createUpdateEntity(modified: IModelAdministrationRootEntity | null): IModelAdministrationCompleteEntity {
		return {
			ViewerSettingsToSave: null,
			ViewerSettingsToDelete: null,
			StaticHighlightingSchemesToSave: null,
			StaticHighlightingSchemesToDelete: null,
			DynamicHighlightingSchemesToSave: null,
			DynamicHighlightingSchemesToDelete: null,
			PropertyKeyTagCategoriesToSave: null,
			PropertyKeyTagCategoriesToDelete: null,
			PropertyKeysToSave: null,
			ModelComparePropertykeyBlackListToSave: null,
			ModelComparePropertykeyBlackListToDelete: null,
			DataTreesToSave: null,
			DataTreesToDelete: null,
			ModelImportProfilesToSave: null,
			ModelImportProfilesToDelete: null
		};
	}
}
