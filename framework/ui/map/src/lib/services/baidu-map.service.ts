/*
 * Copyright(c) RIB Software GmbH
 */
//TODO any will be removed in future.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const BMap: any;

import { Injectable, inject } from '@angular/core';

import * as _ from 'lodash';

import { MapUtilityService } from './map-utility.service';
import { MapBaseService } from './map-base.service';

import { IMapOptions } from '../model/interfaces/map-options-info.interface';
import { IMarkOptions } from '../model/interfaces/mark-options.interface';
import { IAddressEntity } from '../model/interfaces/address-entity.interface';
import { ISearchOptions } from '../model/interfaces/search-options.interface';
import { ILocation } from '../model/interfaces/location.interface';
import { ISearchAddressEntity } from '../model/interfaces/search-address-entity.interface';
import { IMapClickEvent } from '../model/interfaces/baidu-map/map-click-event.interface';
import { IClickEventPoint } from '../model/interfaces/baidu-map/click-event-point.interface';
import { IGeocoderResult } from '../model/interfaces/baidu-map/geocoder-result.interface';

/**
 * Handle baidu map functionality.
 */
@Injectable({
	providedIn: 'root',
})
export class BaiduMapService extends MapBaseService {
	/**
	 * Map instance.
	 */
	public map: typeof BMap | null = null;

	/**
	 * Map geocoder.
	 */
	public geocoder: typeof BMap | null = null;

	/**
	 * Event instance.
	 */
	public clickMapId: typeof BMap.Maps.Events | null = null;

	/**
	 * Marker.
	 */
	public marker: typeof BMap.Marker | null = null;

	/**
	 * marker list.
	 */
	public markerList: (typeof BMap)[] = [];

	//todo-Sachin: info only, I add my below comment back since it is useful info for future reference.

	// @mike:only v2.0 js api or above can support https. s=1 enable https.
	/**
	 * Baidu API url.
	 */
	public apiUrl = 'https://api.map.baidu.com/api?v=2.0&s=1&ak=';

	/**
	 * Map key service.
	 */
	private mapKeyService = inject(MapUtilityService);

	/**
	 * Initialize baidu map.
	 */
	public override init() {
		const defaults = {
				zoom: 11,
				center: new BMap.Point(116.404, 39.915), // beijing
			},
			settings = Object.assign({}, defaults, (this.options as IMapOptions).mapOptions);

		// baidu map instance
		this.map = new BMap.Map(this.element);

		this.map.centerAndZoom(settings.center, settings.zoom);

		this.map.addControl(new BMap.MapTypeControl());
		this.map.addControl(new BMap.NavigationControl());
		this.map.setCurrentCity('北京'); // mandatory
		this.map.enableScrollWheelZoom(true);

		// baidu geocoder
		this.geocoder = new BMap.Geocoder();
	}

	/**
	 * map onclick handle function
	 * @param e
	 */
	public clickHandle = (e: IMapClickEvent) => {
		this.geoLocation2address(e.point.lat, e.point.lng);
	};

	/**
	 * listen click event of map.
	 */
	public mapClickEvent() {
		this.clickMapId = this.map.addEventListener('click', this.clickHandle);
	}

	/**
	 * find address by lat-lon
	 * @param lat number.
	 * @param lon number.
	 */
	public geoLocation2address(lat: number, lon: number) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const extractAddress = (result: any) => {
			//TODO any will be removed in future.
			const addressComponents = result.addressComponents || {}, // jshint ignore:line
				newAddressEntity = {
					AddressModified: true,
					Address: result.address, // jshint ignore:line
				},
				info = {
					Street: ['street', 'streetNumber'],
					City: ['city'],
					County: ['province'],
					ZipCode: ['postalCode'], // no, this info from baidu
					CountryCodeISO2: ['countryCodeISO2'], // no, this info from baidu
				};

			_.map(info, (val, key) => {
				const addrInfo: string[] = [];
				_.map(val, (property: string) => {
					addrInfo.push(addressComponents[property] || '');
				});
				//TODO any will be removed in future.
				
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(newAddressEntity as any)[key] = _.uniq(addrInfo).join(' ');
			});

			// no test two info from baidu
			(newAddressEntity as ISearchAddressEntity).ZipCode = '';
			(newAddressEntity as ISearchAddressEntity).CountryCodeISO2 = 'CN';

			return newAddressEntity;
		};

