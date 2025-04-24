/*
 * Copyright(c) RIB Software GmbH
 */
//TODO any, will be removed in future.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const google: any;

import { Injectable, inject } from '@angular/core';

import * as _ from 'lodash';

import { IAddressEntity } from '../model/interfaces/address-entity.interface';
import { IMapGeocoder } from '../model/interfaces/map-geocoder.interface';
import { IMarkOptions } from '../model/interfaces/mark-options.interface';
import { ILocation } from '../model/interfaces/location.interface';
import { ISearchAddressEntity } from '../model/interfaces/search-address-entity.interface';
import { ISearchOptions } from '../model/interfaces/search-options.interface';
import { IMapOptions } from '../model/interfaces/map-options-info.interface';
import { IMapEvent } from '../model/interfaces/map-event.interface';
import { IGoogleMapRouteResponce } from '../model/interfaces/google-map/google-map-route-responce.interface';
import { IRouteDistance } from '../model/interfaces/google-map/route-distance.interface';
import { IMapContainerDimensions } from '../model/interfaces/google-map/map-container-dimension.interface';
import { IRouteLeg } from '../model/interfaces/google-map/route-leg.interface';

import { PlatformTranslateService } from '@libs/platform/common';
import { BaiduMapService } from './baidu-map.service';
import { BingMapService } from './bing-map.service';
import { OpenstreetMapService } from './openstreet-map.service';
import { MapBaseService } from './map-base.service';
import { MapUtilityService } from './map-utility.service';

/**
 * Handle google map functionality.
 */
@Injectable({
	providedIn: 'root',
})
export class GoogleMapService extends MapBaseService {
	/**
	 * Map instance.
	 */
	public map: typeof google | null = null;

	/**
	 * geocoder instance.
	 */
	public geocoder: typeof google | null = null;

	/**
	 * Marked instance.
	 */
	public marker: typeof google | null = null;

	/**
	 * InfoWindow instance.
	 */
	public infoWindow: typeof google | null = null;

	/**
	 * DirectionsService instance.
	 */
	public directionsService: typeof google.maps | null = null;

	/**
	 * DirectionsRenderer instance.
	 */
	public directionsDisplay: typeof google.maps.DirectionsRenderer | null = null;

	/**
	 * Event instance.
	 */
	public clickMapId: typeof google | null = null;

	/**
	 * marker list.
	 */
	public markerList: (typeof google)[] = [];

	/**
	 * selectedPin.
	 */
	public selectedPin: typeof google | null = null;

	/**
	 * Google API url.
	 */
	public apiUrl = '//maps.googleapis.com/maps/api/js?key=';

	/**
	 * snapshot URL.
	 */
	private snapshotURL = 'https://maps.googleapis.com/maps/api/staticmap?sensor=false&size=';

	/**
	 * inject the PlatformTranslateService
	 */
	public readonly translate = inject(PlatformTranslateService);

	/**
	 * Map key service.
	 */
	private mapUtilityService = inject(MapUtilityService);

	/**
	 * Provide location address.
	 * @param lat latitude.
	 * @param lon longitude.
	 */
	public geoLocation2address(lat: number, lon: number) {
		this.geocoder.geocode({ location: new google.maps.LatLng(lat, lon) }, (results: IMapGeocoder[], status: string) => {
			let newAddress = null;
			if (status === google.maps.GeocoderStatus.OK) {
				if (results[0]) {
					newAddress = this.extractAddress(results[0], true);
				} else {
					throw new Error('Google geo error: No address found');
				}
			} else {
				throw new Error('Google geo error: ' + status);
			}

			this.dataOnMapClick$.next({
				latitude: lat,
				longitude: lon,
				addressEntity: newAddress,
			});
		});
	}

	/**
	 * Initialize google map.
	 */
	public override init() {
		const latLng = new google.maps.LatLng(18.3784131, 76.5692526),
			defaults = {
				zoom: 16,
				center: latLng,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
			},
			settings = Object.assign({}, defaults, (this.options as IMapOptions).mapOptions);

		// google map instance
		this.map = new google.maps.Map(this.element, settings);

		// google geocoder
		this.geocoder = new google.maps.Geocoder();
		this.directionsDisplay = new google.maps.DirectionsRenderer({ draggable: true });
		this.directionsService = new google.maps.DirectionsService();
		this.directionsDisplay.setMap(this.map);
	}

