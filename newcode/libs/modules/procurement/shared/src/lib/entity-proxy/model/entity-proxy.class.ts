/*
 * Copyright(c) RIB Software GmbH
 */

import { isPlainObject } from 'lodash';
import { Subject } from 'rxjs';
import { AllKeys } from '@libs/platform/common';
import { IEntityModification } from '@libs/platform/data-access';
import { IPropertyChangedEvent, IEntityProxy } from './interfaces';
import { FieldKind } from './enums/field-kind.enum';

const IsEntityProxySymbol = Symbol('IsEntityProxy');
const OriginalEntitySymbol = Symbol('OriginalEntity');

/**
 * The proxy object for a real entity object which could be used to watch entity property changed.
 */
export class EntityProxy<T extends object> implements IEntityProxy<T> {
	private proxyMap = new WeakMap<T, T>();

	public fieldKindMap: Map<AllKeys<T>, FieldKind>;
	public propertyChanged$ = new Subject<IPropertyChangedEvent<T>>();

	public constructor(
		private tracker: IEntityModification<T>,
		fieldKindMap?: [AllKeys<T>, FieldKind][],
	) {
		this.fieldKindMap = new Map<AllKeys<T>, FieldKind>(fieldKindMap);
	}

	private generatePropertyPath(propertyKey: PropertyKey, subObjectPath?: string) {
		const key = propertyKey.toString();

		if (!subObjectPath) {
			return key;
		}

		return subObjectPath + '.' + key;
	}

	private generateHandler(entity: T, subObjectPath?: string) {
		return {
			get: (target: object, propertyKey: PropertyKey, receiver: unknown) => {
				if (propertyKey === IsEntityProxySymbol) {
					return true;
				}
				if (propertyKey === OriginalEntitySymbol) {
					return target;
				}

				let value = Reflect.get(target, propertyKey, receiver);

				if (isPlainObject(value) && !this.isProxy(value)) {
					value = new Proxy(value, this.generateHandler(entity, this.generatePropertyPath(propertyKey, subObjectPath)));
				}

				return value;
			},
			set: (target: object, propertyKey: PropertyKey, newValue: unknown, receiver: unknown) => {
				let success = true;
				const oldValue = Reflect.get(target, propertyKey, receiver);

				if (oldValue === newValue) {
					return success;
				}

				success = Reflect.set(target, propertyKey, newValue, receiver);

				if (success) {
					const field = <AllKeys<T>>this.generatePropertyPath(propertyKey, subObjectPath);

					this.tracker.setModified(entity);

					this.propertyChanged$.next({
						entity: entity,
						field: field,
						oldValue: oldValue,
						newValue: newValue,
						fieldKind: this.fieldKindMap.get(field),
					});
				}

				return success;
			},
		};
	}

	private createProxy(entity: T) {
		return new Proxy<T>(entity, this.generateHandler(entity));
	}

	/**
	 * Is this entity a proxy object
	 * @param entity
	 */
	public isProxy(entity: T) {
		return !!Reflect.get(entity, IsEntityProxySymbol);
	}

	/**
	 * Apply proxy for this entity
	 * @param entity
	 */
	public apply(entity: T): T {
		if (this.isProxy(entity)) {
			return entity;
		}

		let proxy = this.proxyMap.get(entity);

		if (!proxy) {
			proxy = this.createProxy(entity);
			this.proxyMap.set(entity, proxy);
		}

		return proxy;
	}

	/**
	 * Restore entity proxy to real entity
	 * @param entity
	 */
	public restore(entity: T): T {
		if (this.isProxy(entity)) {
			return Reflect.get(entity, OriginalEntitySymbol) as T;
		}
		return entity;
	}
}
