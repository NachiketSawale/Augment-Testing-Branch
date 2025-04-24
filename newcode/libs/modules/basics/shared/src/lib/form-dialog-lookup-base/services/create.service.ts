/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ICreateOptions } from './../';
import { PlatformAuthService } from '@libs/platform/authentication';
import { PlatformConfigurationService } from '@libs/platform/common';

/**
 * User data value definition to storage.
 */
export type UserDataValue = {
	time: number;
	value: unknown;
};

/**
 * User data definition to storage.
 */
export type UserData<Type> = {
	[Property in keyof Type]: UserDataValue;
};

@Injectable({
	providedIn: 'root'
})
export class BasicsSharedCreateService {
	private httpClient = inject(HttpClient);
	private authService = inject(PlatformAuthService);
	private configService = inject(PlatformConfigurationService);
	private readonly durationTime = 7 * 24 * 60 * 60 * 1000;
	private readonly userDataKey: string = '';
	private storage = window.localStorage;
	private userId: string = '';

	/**
	 * Default constructor.
	 */
	public constructor() {
		this.userDataKey = this.configService.appBaseUrl + 'userData';
		this.authService.getUserData().subscribe((user: { user_id: string }) => {
			this.userId = user.user_id;
		});
	}

	private getStorageItem(key: string): object {
		const stringValue = this.storage.getItem(key);
		return stringValue ? JSON.parse(stringValue) : {};
	}

	private setStorageItem(key: string, value: object) {
		this.storage.setItem(key, JSON.stringify(value));
	}

	/**
	 * Create new TItem.
	 * @param options
	 * @param entity
	 */
	public create<TItem extends object, TEntity extends object>(options: ICreateOptions<TItem, TEntity>, entity: TEntity): Observable<TItem> {
		let request = {};
		if (options.initCreationData) {
			request = options.initCreationData(request, entity);
		}

		const urlParams = options.useUrlPost ? '' : Object.keys(request).map(key => {
			return `${key}=${_.get(request, key)}`;
		}).join('&');

		const response = options.useUrlPost
			? this.httpClient.post<TItem>(this.configService.webApiBaseUrl + options.createUrl, request)
			: this.httpClient.get<TItem>(this.configService.webApiBaseUrl + options.createUrl + (urlParams ? '?' + urlParams : ''));

		return response.pipe(
			map(value => {
				return typeof options.handleCreateSucceeded === 'function' ? options.handleCreateSucceeded(value, entity) : value;
			})
		);
	}

	/**
	 *
	 * @param userData
	 */
	public setUserDataCache<T extends object>(userData: Partial<T>) {
		const cacheData = this.getStorageItem(this.userDataKey);
		const finalUserData = {} as UserData<T>;
		Object.keys(userData).forEach(key => {
			_.set(finalUserData, key, {
				value: _.get(userData, key),
				time: Date.now()
			});
		});

		_.set(cacheData, this.userId, finalUserData);
		this.setStorageItem(this.userDataKey, cacheData);
	}

	/**
	 *
	 */
	public getUserDataCache<T extends object>(): UserData<T> {
		const cacheData = this.getStorageItem(this.userDataKey);
		let userData = _.get(cacheData, this.userId) as UserData<T>;
		if (userData) {
			const finalUserData = {} as UserData<T>;
			Object.keys(userData).forEach(key => {
				const objValue = _.get(userData, key) as UserDataValue;
				if (objValue && objValue.time && (objValue.time + this.durationTime > Date.now())) {
					_.set(finalUserData, key, objValue);
				}
			});
			userData = finalUserData;
		}
		return userData;
	}
}