	/**
	 * listen click event of map.
	 */
	public mapClickEvent() {
		this.clickMapId = google.maps.event.addListener(this.map, 'click', (e: IMapEvent) => {
			this.geoLocation2address(e.latLng.lat(), e.latLng.lng());
		});
	}

	/**
	 * Remove event.
	 */
	public override destroy() {
		google.maps.event.removeListener(this.clickMapId);
	}

	/**
	 * Add mark on the map.
	 * @param markOptions location info.
	 * @returns null
	 */
	public mark(markOptions: IMarkOptions | null) {
		let invalidLocation = false;

		// judge latitude and longitude value are valid or not.
		if (markOptions && markOptions.latitude && markOptions.longitude) {
			invalidLocation = markOptions.latitude > 90 || markOptions.latitude < -90 || markOptions.longitude > 180 || markOptions.longitude < -180;
		}

		if (!markOptions || invalidLocation) {
			// clear mark.
			if (this.marker) {
				this.marker.setMap(null);
			}
			if (this.infoWindow) {
				this.infoWindow.close(this.map, this.marker);
			}
			if (this.map) {
				this.map.setCenter(new google.maps.LatLng(0, 0));
			}
			return;
		}

		// clear the previous info window
		if (this.infoWindow) {
			this.infoWindow.close();
		}

		const position = new google.maps.LatLng(markOptions.latitude, markOptions.longitude);

		if (!this.marker || !this.infoWindow) {
			this.marker = new google.maps.Marker({
				map: this.map,
				title: markOptions.address,
				draggable: true,
			});
			this.infoWindow = new google.maps.InfoWindow();
			google.maps.event.addListener(this.marker, 'click', () => {
				this.infoWindow.open(this.map, this.marker);
			});
		}

		if (!markOptions.disableSetCenter) {
			this.map.setCenter(position);
		}

		this.map.setOptions({ draggableCursor: 'inherit' });
		this.marker.setPosition(position);
		this.marker.setTitle(markOptions.address);
		this.marker.setMap(this.map);
		this.infoWindow.setContent(markOptions.address);
	}

	/**
	 * Clear mark.
	 */
	public clearMarker() {
		this.markerList.forEach((markItem) => {
			markItem.setMap(null);
		});
		this.markerList = [];
	}

