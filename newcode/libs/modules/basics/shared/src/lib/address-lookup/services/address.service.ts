/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { AddressEntity } from '../model/address-entity';
import { map, Observable, tap } from 'rxjs';
import { IAddressCheckDto } from '../model/address-check-dto.interface';
import { ILookupSearchRequest, ILookupSearchResponse, LookupSearchResponse, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IProjectAddress } from '../model/project-address.interface';

@Injectable({
	providedIn: 'root'
})
export class BasicsSharedAddressService<TEntity extends object> extends UiCommonLookupTypeDataService<AddressEntity, TEntity> {
	/**
	 * Default constructor to initialize the address lookup service.
	 */
	public constructor() {
		super('addresslookupservice', {
			uuid: 'E9F9813B7B19477AA37020B904A9483F',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Address',
			disableInput: true,
			showGrid: true,
			showDialog: true
		});
	}

	private mapEntityTo(entity: object): AddressEntity {
		return {
			Id: _.get(entity, 'Id') as unknown as number,
			CountryFk: _.get(entity, 'BasCountryFk') as unknown as number,
			StateFk: _.get(entity, 'BasCountryFk'),
			AddressModified: _.get(entity, 'AddressModified') as unknown as boolean,
			Street: _.get(entity, 'Street'),
			City: _.get(entity, 'City'),
			ZipCode: _.get(entity, 'Zipcode'),
			County: _.get(entity, 'County'),
			Address: _.get(entity, 'Address'),
			AddressLine: _.get(entity, 'AddressLine'),
			Longitude: _.get(entity, 'Longitude'),
			Latitude: _.get(entity, 'Latitude'),
			Supplement: _.get(entity, 'Supplement'),
			LanguageFk: _.get(entity, 'LanguageFk'),
		};
	}

	/**
	 * Retrieve addresses from search or dropdown list.
	 * @param request The query parameters.
	 */
	public override getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<AddressEntity>> {
		const searchDialog = _.get(request.additionalParameters, 'searchDialog');
		if (searchDialog) {
			return super.getSearchList(request).pipe(
				map(response => {
					response.items = response.items.map(item => {
						return this.mapEntityTo(item);
					});
					return response;
				}),
				tap(response => {
					this.processItems(response.items);
					this.cache.setItems(response.items);
				})
			);
		} else {
			return this.http.post<IProjectAddress[]>(`${this.configService.webApiBaseUrl}project/main/address/lookup`, request.additionalParameters, this.makeHttpOptions()).pipe(
				map(entities => {
					const mapEntities = entities.map(entity => {
						return {
							...entity.AddressEntity,
							Description: entity.Description,
							CommentText: entity.CommentText,
							AddressTypeFk: entity.AddressTypeFk
						} as AddressEntity;
					});

					const response = new LookupSearchResponse(mapEntities);
					response.itemsFound = mapEntities.length;
					response.itemsRetrieved = mapEntities.length;
					return response;
				}),
				tap(response => {
					this.processItems(response.items);
					this.cache.setItems(response.items);
				})
			);
		}
	}

	/**
	 * Get the formatted address according to specified address.
	 * @param address Address info.
	 */
	public getFormattedAddress(address: AddressEntity): Observable<IAddressCheckDto> {
		return this.http.post<IAddressCheckDto>(this.configService.webApiBaseUrl + 'basics/common/address/getformattedaddresswithaddrtemplate', address);
	}

}
