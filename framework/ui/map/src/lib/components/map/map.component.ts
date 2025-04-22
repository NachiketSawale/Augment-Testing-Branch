/**
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MapUtilityService } from '../../services/map-utility.service';
import { GoogleMapService } from '../../services/google-map.service';
import { BingMapService } from '../../services/bing-map.service';
import { OpenstreetMapService } from '../../services/openstreet-map.service';
import { BaiduMapService } from '../../services/baidu-map.service';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';

import { MapReadOnlyHandler } from '../../model/class/map-readonly-handler';
import { MapEditableHandler } from '../../model/class/map-editable-handler';

import { IAddressEntity } from '../../model/interfaces/address-entity.interface';

import { MapProviders } from '../../model/enums/map-providers.enum';

/**
 * Select map according to mapOptions and render that map.
 */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'ui-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
	/**
	 * Address entities.
	 */
	@Input() public entity!: IAddressEntity[] | IAddressEntity;

	/**
	 * Show routes flag.
	 */
	@Input() public showRoutes!: boolean;

	/**
	 * Calculate distance flag.
	 */
	@Input() public canCalculateDist!: boolean;

	/**
	 * Map editable flag.
	 */
	@Input() public editable!: boolean;

	/**
	 * Map status.
	 */
	public isMapEditable = false;

	/**
	 * Pick location flag on map click.
	 */
	public pickLocation = false;

	/**
	 * MapKeyService instance.
	 */
	private mapKeyService = inject(MapUtilityService);

	/**
	 * GoogleMapService instance.
	 */
	public googleMapService = inject(GoogleMapService); //todo-Sachin: is it possible to init the map service based on map setting?

	/**
	 * BingMapService instance.
	 */
	public bingMapService = inject(BingMapService); //todo-Sachin: is it possible to init the map service based on map setting?

	/**
	 * OpenstreetMapService instance.
	 */
	public openstreetMapService = inject(OpenstreetMapService); //todo-Sachin: is it possible to init the map service based on map setting?

	/**
	 * BaiduMapService instance.
	 */
	public baiduMapService = inject(BaiduMapService); //todo-Sachin: is it possible to init the map service based on map setting?

	/**
	 * inject the PlatformTranslateService
	 */
	public readonly translate = inject(PlatformTranslateService);

	/**
	 * Context service instance.
	 */
	private readonly platformConfigurationService = inject(PlatformConfigurationService);

	/**
	 * HttpClient instance.
	 */
	private http = inject(HttpClient);

	/**
	 * ConfigurationService instance.
	 */
	private configurationService = inject(PlatformConfigurationService);

	/**
	 * Stores MapEditableHandler or MapReadOnlyHandler instance.
	 */
	public mapHandler!: MapEditableHandler | MapReadOnlyHandler;

	/**
	 * Stores map instance.
	 */
	public mapService!: GoogleMapService | BingMapService | OpenstreetMapService | BaiduMapService;

	/**
	 * Stores map options.
	 */
	private mapOptionsInfo = { showInfoBox: false };

	/**
	 * Selects particular map and load its API also mapHandler updated.
	 */
	public ngOnInit() {
		this.editable ? (this.mapHandler = new MapEditableHandler(this.translate, this.http, this.configurationService)) : (this.mapHandler = new MapReadOnlyHandler());
		this.handleMapChanged();
	}

	/**
	 * Choose particular map using map options and load it's API.
	 */
	public handleMapChanged() {
		this.mapKeyService.getMapOptions$().then((data) => {
			switch (data.Provider) {
				case MapProviders.bing:
				case MapProviders.bingv8:
					this.mapService = this.bingMapService;
					this.mapService.key = data.BingKey;
					this.mapService.mapApiUrl = this.mapService.apiUrl + '?mkt=' + this.platformConfigurationService.savedOrDefaultUiCulture;
					break;
				case MapProviders.google:
					this.mapService = this.googleMapService;
					this.mapService.key = data.GoogleKey;
					this.mapService.mapApiUrl = this.mapService.apiUrl + data.GoogleKey;
					break;
				case MapProviders.baidu:
					this.mapService = this.baiduMapService;
					this.mapService.mapApiUrl = this.mapService.apiUrl + data.BaiduKey + '&callback=null';
					break;
				case MapProviders.openstreet:
					this.mapService = this.openstreetMapService;
			}

			if (!this.mapService.isApiLoaded) {
				this.mapService.loadScript().then((data) => {
					if (data === 'loaded') {
						setTimeout(() => {
							this.mapService.isApiLoaded = true;
							this.mapService.isApiLoading = false;
							this.onApiLoaded();
						}, 1000);
					} else {
						throw new Error('API load failed');
					}
				});
			} else {
				this.onApiLoaded();
			}
		});
	}

	/**
	 * Initialize map and load it using class.
	 */
	public onApiLoaded() {
		this.mapHandler.mapServiceInstance = this.mapService;
		const options = {
				mapOptions: this.mapHandler.mapOptions,
				showInfoBox: this.mapOptionsInfo.showInfoBox,
			},
			mapContent = document.getElementsByClassName('map-content');

		this.mapService.element = mapContent[0] as HTMLElement;
		this.mapService.options = options;
		this.mapService.init();

		this.mapHandler.onMapApiReady({ entity: this.entity, showRoutes: this.showRoutes, calculateDist: this.canCalculateDist });

		this.isEditable();
	}

	/**
	 * Handel changing mark on map click.
	 */
	public selectLocation() {
		this.pickLocation = !this.pickLocation;
		if (this.pickLocation) {
			this.mapService.mapClickEvent();
			this.mapHandler.onMapClick();
		} else {
			this.mapService.destroy();
		}
	}

	/**
	 * Opens map into new tab.
	 */
	public openMapInNewTab() {
		this.mapService.showMapToNewTab((this.mapHandler as MapEditableHandler).entityData.entity);
	}

	/**
	 * Sets status of isMapEditable.
	 */
	public isEditable() {
		return this.mapHandler.className === 'basicsCommonMapEditableHandler' ? (this.isMapEditable = true) : (this.isMapEditable = false);
	}
}
