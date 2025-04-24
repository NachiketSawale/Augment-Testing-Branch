/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IBlobStringEntity } from '@libs/basics/shared';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IEstimateSpecification } from '../model/entities/estimate-project-specification.interface';
import { EstimateProjectDataService } from './estimate-project-data.service';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { map, Observable, of } from 'rxjs';
import { EstimateProjectComplete } from '../model/estimate-project-complete.class';
import { IEstimateCompositeEntity } from '@libs/estimate/shared';

@Injectable({ providedIn: 'root' })

/**
 * @brief Service class for handling estimate project specifications.
 *
 */
export class EstimateProjectSpecificationDataService extends DataServiceFlatLeaf<IEstimateSpecification, IEstimateCompositeEntity, EstimateProjectComplete> {
	public modifiedSpecifications: IEstimateSpecification[] = [];
	private http = inject(HttpClient);
	private configurationService = inject(PlatformConfigurationService);
	public compositeItemId: number = 0;
	public item: IEstimateSpecification = {} as IEstimateSpecification;
	//service.currentSpecificationChanged = new Platform.Messenger();   // need to check Platform.Messenger();
	public currentSpecification: IEstimateSpecification = {
		Content: null,
		ParentId: null,
		Id: 0,
		Version: 0
	};
	public constructor(private estimateProjectDataService: EstimateProjectDataService) {
		const options: IDataServiceOptions<IEstimateSpecification> = {
			apiUrl: 'cloud/common/blob',
			roleInfo: <IDataServiceChildRoleOptions<IBlobStringEntity, IEstimateCompositeEntity, EstimateProjectComplete>>{
				itemName: 'Blob',
				role: ServiceRole.Leaf,
				parent: estimateProjectDataService,
			},
			readInfo: {
				endPoint: 'getblobstring',
				prepareParam: () => {
					return { id: this.estimateProjectDataService.getSelectedEntity()?.ClobsFk ?? -1 };
				}
			}
		};
		super(options);
	}

	/**
	 * @brief Sets the current specification.
	 *
	 * This method is intended to set the current specification.
	 * Currently, it does not have any implementation.
	 */
	public setCurrentSpecification(specification: IEstimateSpecification) {
		if (this.currentSpecification !== specification) {
			//this.currentSpecification = specification || {};
			// this.currentSpecificationChanged.fire(specification);   // TODO : neeed to confirm platform messanger
		}
	}
	/**
	 * @brief Clears the current specification by setting its properties to default values.
	 */
	public clearSpecification() {
		if (!this.currentSpecification) {
			return;
		}
		this.currentSpecification.Content = null;
		this.currentSpecification.ParentId = null;
		this.currentSpecification.CompositeItemId = null;
		this.currentSpecification.Id = 0;
		this.currentSpecification.Version = 0;
	}

	/**
	 * @brief Loads a specified item into the current specification.
	 * indicating that the `currentSpecificationChanged` event should be fired.
	 *
	 * @param item The specification item to load, implementing the `IEstimateSpecification` interface.
	 * @param compositeItemId The ID of the composite item associated with the specification.
	 */
	public loadSpecification(item: IEstimateSpecification, compositeItemId: number) {
		if (!item) {
			this.clearSpecification();
			// service.currentSpecificationChanged.fire(currentSpecification);   //TODO  currentSpecificationChanged.fire event

			this.currentSpecification;
			this.setNewSpecification();
			this.modification(item, compositeItemId);
		}
	}

	/**
	 * @brief Initializes a new specification.
	 *
	 * This method sets up a new specification by resetting the properties of the `currentSpecification`
	 * to their default values. Specifically, it sets `ParentId` and `CompositeItemId` to `null` and `Id` to `0`.
	 * Additionally, there is a TODO comment indicating that the `currentSpecificationChanged` event should be fired.
	 *
	 * @return void
	 */

	private setNewSpecification(): void {
		this.currentSpecification.ParentId = null;
		this.currentSpecification.CompositeItemId = null;
		this.currentSpecification.Id = 0;
		//service.currentSpecificationChanged.fire(currentSpecification);  // TODO need to check fire event solution
	}

	/**
	 * @brief Checks if there are modified specifications.
	 * This method determines if there are any modified specifications by checking the length of  the `modifiedSpecifications` array.
	 * @return A boolean indicating whether there are modified specifications.
	 *         Returns `false` by default. It may return `undefined` if no modifications are found.
	 */
	private isModifiedSpecification(): boolean | undefined {
		const isModified = false;
		if (this.modifiedSpecifications.length) {
			const matchedItem = this.modifiedSpecifications.find((spec) => this.compositeItemId === spec.CompositeItemId && spec.ParentId === this.item.Id);
			if (matchedItem) {
				this.setCurrentSpecification(matchedItem);
				return true;
			}
		}

		return isModified;
	}

	private modification(item: IEstimateSpecification, compositeItemId: number): Observable<IEstimateSpecification> {
		const compositeId = { compositeItemId };
	
		if (item.ClobsFk) {
			if (this.isModifiedSpecification()) {
				return of(null as unknown as IEstimateSpecification); 
			}
	
			return this.http.get<IEstimateSpecification>(this.configurationService.webApiBaseUrl + 'basics/material/createMaterial?id=' + item.ClobsFk).pipe(
				map((response) => {
					if (response) {
						this.currentSpecification = response;
						this.currentSpecification.ParentId =response.Id;
						this.currentSpecification.CompositeItemId = Object.assign(compositeId);
						// service.currentSpecificationChanged.fire(this.currentSpecification);
						return this.currentSpecification; 
					} else {
						this.setNewSpecification();
						return this.currentSpecification; 
					}
				}),
			);
		}
	
		return of(null as unknown as IEstimateSpecification); 
	}
	
	
	/**
	 * @name setSpecificationAsModified
	 * @description Register the given specification as modified so it'll be saved on estimate header selection change.
	 * @param {Object} specification : modified specification that's to be saved
	 */
	public setSpecificationAsModified(specification: IEstimateSpecification): void {
		if (!specification) {
			return;
		}

		if (this.modifiedSpecifications.length) {
			const matchedItem = this.modifiedSpecifications.find((item) => item.ParentId === specification.ParentId);
			if (matchedItem) {
				Object.assign(matchedItem, JSON.parse(JSON.stringify(specification)));
			} else {
				this.modifiedSpecifications.push(JSON.parse(JSON.stringify(specification)));
			}
		}
	}

	/**
	 * @brief Retrieves the current specification.
	 * This method returns the current specification stored in the `currentSpecification` property.
	 * @return The current specification.
	 */
	public getCurrentSpecification() {
		return this.currentSpecification;
	}

	/**
	 * @brief Retrieves the modified specifications if they exist.
	 * This method checks if the `modifiedSpecifications` array is defined and has elements.
	 * If so, it returns the array of modified specifications. Otherwise, it returns null.
	 * @return The array of modified specifications if available; otherwise, null.
	 */
	public getModifiedSpecification() {
		if (typeof this.modifiedSpecifications !== 'undefined' && this.modifiedSpecifications.length > 0) {
			return this.modifiedSpecifications;
		} else {
			return null;
		}
	}

	/**
	 * @brief Resets the modified specifications.
	 * This method clears the `modifiedSpecifications` array, resetting it to an empty array.
	 * This is typically used to remove all previously stored modified specifications,
	 * allowing for a fresh start or cleanup of the data.
	 */
	public resetModifiedSpecification() {
		this.modifiedSpecifications = [];
	}
}
