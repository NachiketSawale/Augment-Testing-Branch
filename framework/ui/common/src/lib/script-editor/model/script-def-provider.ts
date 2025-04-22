/*
 * Copyright(c) RIB Software GmbH
 */

import * as _ from 'lodash';
import { Def } from 'tern/lib/tern';
import { map, of, defer } from 'rxjs';

import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PlatformConfigurationService } from '@libs/platform/common';
import { IScriptDefProvider } from './interfaces/script-def-provider.interface';
import { ecmascript } from './ecmascript';

export class ScriptDefProvider implements IScriptDefProvider {

	private configService = inject(PlatformConfigurationService);

	private defUrl = '';
	private defUrl2 = '';

	private _isApiLoaded = false;
	private _varDef: Def = {'!name': 'variables'};

	/**
	 * Api identifier
	 */
	public apiId?: string;

	/**
	 * Api version
	 */
	public apiVersion?: number;

	/**
	 * Api definition
	 */
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
	public apiDefs: Def[] = [ecmascript];

	/**
	 * Translation source
	 */
	public trSource?: string;

	private readonly http = inject(HttpClient);

	/**
	 *
	 * @param id
	 */
	public constructor(private id: string) {
		this.defUrl = this.configService.webApiBaseUrl + 'basics/common/script/def';
		this.defUrl2 = this.configService.webApiBaseUrl + 'basics/common/script/def2';
	}

	public clear() {

	}

	public resetVariable() {
		this._varDef = {'!name': 'variables'};
	}

	public addVariable(items: { name: string, type: string, description: string }[]) {
		items.forEach(item => {
			this._varDef[item.name] = {
				'!type': item.type,
				'!doc': item.description,
				'!url': ''
			};
		});
	}

	public getDefs() {
		return defer(() => {
			return this._isApiLoaded ? of(true) : this.load();
		}).pipe(map(() => {
			return this.apiDefs.concat([this._varDef]);
		}));
	}

	private load() {
		return defer(() => {
			if (this.apiId) {
				const url = (this.apiVersion === 2 ? this.defUrl2 : this.defUrl) + '?apiId=' + this.apiId;

				return this.http.get(url).pipe(map(res => {
					if (this.trSource) {
						this.translate(res as Def, this.trSource);
					}

					this.apiDefs.push(res as Def);

					return true;
				}));
			} else {
				return of(true);
			}
		});
	}

	private translate(def: Def, prefix: string) {
		if (def == null || !prefix) {
			return;
		}

		for (const pn in def) {
			if (Object.prototype.hasOwnProperty.call(def, pn)) {
				if (pn === '!doc') {
					const name = prefix + '.' + '!doc';
					//const tr = $translate.instant(name);
					// todo-wui: translation
					const tr = name;

					if (tr && tr.length && tr !== name) {
						def[pn] = tr;
					}
				} else {
					const value = def[pn];
					const newPrefix = prefix + '.' + pn;

					if (_.isObject(value)) {
						this.translate(value as Def, newPrefix);
					}
				}
			}
		}
	}
}