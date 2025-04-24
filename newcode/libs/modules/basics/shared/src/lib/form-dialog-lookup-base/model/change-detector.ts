/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { debounceTime, Observable, Subject } from 'rxjs';

/**
 * Represent the change information.
 */
export type State = { property: string; oldValue?: unknown; newValue?: unknown };

/**
 * A detector that can detect the properties change state in the specified object.
 * TODO: Is it really needed?
 */
export class ChangeDetector<TItem extends object> {
	private debounceTime = 300;
	private oldMap = new Map<string, unknown>();
	private watchMap = new Map<string, Subject<State>>();
	private watchCollectionMap = new Map<string, Subject<State[]>>();
	private readonly getEntity: () => TItem;

	/**
	 *
	 * @param getEntity
	 */
	public constructor(getEntity: () => TItem) {
		this.getEntity = getEntity;
	}

	/**
	 *
	 * @param entity
	 * @param property
	 * @private
	 */
	private getValue(entity: TItem, property?: string): unknown {
		const paths = (property ?? '').split('.');
		let path = paths.shift();
		const entityObj = entity as { [k: string]: unknown };
		let value = path ? entityObj[path] : undefined;
		while ((path = paths.shift())) {
			if (typeof value === 'object') {
				const obj = value as { [k: string]: unknown };
				value = obj[path];
			}
		}

		return value;
	}

	/**
	 *
	 * @param property
	 * @private
	 */
	private initializeMap(property: string) {
		const entity = this.getEntity();
		const value = entity ? this.getValue(entity, property) : undefined;
		this.oldMap.set(property, value);
	}

	/**
	 *
	 * @param key
	 * @private
	 */
	private keyToProperties(key: string) {
		return key.split('#');
	}

	/**
	 *
	 * @param properties
	 * @private
	 */
	private propertyToKey(properties: string[]) {
		return properties.join('#');
	}

	/**
	 *
	 * @param states
	 * @private
	 */
	private singleWatch(states: State[]) {
		states.forEach(state => {
			this.initializeMap(state.property);
			this.watchMap.get(state.property)?.next(state);
		});
	}

	/**
	 *
	 * @param states
	 * @private
	 */
	private collectionWatch(states: State[]) {
		for (const [key, subject] of this.watchCollectionMap.entries()) {
			const properties = this.keyToProperties(key);
			const values = states.filter(state => {
				return properties.some(prop => state.property === prop);
			});
			if (values.length) {
				subject.next(values);
			}
		}
	}

	/**
	 * Once the property changed then emits the change.
	 * @param property The property would be watch once the relevant value changed.
	 * @param dueTime The debounce time for fire the changes.
	 */
	public watch(property: string, dueTime?: number): Observable<State> {
		if (!this.oldMap.has(property)) {
			this.initializeMap(property);
		}

		if (!this.watchMap.has(property)) {
			this.watchMap.set(property, new Subject<State>());
		}

		const subject = this.watchMap.get(property) as Subject<State>;
		return subject.pipe(debounceTime(dueTime ?? this.debounceTime));
	}

	/**
	 * Once any one of properties changed then emits the changes.
	 * @param properties The properties would be watch once the relevant value changed.
	 * @param dueTime The debounce time for fire the changes.
	 */
	public watchCollection(properties: string[], dueTime?: number): Observable<State[]> {
		properties.forEach(property => {
			if (!this.oldMap.has(property)) {
				this.initializeMap(property);
			}
		});

		const key = this.propertyToKey(properties);
		if (!this.watchCollectionMap.has(key)) {
			this.watchCollectionMap.set(key, new Subject<State[]>());
		}

		const subject = this.watchCollectionMap.get(key) as Subject<State[]>;
		return subject.pipe(debounceTime(dueTime ?? this.debounceTime));
	}

	/**
	 * Start change detection.
	 */
	public digest() {
		const entity = this.getEntity();
		if (!entity) {
			return;
		}
		const states = [...this.oldMap.keys()]
			.filter(key => {
				return this.oldMap.get(key) !== this.getValue(entity, key);
			})
			.map(key => {
				return {
					property: key,
					oldValue: this.oldMap.get(key),
					newValue: this.getValue(entity, key)
				};
			});

		if (!states.length) {
			return;
		}

		this.singleWatch(states);

		this.collectionWatch(states);
	}
}