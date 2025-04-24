/*
 * Copyright(c) RIB Software GmbH
 */

import { BaiduMapService } from '../../services/baidu-map.service';
import { BingMapService } from '../../services/bing-map.service';
import { GoogleMapService } from '../../services/google-map.service';
import { OpenstreetMapService } from '../../services/openstreet-map.service';

import { IAddressEntity } from '../interfaces/address-entity.interface';
import { ILocation } from '../interfaces/location.interface';
import { IMapScope } from '../interfaces/map-scope.interface';

/**
 * Handles single and multiple location mark functionality.
 */
export class MapReadOnlyHandler {
	/**
	 * class name.
	 */
	public className = 'basicsCommonMapReadonlyHandler';

	/**
	 * Map options.
	 */
	public mapOptions = {
		showScalebar: false,
		customizeOverlays: false,
		showBreadcrumb: false,
		showDashboard: false,
	};

	/**
	 * Map instance.
	 */
	public mapServiceInstance!: GoogleMapService | BingMapService | OpenstreetMapService | BaiduMapService;

	/**
	 * Handle single location mark functionality.
	 * @param addressItem location information.
	 */
	public markMap(addressItem: IAddressEntity) {
		if (addressItem && addressItem.Latitude !== null && addressItem.Longitude !== null) {
			this.mapServiceInstance.mark({
				latitude: addressItem.Latitude,
				longitude: addressItem.Longitude,
				address: addressItem.Address,
			});
		}

		if ((addressItem && addressItem.Address !== null && addressItem.Latitude === null) || addressItem.Longitude === null) {
			this.mapServiceInstance.search({
				address: addressItem.Address,
				entity: addressItem,
				success: (location: ILocation) => {
					if (location) {
						addressItem.Latitude = location.latitude;
						addressItem.Longitude = location.longitude;
					} else {
						this.mapServiceInstance.mark(null); // clear mark.
						addressItem.Latitude = 0;
						addressItem.Longitude = 0;
					}
				},
				error: () => {
					this.mapServiceInstance.mark(null); // clear mark.
				},
			});
		}
	}

	/**
	 * Handle multiple location mark functionality.
	 * @param mapScope Map information.
	 * @returns null
	 */
	public checkForMultipleEntities(mapScope: IMapScope) {
		const entity = mapScope.entity;
		if (mapScope.showRoutes || mapScope.calculateDist) {
			return;
		}
		if (Array.isArray(entity)) {
			if (entity.length === 0) {
				this.mapServiceInstance.clearMarker();
			} else {
				const invalidLocations = entity.filter((addressItem: IAddressEntity) => {
					return addressItem.Latitude === null || addressItem.Longitude === null;
				});

				if (invalidLocations.length > 0) {
					let addressCount = invalidLocations.length;
					invalidLocations.forEach((address) => {
						// map.search returns undefined -> needed to find solution without working with promises
						this.mapServiceInstance.search({
							searchOnly: true,
							address: address.AddressLine,
							entity: address,
							success: (location: ILocation) => {
								if (location) {
									address.Latitude = location.latitude;
									address.Longitude = location.longitude;
								}
								addressCount--;
								if (addressCount === 0) {
									this.mapServiceInstance.markMultiple(entity);
								}
							},
							error: () => {
								addressCount--;
								if (addressCount === 0) {
									this.mapServiceInstance.markMultiple(entity);
								}
							},
						});
					});
				} else {
					this.mapServiceInstance.markMultiple(entity);
				}
			}
		} else {
			this.markMap(entity);
		}
	}

	/**
	 * check location data and mark address on map.
	 * @param mapScope Map information.
	 */
	public onMapApiReady(mapScope: IMapScope) {
		this.checkForMultipleEntities(mapScope);
		this.showRoute(mapScope);
		this.calculateDist(mapScope);
	}

	/**
	 * Show route between to locations.
	 * @param mapScope Map information.
	 */
	public showRoute(mapScope: IMapScope) {
		if (mapScope.showRoutes) {
			this.mapServiceInstance.showRoutes$(mapScope.entity as IAddressEntity[])?.then((data) => {
				this.mapSnapShot(1046984);
			});
		}
	}

	/**
	 * Calculate distance between to locations.
	 * @param mapScope Map information.
	 */
	public calculateDist(mapScope: IMapScope) {
		if (mapScope.calculateDist) {
			this.mapServiceInstance.showRoutes$(mapScope.entity as IAddressEntity[])?.then((data) => {
				data; // Future this data will be used
			});
		}
	}

	/**
	 * Create map snapshot url.
	 * @param jobId Job I'd No.
	 */
	public mapSnapShot(jobId: number) {
		if (typeof this.mapServiceInstance.getMapSnapshotURL === 'function') {
			const mapContainerDimensions = {
				width: 500, //TODO
				height: 600, //TODO
			};
			const mapSnapshotURL = this.mapServiceInstance.getMapSnapshotURL(this.mapServiceInstance, mapContainerDimensions);
			const result = {
				url: mapSnapshotURL,
				jobId: jobId,
			};
			result; // Used for mapsnapshot url
		}
	}

	/**
	 * Handle map click event functionality.
	 */
	public onMapClick() {}
}
