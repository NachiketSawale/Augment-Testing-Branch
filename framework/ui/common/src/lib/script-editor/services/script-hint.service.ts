/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IScriptHintProvider } from '../model/interfaces/script-hint-provider.interface';
import { Completion } from '@codemirror/autocomplete';
import { IScriptHintEntity } from '../model/interfaces/script-hint-entity.interface';

/**
 * Script editor config service
 */
@Injectable({
	providedIn: 'root'
})
export class ScriptHintService implements IScriptHintProvider {
	private httpCache: Map<string, object> = new Map();
	private readonly http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);

	/**
	 *
	 */
	public constructor() {

	}

	/**
	 *
	 * @param functionName
	 * @param index
	 * @param argsBefore
	 */
	public getArgHints(functionName: string, index: number, argsBefore?: string[]): Observable<Completion[]> {
		return new Observable<Completion[]>(observer => {
			if (index === 0) {
				const pattern = /set([a-zA-Z_0-9]+)ByCode/i;

				if (pattern.test(functionName)) {
					// TODO: are these lines still required?
					//const matches = pattern.exec(functionName);
					//const propertyName = matches![1];

					// this.getByCodeArgsAsync(propertyName).subscribe((list) => {
					//
					// });

					return;
				}
			}

			observer.next();
			observer.complete();
		});
	}

	/**
	 *
	 */
	public getContext() {

	}

	/**
	 *
	 * @param propertyName
	 */
	public getByCodeArgsAsync(propertyName: string) {
		const context = this.getContext();
		const byCodeHintsUrl = this.configService.webApiBaseUrl + 'basics/common/script/bycodehints?property=' + propertyName;

		if (this.httpCache.has(byCodeHintsUrl)) {
			return this.httpCache.get(byCodeHintsUrl);
		}

		return this.http.post(byCodeHintsUrl, context).pipe((map((res) => {
			const entities = res as Array<IScriptHintEntity>;
			let items: Completion[] = [];

			if (entities && entities.length) {
				items = entities.map(function (entity: IScriptHintEntity) {
					return {
						label: entity.Code,
						info: entity.Code,
						type: '',
						detail: entity.Description
					};
				});
			}

			this.httpCache.set(byCodeHintsUrl, items);

			return items;
		})));
	}
}
