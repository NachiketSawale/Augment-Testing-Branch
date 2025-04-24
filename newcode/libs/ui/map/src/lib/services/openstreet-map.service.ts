/*
 * Copyright(c) RIB Software GmbH
 */
//TODO any, will be removed in future.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const L: any;

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as _ from 'lodash';

import { MapUtilityService } from './map-utility.service';
import { PlatformTranslateService } from '@libs/platform/common';
import { MapBaseService } from './map-base.service';

import { IMapOptions } from '../model/interfaces/map-options-info.interface';
import { IMarkOptions } from '../model/interfaces/mark-options.interface';
import { IAddressEntity } from '../model/interfaces/address-entity.interface';
import { ILocation } from '../model/interfaces/location.interface';
import { ISearchOptions } from '../model/interfaces/search-options.interface';
import { ISearchAddressEntity } from '../model/interfaces/search-address-entity.interface';
import { ISearchAddressResponse } from '../model/interfaces/openstreet-map/search-address-response.interface';
import { IMapClickEvent } from '../model/interfaces/openstreet-map/map-click-event.interface';

/**
 * Handle open street map functionality.
 */
@Injectable({
	providedIn: 'root',
})
export class OpenstreetMapService extends MapBaseService {
	/**
	 * leafletjsUrlBase.
	 */
	public leafletjsUrlBase = '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.5/';

	/**
	 * Address2LatLngUrl from address to lat lng
	 */
	public address2LatLngUrl = '//nominatim.openstreetmap.org/search';

	/**
	 * AddressReverseUrl from lat,lng to address
	 */
	public addressReverseUrl = '//nominatim.openstreetmap.org/reverse';

	/**
	 * Map instance.
	 */
	public map: typeof L | null = null;

	/**
	 * Marked instance.
	 */
	public marker: typeof L | null = null;

	/**
	 * marker list.
	 */
	public markerList: (typeof L)[] = [];

	/**
	 * Event instance.
	 */
	public clickMapId: typeof L.Maps.Events | null = null;

	/**
	 * Map key service.
	 */
	private mapKeyService = inject(MapUtilityService);

	/**
	 * inject the PlatformTranslateService
	 */
	public readonly translate = inject(PlatformTranslateService);

	/**
	 * HttpClient instance.
	 */
	private http = inject(HttpClient);

	/**
	 * Load map API.
	 */
	public override loadScript() {
		// load css
		const cssUrl = this.leafletjsUrlBase + 'leaflet.css';
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = '' + cssUrl + '';
		document.body.appendChild(link);

		// Add script dynamically.
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.onerror = () => {
			this.isApiLoading = false;
			this.isApiLoadFailed = true;
		};

		script.src = this.leafletjsUrlBase + 'leaflet.js';
		document.body.appendChild(script);

		this.isApiLoading = true;

		return new Promise((res, rej) => {
			script.onload = () => {
				res('loaded');
			};
			script.onerror = () => {
				rej('reject');
			};
		});
	}

