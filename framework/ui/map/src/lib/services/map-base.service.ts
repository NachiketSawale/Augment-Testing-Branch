/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { IHtmlElement } from '../model/interfaces/html-element.interface';
import { IMapOptions } from '../model/interfaces/map-options-info.interface';
import { ILocation } from '../model/interfaces/location.interface';

/**
 * Handle Map functionality.
 */
@Injectable({
	providedIn: 'root',
})
export abstract class MapBaseService {
	/**
	 * HTML element to render map.
	 */
	public element!: IHtmlElement;

	/**
	 * Map options.
	 */
	public options: IMapOptions | null = null;

	/**
	 * API key.
	 */
	public key = '';

	/**
	 * API loading flag.
	 */
	public isApiLoading = false;

	/**
	 * API loaded flag.
	 */
	public isApiLoaded = false;

	/**
	 * API fail flag.
	 */
	public isApiLoadFailed = false;

	/**
	 * data got on map click.
	 */
	public dataOnMapClick$ = new Subject<ILocation>();

	/**
	 * Map API Url.
	 */
	public mapApiUrl = '';

	/**
	 * Load map API.
	 */
	public loadScript() {
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.onerror = () => {
			this.isApiLoading = false;
			this.isApiLoadFailed = true;
		};

		script.src = this.mapApiUrl;
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

	/**
	 * Initialize Map.
	 */
	public init() {}

	/**
	 * Remove map click event.
	 */
	public destroy() {}
}