		this.geocoder.getLocation(new BMap.Point(lon, lat), (result: IGeocoderResult) => {
			let newAddress = null;
			if (result.address) {
				newAddress = extractAddress(result);
			} else {
				throw new Error('Baidu Map geo error: No address found');
			}

			this.dataOnMapClick$.next({
				latitude: lat,
				longitude: lon,
				addressEntity: newAddress,
			});
		});
	}

	/**
	 * Remove click event.
	 */
	public override destroy() {
		this.map.removeEventListener('click', this.clickHandle);
	}

	/**
	 * Add mark on the map.
	 * @param markOptions location info.
	 * @returns null
	 */
	public mark(markOptions: IMarkOptions | null) {
		if (markOptions) {
			if (!this.mapKeyService.isLatLongValid(markOptions)) {
				return;
			}

			this.map.clearOverlays(); // clear old mark.

			const position = new BMap.Point(markOptions.longitude, markOptions.latitude);

			this.marker = new BMap.Marker(position, { title: markOptions.address });
			this.map.addOverlay(this.marker);
			if (!markOptions.disableSetCenter) {
				this.map.setCenter(position);
			}
		}
	}

	/**
	 * Clear mark.
	 */
	public clearMarker() {
		this.map.clearOverlays();
		this.markerList = [];
	}

	/**
	 * Marks multiple locations.
	 * @param markItemList locations info.
	 */
	public markMultiple(markItemList: IAddressEntity[]) {
		this.clearMarker();
		markItemList.forEach((markItem: IAddressEntity) => {
			const markdata: IMarkOptions = {
				latitude: markItem.Latitude,
				longitude: markItem.Longitude,
				address: markItem.Address,
			};

			if (!this.mapKeyService.isLatLongValid(markdata)) {
				return;
			}
			const position = new BMap.Point(markItem.Longitude, markItem.Latitude);

			const marker = new BMap.Marker(position, { title: markItem.Address });
			marker.addEventListener('click', () => {
				const opts = {
					// width: 250, // Information window width
					// height: 100, // Information window height
					title: markItem.Address, // Information window title
				};
				// const infoWindow = new BMap.InfoWindow(markItem.formatter ? markItem.formatter(markItem) : markItem.Address, opts);
				const infoWindow = new BMap.InfoWindow(markItem.Address, opts);
				this.map.openInfoWindow(infoWindow, position);
			});

			this.markerList.push(marker);
			this.map.addOverlay(marker);
		});
		this.map.setViewport(this.getBounds(markItemList));
	}

	/**
	 * Creates bound for mark.
	 * @param markItemList locations info.
	 * @returns fromEdges.
	 */
	public getBounds(markItemList: IAddressEntity[]) {
		const extremes = this.mapKeyService.getExtremes(markItemList);
		const point1 = new BMap.Point(extremes.minLong, extremes.maxLat);
		const point2 = new BMap.Point(extremes.maxLong, extremes.minLat);
		return [point1, point2];
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

		this.geocoder.getPoint(
			searchOptions.address,
			(point: IClickEventPoint) => {
				try {
					const entity = {
						Address: '',
						AddressModified: true,
					};
					const location = {
						address: searchOptions.address, // jshint ignore:line
						latitude: point.lat,
						longitude: point.lng,
						addressEntity: entity,
					};
					this.mark(location);
					successCallback(location);
				} catch (e) {
					this.map.clearOverlays(); // clear old mark.
					successCallback(null); // clear old latitude and longitude.
					throw new Error('Address not found!' + e);
				}
			},
			searchOptions.entity.City, // the city which the address is belonged to
		);
	}

	/**
	 * Show route promise.
	 * @param data Location info.
	 * @returns
	 */
	public showRoutes$(data: IAddressEntity[]) {
		return new Promise((resolve) => {
			resolve(data);
		});
	}

	/**
	 * For Map snapshot url.
	 */
	public getMapSnapshotURL() {}

	/**
	 * Opens map into new tab.
	 * @param entityData location information.
	 */
	public showMapToNewTab(entityData: IAddressEntity) {
		let url = '//api.map.baidu.com';

		url += _.template('/marker?location=<%=lat%>,<%=lon%>&title=<%=title%>&content=<%=content%>&coord_type=gcj02&output=html&src=itwo40.rib-software.com')({
			lat: entityData.Latitude,
			lon: entityData.Longitude,
			title: entityData.Address,
			content: entityData.Address,
		});

		window.open(url, '_blank');
	}
}
