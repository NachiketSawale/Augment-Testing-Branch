/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { GoogleMapService } from '../../services/google-map.service';
import { BingMapService } from '../../services/bing-map.service';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { BaiduMapService } from '../../services/baidu-map.service';
import { OpenstreetMapService } from '../../services/openstreet-map.service';

import { IAddressEntity } from '../interfaces/address-entity.interface';
import { ILocation } from '../interfaces/location.interface';
import { IMapScope } from '../interfaces/map-scope.interface';
import { ICountryInfo } from '../interfaces/country-info.interface';

/**
 * Handles updating address on map click and opening map into new tab.
 */
export class MapEditableHandler {
	/**
	 * Stores map instance.
	 */
	public mapServiceInstance!: GoogleMapService | BingMapService | OpenstreetMapService | BaiduMapService;

	/**
	 * Message.
	 */
	public messages;

	/**
	 * Class name.
	 */
	public className = 'basicsCommonMapEditableHandler';

	/**
	 * Map options.
	 */
	public mapOptions = {
		showScalebar: true,
		customizeOverlays: true,
		showBreadcrumb: true,
	};

	/**
	 * Location information.
	 */
	public entityData: { entity: IAddressEntity } = {
		entity: {
			Address: '',
			AddressLine: '',
			AddressModified: false,
			City: '',
			CountryDescription: 'India',
			CountryFk: 56,
			CountryISO2: 'DE',
			County: null,
			Id: 1026225,
			Latitude: 18.3784131,
			Longitude: 76.5692526,
			StateDescription: null,
			StateFk: 5,
			Street: 'LIC colony',
			Version: 2,
			ZipCode: '531232323',
		},
	};

	/**
	 * Initialize service instances.
	 * @param translate PlatformTranslateService instance.
	 * @param http HttpClient instance.
	 */
	public constructor(
		public translate: PlatformTranslateService,
		private http: HttpClient,
		private configurationService: PlatformConfigurationService,
	) {
		this.messages = {
			loadingMap: this.translate.instant('ui.map.message.loadingMap').text,
			mapLoaded: this.translate.instant('ui.map.message.mapLoaded').text,
			mapLoadFailed: this.translate.instant('ui.map.message.mapLoadFailed').text,
			searching: this.translate.instant('ui.map.message.searching').text,
			searchCompleted: this.translate.instant('ui.map.message.searchCompleted').text,
			addressNotFound: this.translate.instant('ui.map.message.addressNotFound').text,
			searchError: this.translate.instant('ui.map.message.searchError').text,
		};
	}

	/**
	 * After Map API loaded it will mark location.
	 * @param mapScope Stores map info
	 */
	public onMapApiReady(mapScope: IMapScope) {
		this.entityData.entity = mapScope.entity as IAddressEntity;
		this.entityData.entity.message = this.messages.mapLoaded;
		if (this.entityData.entity) {
			this.entityData.entity.message = this.messages.searching;
			if (this.entityData.entity.Latitude && this.entityData.entity.Longitude) {
				this.mapServiceInstance.mark({
					latitude: this.entityData.entity.Latitude,
					longitude: this.entityData.entity.Longitude,
					address: this.entityData.entity.Address,
				});
			} else {
				this.mapServiceInstance.search({
					address: this.entityData.entity.Address,
					entity: this.entityData.entity,
					success: (location: ILocation) => {
						if (location) {
							this.entityData.entity.Latitude = location.latitude;
							this.entityData.entity.Longitude = location.longitude;
							this.entityData.entity.Address = location.address as string;
							this.entityData.entity.message = this.messages.searchCompleted;
						} else {
							this.entityData.entity.message = this.messages.addressNotFound;
						}
					},
				});
			}
		}
	}

	/**
	 * Handle map click event functionality.
	 * @returns If map not present it will come out of function.
	 */
	public onMapClick() {
		if (!this.mapServiceInstance || !this.mapServiceInstance.map) {
			return;
		}

		this.mapServiceInstance.dataOnMapClick$.subscribe((data) => {
			this.handleMapClick(data);
		});
	}

	/**
	 * Mark location and update address on map click.
	 * @param location location information.
	 */
	public handleMapClick(location: ILocation) {
		// update current address via map click
		this.updateAddressViaMapClick(location);

		this.mapServiceInstance.mark({
			latitude: location.latitude,
			longitude: location.longitude,
			address: location.addressEntity.Address,
			disableSetCenter: true,
		});

		this.entityData.entity.Latitude = location.latitude;
		this.entityData.entity.Longitude = location.longitude;
		this.entityData.entity.Address = location.addressEntity.Address;
		this.entityData.entity.City = location.addressEntity.City as string;
		this.entityData.entity.CountryISO2 = location.addressEntity.CountryCodeISO2 as string;
		this.entityData.entity.County = location.addressEntity.Country as string;
		this.entityData.entity.CountryFk = location.addressEntity.CountryFk as number;
		this.entityData.entity.ZipCode = location.addressEntity.ZipCode as string;
		this.entityData.entity.Street = location.addressEntity.Street as string;
	}

	/**
	 * update current address via map click
	 * @param location location information.
	 * @returns If no data to update.
	 */
	public updateAddressViaMapClick(location: ILocation) {
		if (!location.addressEntity) {
			return; // no data to update
		}

		// the country ISO2 code returned from map
		if (location.addressEntity.CountryCodeISO2) {
			this.getCountryInfoByKey(location.addressEntity.CountryFk as number).subscribe((data: ICountryInfo) => {
				if (data) {
					location.addressEntity.CountryFk = data.Id;
				}
			});
		}
	}

	/**
	 * Provides country information using its key.
	 * @param countryFk country Fk.
	 * @returns country information observable.
	 */
	public getCountryInfoByKey(countryFk: number): Observable<ICountryInfo> {
		let url = this.configurationService.webApiBaseUrl + 'basics/lookupdata/master/getitembykey?lookup=country';

		url += '&id=' + countryFk;

		return new Observable((observer) => {
			this.http.get(url, {}).subscribe((item) => {
				if (item) {
					const entity = item as ICountryInfo;
					observer.next(entity);
				} else {
					observer.next();
				}
			});
		});
	}
}
