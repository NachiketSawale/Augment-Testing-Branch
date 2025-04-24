/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CompareEvents } from '../model/enums/compare-events.enum';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonCompareEventManagerService {

	private _events: Map<CompareEvents, Subject<unknown>> = new Map<CompareEvents, Subject<unknown>>();

	private getSubject<T>(event: CompareEvents) {
		return this._events.get(event) as Subject<T>;
	}

	public create<T>(event: CompareEvents) {
		if (!this._events.has(event)) {
			this._events.set(event, new Subject<unknown>());
		}
		return this.getSubject<T>(event);
	}

	public subscribe<T>(event: CompareEvents, callback: (value: T) => void) {
		if (!this._events.has(event)) {
			this.create(event);
		}

		const subject = this.getSubject<T>(event);

		return subject.subscribe(callback);
	}
}