	public override init() {
		// osm map instance
		// empty leaflet object
		// if map is instanced, return.
		if (this.element._leaflet && this.element.innerHTML) {
			return;
		}
		this.element._leaflet = false;
		this.element.innerHTML = '';
		this.map = new L.Map(this.element).setView([0, 0], 13);

		// set tile layer
		L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			noWrap: true, // set only on map,no repeat
		}).addTo(this.map);

		// set the osm logo at bottom right
		this.map.attributionControl.setPrefix('<a target="_blank" href="https://www.leafletjs.com">leaflet</a> | ' + '&copy; <a target="_blank" href="https://www.osm.org/copyright">OpenStreetMap</a> contributors');
	}

	/**
	 * find address by lat-lon
	 * @param lat number.
	 * @param lon number.
	 */
	public geoLocation2address(lat: number, lon: number) {
		const newAddressEntity = {
				Address: '',
				AddressModified: true,
			};
			const addressParts = {
				Street: 'street',
				City: 'city',
				County: 'county',
				ZipCode: 'postcode',
				CountryCodeISO2: 'country_code',
			};
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const extractAddress = (jsonResponse: any) => {
				//TODO any, will be removed in future.
				const result = jsonResponse || {};
				if (!result.address) {
					result.address = {}; // the address parts contains city, street...
				}

				// change the address info
				_.map(addressParts, (val, key) => {
					//TODO any, will be removed in future.
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(newAddressEntity as any)[key] = result.address[val.toLowerCase()] || '';
				});
				(newAddressEntity as ISearchAddressEntity).Address = result.display_name || '';
			};
		const data = {
			format: 'json', // return json format
			addressdetails: '1',
			lat: lat,
			lon: lon,
		};
		return this.http.get(this.addressReverseUrl, { params: data }).subscribe((res) => {
			extractAddress(res);
			this.dataOnMapClick$.next({
				latitude: lat,
				longitude: lon,
				addressEntity: newAddressEntity,
			});
		});
	}

	/**
	 * listen click event of map.
	 */
	public mapClickEvent() {
		this.clickMapId = this.map.on('click', (e: IMapClickEvent) => {
			try {
				this.geoLocation2address(e.latlng.lat, e.latlng.lng);
			} catch (err) {
				throw new Error('address not found');
			}
		});
	}

	/**
	 * Remove click event.
	 */
	public override destroy() {
		this.map.removeEventListener('click');
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
				this.map.removeLayer(this.marker);
			}
			return;
		}

		const position = [markOptions.latitude, markOptions.longitude];

		// clear marker.
		if (this.marker) {
			this.map.removeLayer(this.marker);
		}

		// clear popup
		this.map.closePopup();

		// add new marker
		this.marker = L.marker(position, {
			icon: new L.Icon.Default({
				iconUrl: 'https:' + this.leafletjsUrlBase + 'images/marker-icon.png',
				shadowUrl: 'https:' + this.leafletjsUrlBase + 'images/marker-shadow.png',
				// width:'25px',height:'41px'
			}),
		})
			.addTo(this.map)
			.bindPopup(markOptions.address);

		if ((this.options as IMapOptions).showInfoBox) {
			this.marker.openPopup();
		}

		if (!markOptions.disableSetCenter) {
			this.map.setView(position, '16');
		}
	}

	/**
	 * Clear mark.
	 */
	public clearMarker() {
		this.markerList.forEach((marker) => {
			this.map.removeLayer(marker);
		});
		this.markerList = [];
	}

	/**
	 * Marks multiple locations.
	 * @param markItemList locations info.
	 */
	public markMultiple(markItemList: IAddressEntity[]) {
		const pinShadowImage = 'https:' + this.leafletjsUrlBase + 'images/marker-shadow.png';
		const pinDefaultImage = 'https:' + this.leafletjsUrlBase + 'images/marker-icon.png';
		const pinSelectedImage = 'cloud.style/content/images/control-icons.svg#ico-pushpin-openstreet';
		this.clearMarker();
		let selectedPin: typeof L | null = null;
		let selectedCenter = null;
		markItemList.forEach((markItem: IAddressEntity) => {
			const markdata: IMarkOptions = {
				latitude: markItem.Latitude,
				longitude: markItem.Longitude,
				address: markItem.Address,
			};

			if (!this.mapKeyService.isLatLongValid(markdata)) {
				return;
			}
			const position = [markItem.Latitude, markItem.Longitude];

			// clear popup
			this.map.closePopup();

			// add new marker
			let marker = L.marker(position, {
				icon: new L.Icon.Default({
					iconUrl: pinDefaultImage,
					shadowUrl: pinShadowImage,
					// width:'25px',height:'41px'
				}),
			});

			if (markItem.isSelected) {
				marker = L.marker(position, {
					icon: new L.Icon.Default({
						iconUrl: pinSelectedImage,
						shadowUrl: pinShadowImage,
						iconSize: [40, 40],
					}),
				});
				selectedPin = marker;
				selectedCenter = position;
			}

			marker.addTo(this.map).bindPopup(markItem.Address);

			this.markerList.push(marker);

			if ((this.options as IMapOptions).showInfoBox) {
				marker.openPopup();
			}
		});

		if (selectedPin && selectedCenter) {
			selectedPin.openPopup();
		}

		this.map.fitBounds(this.createBound(markItemList));
		this.map.setZoom(3);
	}

	/**
	 * Creates bound for mark.
	 * @param markItemList locations info.
	 * @returns fromEdges.
	 */
	public createBound(markItemList: IAddressEntity[]) {
		const extremeValues = this.mapKeyService.getExtremes(markItemList);
		const bounds = [
			[extremeValues.maxLat, extremeValues.minLong],
			[extremeValues.minLat, extremeValues.maxLong],
		];
		return bounds;
	}

	/**
	 * Show message if address not found on the map
	 */
	public addressNotFound() {
		const latlng = [0, 0],
			zoom = 2;
		this.map.setView(latlng, zoom);
		// show a message popup
		L.popup().setLatLng(latlng).setContent(this.translate.instant('ui.map.addressNotFound').text).openOn(this.map);
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

		const data = {
			format: 'json', // return json format
			limit: 1, // limit the number of returned results
		};
		// find lon, lat by address string
		this.http.get(this.address2LatLngUrl + '?q=' + searchOptions.entity.City, { params: data }).subscribe({
			next: (res) => {
				try {
					const data = res as ISearchAddressResponse[];
					const result = data[0],
						entity = {
							Address: result.display_name,
							AddressModified: true,
						},
						location = {
							address: result.display_name, // jshint ignore:line
							latitude: result.lat,
							longitude: result.lon,
							addressEntity: entity,
						};
					this.mark(location);
					successCallback(location);
				} catch (e) {
					this.mark(null); // clear old mark.
					successCallback(null); // clear old latitude and longitude.
					this.addressNotFound();
				}
			},
			error: () => {
				throw new Error('Address not found');
			},
		});
	}

	/**
	 * To show route between two location.
	 * @param data address entity.
	 * @returns promise.
	 */
	public showRoutes$(data: IAddressEntity[]) {
		return new Promise((resolve) => {
			resolve(data);
		});
	}

	/**
	 * MapSnapshotURL.
	 */
	public getMapSnapshotURL() {}

	/**
	 * Opens map into new tab.
	 * @param entityData location information.
	 */
	public showMapToNewTab(entityData: IAddressEntity) {
		let url = '//www.openstreetmap.org';
		url += _.template('/?mlat=<%=lat%>&mlon=<%=lon%>#map=15/<%=lat%>/<%=lon%>')({
			lat: entityData.Latitude,
			lon: entityData.Longitude,
		});

		window.open(url, '_blank');
	}
}
