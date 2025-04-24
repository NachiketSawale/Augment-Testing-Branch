/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, EntityArrayProcessor, DataServiceHierarchicalRoot } from '@libs/platform/data-access';
import { ITransportPackageEntityGenerated, TransportPackageComplete } from '../model/models';
import { IIdentificationData, ISearchResult } from '@libs/platform/common';
import { get } from 'lodash';
import { HttpParams } from '@angular/common/http';
import { IPpsEventParentService } from '@libs/productionplanning/shared';
import { TransportPlanningPackageDataProcessorService } from './transportplanning-package-data-processor.service';

export const TRANSPORTPLANNING_PACKAGE_DATA_TOKEN = new InjectionToken<TransportplanningPackageDataService>('transportplanningPackageDataToken');

/**
 * TransportPlanning package Data Service
 */
@Injectable({
	providedIn: 'root',
})
export class TransportplanningPackageDataService extends DataServiceHierarchicalRoot<ITransportPackageEntityGenerated, TransportPackageComplete> implements IPpsEventParentService {
	public readonlyProcessor = new TransportPlanningPackageDataProcessorService();

	public constructor() {
		const options: IDataServiceOptions<ITransportPackageEntityGenerated> = {
			apiUrl: 'transportplanning/package',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'customfiltered',
				prepareParam: (ident: IIdentificationData) => {
					let params = new HttpParams()
						.set('filter', '')
						.set('Pattern', 0)
						.set('PageSize', '700')
						.set('PageNumber', '0')
						.set('UseCurrentClient', 0)
						.set('ExecutionHints', 'true')
						.set('IncludeNonActiveItems', 0)
						.set('IncludeReferenceLineItems', 0)
						.set('PinningContext', JSON.stringify([]))
						.set('ProjectContextId', 0)
						.set('UseCurrentProfitCenter', 0)
						.set('isReadingDueToRefresh', 'false');

					const orderBy = [{ Field: 'Code' }];
					orderBy.forEach((order, index) => {
						params = params.set(`orderBy[${index}].Field`, order.Field);
					});

					return params;
				},
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update',
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceRoleOptions<ITransportPackageEntityGenerated>>{
				role: ServiceRole.Root,
				itemName: 'TransportPackage',
			},
			entityActions: { createSupported: true, deleteSupported: true },
			processors: [new EntityArrayProcessor<ITransportPackageEntityGenerated>(['ChildPackages'])],
		};
		super(options);

		this.readonlyProcessor.setDataService(this);
		this.processor.addProcessor([this.readonlyProcessor]);
	}

	/**
	 * creation of update objects
	 * @param modified
	 */
	public override createUpdateEntity(modified: ITransportPackageEntityGenerated | null): TransportPackageComplete {
		const complete = new TransportPackageComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.TransportPackage = [modified];
		}

		return complete;
	}

	/**
	 * getModificationsFromUpdate.
	 * @param complete
	 */
	public override getModificationsFromUpdate(complete: TransportPackageComplete): ITransportPackageEntityGenerated[] {
		if (complete.MainItemId === null) {
			return [];
		}

		return [{ Id: complete.MainItemId } as ITransportPackageEntityGenerated];
	}

	/**
	 * Retrieves the parent TransportPackageFk of the given transport package entity.
	 * @param element The `ITransportPackageEntityGenerated` for which to find the parent transportpackage.
	 */
	public override parentOf(element: ITransportPackageEntityGenerated): ITransportPackageEntityGenerated | null {
		if (element.TransportPackageFk === undefined) {
			return null;
		}

		const parentId = element.TransportPackageFk;
		const foundParent = this.flatList().find((parent) => parent.Id === parentId);

		if (foundParent === undefined) {
			return null;
		}

		return foundParent;
	}
	/**
	 * Retrieves the child packages of the given transport package entity.
	 * @param element The `ITransportPackageEntityGenerated` from which to retrieve the child transport package.
	 */
	public override childrenOf(element: ITransportPackageEntityGenerated): ITransportPackageEntityGenerated[] {
		return element.ChildPackages ?? [];
	}

	/**
	 * Handles the successful creation of an entity by casting and returning it.
	 *
	 * This method takes the `created` object, casts it to an `ITransportPackageEntityGenerated`, and returns it.
	 *
	 * @param created The object representing the created entity. It is expected to be of type `ITransportPackageEntityGenerated`.
	 */
	protected override onCreateSucceeded(created: object): ITransportPackageEntityGenerated {
		const entity = created as ITransportPackageEntityGenerated;

		return entity;
	}

	/**
	 * Handles the successful loading of data and processes it into a list of transport package reference entities.
	 * @param loaded The loaded data as an object. It is expected to be a JSON string that represents an array of transport package reference entities.
	 */
	protected override onLoadSucceeded(loaded: object): ITransportPackageEntityGenerated[] {
		if (loaded) {
			const list = loaded as ITransportPackageEntityGenerated[];

			return list;
		}
		return [];
	}

	/**
	 * Process loaded data when loading by filter succeeds
	 * @param loaded The loaded data as an object.
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<ITransportPackageEntityGenerated> {
		const dtos = get(loaded, 'dtos', []) as ITransportPackageEntityGenerated[];
		const resultIds = dtos.map((dto) => dto.Id).filter((id) => id !== null) as number[]; // Filter out null values

		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: dtos.length,
				RecordsRetrieved: dtos.length,
				ResultIds: resultIds,
			},
			dtos: dtos,
		};
	}

	public readonly ForeignKeyForEvent: string = 'TrsPackageFk';
}
