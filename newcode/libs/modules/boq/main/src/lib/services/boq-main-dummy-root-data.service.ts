/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, ServiceRole, IRootDataProvider, IDataServiceOptions, IDataProvider, HttpRootDataProvider } from '@libs/platform/data-access';
import { IEntityBase, IEntityIdentification, IIdentificationData, ISearchPayload, ISearchResult, PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { BoqItemComplete } from '../model/boq-item-complete.class';
import { lastValueFrom } from 'rxjs';

export interface IBoqDummyRootEntity extends IEntityBase, IEntityIdentification {
}

class BoqDummyRootDataProvider extends HttpRootDataProvider<IBoqDummyRootEntity, BoqItemComplete> {
	public constructor(options: IDataServiceOptions<IBoqDummyRootEntity>, private readonly owner: BoqDummyRootDataService) {
		super(options);
	}

	public override create(): Promise<IBoqDummyRootEntity> {
		throw new Error('Creation is not supported in this implementation.');
	}

	public override async load(): Promise<IBoqDummyRootEntity[]> {
		return [this.owner.rootItem];
	}
}

// Based on 'ModelAdministrationRootDataService'
@Injectable({providedIn: 'root'})
export class BoqDummyRootDataService extends DataServiceFlatRoot<IBoqDummyRootEntity, BoqItemComplete> {
	private readonly dataProvider: BoqDummyRootDataProvider;

	public readonly rootItem: IBoqDummyRootEntity;

	public constructor() {
		const rootItem: IBoqDummyRootEntity = { Id: 1, Version: 1 };

		const options: IDataServiceOptions<IBoqDummyRootEntity> = {
			apiUrl: 'boq/main',
			roleInfo: {
				itemName: 'Dummy',
				role: ServiceRole.Root
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false
			},
			// TODO-BOQ: remove when the custom provider class is actually used
			provider: <IRootDataProvider<IBoqDummyRootEntity, BoqItemComplete>>{
				create(identificationData: IIdentificationData | null): Promise<IBoqDummyRootEntity> {
					throw new Error('Creation is not supported in this implementation.');
				},

				async load(identificationData: IIdentificationData | null): Promise<IBoqDummyRootEntity[]> {
					return [rootItem];
				},

				async filter(payload: ISearchPayload): Promise<ISearchResult<IBoqDummyRootEntity>> {
					const searchResult: ISearchResult<IBoqDummyRootEntity> = {
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

				async update(complete: BoqItemComplete): Promise<BoqItemComplete> {
					const http = ServiceLocator.injector.get(PlatformHttpService);
					const endPoint = 'boq/main/update';
					return lastValueFrom(http.post$<BoqItemComplete>(endPoint, complete));
				}
			}
		};

		super(options);

		this.dataProvider = new BoqDummyRootDataProvider(options, this);
		this.rootItem = rootItem;
		this.setList([rootItem]);
	}

	public override getProvider(): IDataProvider<IBoqDummyRootEntity> {
		return this.dataProvider;
	}

	public override getSelection(): IBoqDummyRootEntity[] {
		return [this.rootItem];
	}

	public override hasSelection(): boolean {
		return true;
	}

	public override async select(): Promise<IBoqDummyRootEntity> {
		return this.rootItem;
	}

	public override async selectById(): Promise<IBoqDummyRootEntity> {
		return this.rootItem;
	}

	public override deselect() {
		// This implementation is intentionally empty.
	}

	public override async selectNext(): Promise<IBoqDummyRootEntity | null> {
		return this.rootItem;
	}

	public override async selectPrevious(): Promise<IBoqDummyRootEntity> {
		return this.rootItem;
	}

	public override async selectFirst(): Promise<IBoqDummyRootEntity> {
		return this.rootItem;
	}

	public override async selectLast(): Promise<IBoqDummyRootEntity> {
		return this.rootItem;
	}

	public override async refreshAll(): Promise<void> {
		await super.refreshAll();
		await super.select([this.rootItem]);
	}

	public override getList(): IBoqDummyRootEntity[] {
		return [this.rootItem];
	}

	public override any(): boolean {
		return true;
	}

	public override createUpdateEntity(): BoqItemComplete {
		return new BoqItemComplete();
	}

	public override getModificationsFromUpdate(complete: BoqItemComplete): IBoqDummyRootEntity[] {
		// return [this.rootItem]; // TODO-BOQ: Not sure why that does not work
		return [{ Id: 1, Version: 1 }];		
	}
}