	/**
	 * Check latitude and longitude are valid of not.
	 * @param markOption location info.
	 * @returns boolean.
	 */
	public isLatLongValid(markOption: IAddressEntity) {
		let invalidLocation = false;
		if (markOption && markOption.Latitude && markOption.Longitude) {
			invalidLocation = markOption.Latitude > 90 || markOption.Latitude < -90 || markOption.Longitude > 180 || markOption.Longitude < -180;
			if (invalidLocation) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Marks multiple locations.
	 * @param markItemList locations info.
	 */
	public markMultiple(markItemList: IAddressEntity[]) {
		const pinSelectedImage = 'cloud.style/content/images/control-icons.svg#ico-pushpin-google';
		this.clearMarker();
		let selectedPinInfo: typeof google | null = null;

		markItemList.forEach((markItem: IAddressEntity) => {
			if (!this.isLatLongValid(markItem)) {
				return;
			}

			const position = new google.maps.LatLng(markItem.Latitude, markItem.Longitude);

			const content = markItem.Address;
			let marker = new google.maps.Marker({
				map: this.map,
				title: markItem.Address,
				draggable: true,
			});

			const infoWindow = new google.maps.InfoWindow();

			if (markItem.isSelected) {
				const icon = {
					url: pinSelectedImage,
					scaledSize: new google.maps.Size(40, 40),
				};
				marker = new google.maps.Marker({
					map: this.map,
					title: markItem.Address,
					icon: icon,
					draggable: true,
				});
				this.selectedPin = marker;
				selectedPinInfo = infoWindow;
			}

			marker.setPosition(position);
			marker.setMap(this.map);
			this.markerList.push(marker);

			google.maps.event.addListener(marker, 'click', () => {
				infoWindow.open(this.map, marker);
			});

			this.map.setOptions({ draggableCursor: 'inherit' });
			infoWindow.setContent(content);
			infoWindow.setPosition(position);
			marker.setTitle(markItem.Address);
		});

		if (this.selectedPin && selectedPinInfo) {
			setTimeout(() => {
				if (selectedPinInfo) {
					selectedPinInfo.open(this.map, this.selectedPin);
				}
			}, 1000);
		}

		this.map.fitBounds(this.createBound(markItemList));
		this.map.setZoom(3);
	}

	/**
	 * Creates bound for mark.
	 * @param markItemList locations info.
	 * @returns LatLngBounds
	 */
	public createBound(markItemList: IAddressEntity[]) {
		const extremeValues = this.mapUtilityService.getExtremes(markItemList);
		return new google.maps.LatLngBounds(new google.maps.LatLng(extremeValues.maxLat, extremeValues.minLong), new google.maps.LatLng(extremeValues.minLat, extremeValues.maxLong));
	}

	/**
	 * search LatLng using location address.
	 * @param searchOptions searchOptions.
	 */
	public search(searchOptions: ISearchOptions) {
		const hasSuccessCallback = typeof searchOptions.success === 'function',
			successCallback = (location: ILocation | null) => {
				if (hasSuccessCallback && location) {
					searchOptions.success(location);
				}
			};

		this.geocoder.geocode(
			{
				address: searchOptions.address,
			},
			(results: IMapGeocoder[], status: string) => {
				if (status === google.maps.GeocoderStatus.OK) {
					const result = results[0],
						location = {
							address: result.formatted_address,
							latitude: result.geometry.location.lat(),
							longitude: result.geometry.location.lng(),
							addressEntity: this.extractAddress(result, false),
						};
					if (!searchOptions.searchOnly) {
						this.mark(location);
					}
					successCallback(location as ILocation);
				} else {
					if (!searchOptions.searchOnly) {
						this.mark(null); // clear old mark.
						this.addressNotFound(new GoogleMapService());
						throw new Error('Geocode was not successful for the following reason: ' + status);
					}
					successCallback(null); // clear old latitude and longitude.
				}
			},
		);
	}

	/**
	 * Extract address from geocoder response.
	 * @param result map geocoder response.
	 * @param addressModified boolean
	 * @returns new address.
	 */
	public extractAddress(result: IMapGeocoder, addressModified: boolean): ISearchAddressEntity {
		const addressComponents = result.address_components || [];
		const newAddressEntity: ISearchAddressEntity = {
			AddressModified: addressModified,
			Address: result.formatted_address,
		};

		const info = {
			Street: ['street_number', 'route'],
			City: ['locality'],
			Country: ['administrative_area_level_2', 'administrative_area_level_1'],
			// state: ['locality'],
			ZipCode: ['postal_code'],
			CountryCodeISO2: ['country'],
		};

		_.map(info, (val, key) => {
			const component =
					_.filter(addressComponents, (item) => {
						return _.includes(val, item.types[0]);
					}) || [];
			let property = 'long_name';

			if (key === 'CountryCodeISO2') {
				property = 'short_name'; // use short name for the iso2 code
			} else {
				property = 'long_name';
			}
			//TODO any, will be removed in future.
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(newAddressEntity as any)[key] = _.uniq(_.map(component, property) || []).join(' ');
		});

		return newAddressEntity;
	}

	/**
	 * show message if address not found on the map
	 * @param objSelf  GoogleMapService
	 */
	public addressNotFound(objSelf: GoogleMapService) {
		const latlng = new google.maps.LatLng(0, 0),
			zoom = 2;
		objSelf.map.setCenter(latlng);
		objSelf.map.setZoom(zoom);

		// show a message popup
		if (!objSelf.infoWindow) {
			objSelf.infoWindow = new google.maps.InfoWindow();
		}
		objSelf.infoWindow.setContent(this.translate.instant('ui.map.addressNotFound').text);
		objSelf.infoWindow.setPosition(latlng);
		objSelf.infoWindow.open(objSelf.map);
	}

	/**
	 * Show route between two locations.
	 * @param wayPoints locations information.
	 * @returns promise.
	 */
	public showRoutes$(wayPoints: IAddressEntity[]) {
		if (wayPoints.length < 2) {
			return;
		}
		const distance = new Promise((resolve) => {
			const data: IRouteDistance = { unitInfo: 'km', distances: [] };
			let start;
			let end;
			let waypoint = wayPoints[0];

			if (waypoint.Latitude && waypoint.Longitude && this.isLatLongValid(waypoint)) {
				start = new google.maps.LatLng(waypoint.Latitude, waypoint.Longitude);
			} else if (waypoint.AddressLine) {
				start = waypoint.AddressLine;
			} else {
				start = waypoint.Address;
			}

			waypoint = wayPoints[wayPoints.length - 1];
			if (waypoint.Latitude && waypoint.Longitude && this.isLatLongValid(waypoint)) {
				end = new google.maps.LatLng(waypoint.Latitude, waypoint.Longitude);
			} else if (waypoint.AddressLine) {
				end = waypoint.AddressLine;
			} else {
				end = waypoint.Address;
			}

			const wps = [];
			for (let i = 1; i < wayPoints.length - 1; ++i) {
				waypoint = wayPoints[i];
				if (waypoint.Latitude && waypoint.Longitude && this.isLatLongValid(waypoint)) {
					wps.push({ location: new google.maps.LatLng(waypoint.Latitude, waypoint.Longitude) });
				} else if (waypoint.AddressLine) {
					wps.push({ location: waypoint.AddressLine });
				} else {
					wps.push({ location: waypoint.Address });
				}
			}

			this.directionsService.route(
				{
					origin: start,
					destination: end,
					waypoints: wps,
					travelMode: 'DRIVING',
				},
				(response: IGoogleMapRouteResponce, status: string) => {
					if (status === 'OK') {
						this.directionsDisplay.setDirections(response);
						const legs = response.routes[0].legs;
						_.each(legs, (leg) => {
							data.distances.push(leg.distance.text);
						});
						resolve(data);
					} else {
						window.alert('Directions request failed due to ' + status);
					}
				},
			);
		});

		return distance;
	}

	/**
	 * Creates snapshot url.
	 * @param map Map instance.
	 * @param mapDimensions Container dimensions.
	 * @returns Snap shot url.
	 */
	public getMapSnapshotURL(map: GoogleMapService | BaiduMapService | BingMapService | OpenstreetMapService, mapDimensions: IMapContainerDimensions) {
		if ((map as GoogleMapService).directionsDisplay.directions && (map as GoogleMapService).directionsDisplay.directions.geocoded_waypoints.length > 1) {
			return this.getMapSnapshotURLForRoute(map as GoogleMapService, mapDimensions);
		} else {
			return this.getMapSnapshotURLForPinpoint(map as GoogleMapService, mapDimensions);
		}
	}

	/**
	 * Creates snap shot url for route.
	 * @param map Map instance.
	 * @param mapDimensions Container dimensions.
	 * @returns Snap shot url.
	 */
	public getMapSnapshotURLForRoute(map: GoogleMapService, mapDimensions: IMapContainerDimensions) {
		let httpString = '';
		const mapData = map.map.data.map;
		const polyline = map.directionsDisplay.directions.routes[0].overview_polyline;
		const zoom = map.directionsDisplay.map.zoom;

		httpString =
			this.snapshotURL +
			mapDimensions.width +
			'x' +
			mapDimensions.height + // map dimensions must be a square
			'&center=' +
			mapData.center.lat() +
			',' +
			mapData.center.lng() +
			'&markers=size:mid%7Ccolor:red%7C';
		httpString += map.directionsDisplay.directions.routes[0].legs[0].start_location.lat() + ',' + map.directionsDisplay.directions.routes[0].legs[0].start_location.lng() + '|';
		map.directionsDisplay.directions.routes[0].legs.forEach((leg: IRouteLeg) => {
			httpString += leg.end_location.lat() + ',' + leg.end_location.lng() + '|';
		});
		httpString = httpString.substring(0, httpString.length - 1);

		httpString += '&zoom=' + zoom + '&path=weight:6%7Ccolor:blue%7Cenc:' + polyline + '&key=' + this.key;
		return httpString;
	}

	/**
	 * Creates snapshot url for pinpoint.
	 * @param map Map instance.
	 * @param mapDimensions Container dimensions.
	 * @returns Snap shot url.
	 */
	public getMapSnapshotURLForPinpoint(map: GoogleMapService, mapDimensions: IMapContainerDimensions) {
		let httpString = '';
		const mapData = map.map.data.map;
		const zoom = map.directionsDisplay.map.zoom;

		httpString =
			this.snapshotURL +
			mapDimensions.width +
			'x' +
			mapDimensions.height + // map dimensions must be a square
			'&center=' +
			mapData.center.lat() +
			',' +
			mapData.center.lng() +
			'&markers=size:mid%7Ccolor:red%7C';

		httpString += map.selectedPin.position.lat() + ',' + map.selectedPin.position.lng();

		httpString += '&zoom=' + zoom + '&key=' + this.key;
		return httpString;
	}

	/**
	 * Opens map into new tab.
	 * @param entityData location information.
	 */
	public showMapToNewTab(entityData: IAddressEntity) {
		const url = '//maps.google.com' + '/?q=' + entityData.Latitude + ',' + entityData.Longitude;

		window.open(url, '_blank');
	}
}
