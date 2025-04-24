/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PlatformConfigurationService } from '@libs/platform/common';

import { WaypointEntity } from '../model/constant/waypoint-entity';

import { IMapOptions } from '../model/interfaces/map-options.interface';
import { IAddressEntity } from '../model/interfaces/address-entity.interface';
import { IMarkOptions } from '../model/interfaces/mark-options.interface';
import { IShowPinWaypointData } from '../model/interfaces/show-pin-waypoint-data.interface';
import { IEventMetadata } from '../model/interfaces/bing-map/event-metadata.interface';

/**
 * Handle map functionality
 */
@Injectable({
	providedIn: 'root',
})
export class MapUtilityService {
	/**
	 * HttpClient instance.
	 */
	private http = inject(HttpClient);

	/**
	 * ConfigurationService instance.
	 */
	private configurationService = inject(PlatformConfigurationService);

	/**
	 * Map options.
	 */
	public mapOptions = {
		loaded: false,
		Provider: 'openstreet',
		BingKey: '',
		GoogleKey: '',
		BaiduKey: '',
	};

	/**
	 * Get map options from server.
	 * @returns {Promise<IMapOptions>} promise.
	 */
	public getMapOptions$(): Promise<IMapOptions> {
		const mapOptions = new Promise<IMapOptions>((resolve) => {
			if (this.mapOptions.loaded) {
				resolve(this.mapOptions);
			} else {
				this.getMapOptionsData().subscribe((data: IMapOptions) => {
					this.mapOptions.Provider = data.Provider;
					this.mapOptions.GoogleKey = data.GoogleKey;
					this.mapOptions.BingKey = data.BingKey;
					this.mapOptions.BaiduKey = data.BaiduKey;
					this.mapOptions.loaded = true;
					resolve(this.mapOptions);
				});
			}
		});

		return mapOptions;
	}

	/**
	 * Provide map options.
	 * @returns observable.
	 */
	public getMapOptionsData(): Observable<IMapOptions> {
		return this.http.get<IMapOptions>(this.configurationService.webApiBaseUrl + 'basics/common/systemoption/map');
	}

	/**
	 * Check latitude and longitude are valid of not.
	 * @param markOption location info.
	 * @returns boolean.
	 */
	public isLatLongValid(markOption: IMarkOptions) {
		let invalidLocation = false;
		if (markOption && markOption.latitude && markOption.longitude) {
			invalidLocation = markOption.latitude > 90 || markOption.latitude < -90 || markOption.longitude > 180 || markOption.longitude < -180;
			if (invalidLocation) {
				return false;
			}
		}
		return true;
	}

	/**
	 * provide LatLng max and min info
	 * @param markItemList locations info.
	 * @returns LatLng info.
	 */
	public getExtremes(markItemList: IAddressEntity[]) {
		const validMarkItemList = markItemList.filter((markItem) => {
			return markItem.Latitude !== 0 || markItem.Longitude !== 0;
		});

		return {
			maxLong: ((items) => {
				const maLo = items.reduce((prev: IAddressEntity, current: IAddressEntity) => (+(prev.Longitude as number) > +(current.Longitude as number) ? prev : current));

				return maLo === null || maLo === undefined ? 179 : maLo.Longitude;
			})(validMarkItemList),
			minLong: ((items) => {
				const miLo = items.reduce((prev: IAddressEntity, current: IAddressEntity) => (+(prev.Longitude as number) < +(current.Longitude as number) ? prev : current));
				return miLo === null || miLo === undefined ? -179 : miLo.Longitude;
			})(validMarkItemList),
			maxLat: ((items) => {
				const maLa = items.reduce((prev: IAddressEntity, current: IAddressEntity) => (+(prev.Latitude as number) > +(current.Latitude as number) ? prev : current));
				return maLa === null || maLa === undefined ? 89 : maLa.Latitude;
			})(validMarkItemList),
			minLat: ((items) => {
				const miLa = items.reduce((prev: IAddressEntity, current: IAddressEntity) => (+(prev.Latitude as number) < +(current.Latitude as number) ? prev : current));
				return miLa === null || miLa === undefined ? -89 : miLa.Latitude;
			})(validMarkItemList),
		};
	}

	/**
	 * Click waypoint on map then set waypoint selected in container
	 * @param metaData event data.
	 */
	public waypointClicked(metaData: IEventMetadata): Promise<IShowPinWaypointData> {
		const list = WaypointEntity;
		let selected: IShowPinWaypointData | undefined = undefined;
		const waypointData = new Promise<IShowPinWaypointData>((resolve) => {
			selected = list.find((data: IShowPinWaypointData) => {
				return data.Id === metaData.entity.waypointEntityId;
			});
			if (selected) {
				resolve(selected);
			}
		});

		return waypointData;
	}
}
