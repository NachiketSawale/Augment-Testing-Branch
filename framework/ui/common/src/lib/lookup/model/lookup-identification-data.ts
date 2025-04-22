/*
 * Copyright(c) RIB Software GmbH
 */

import { isString, isNumber, get } from 'lodash';
import { ILookupIdentificationData } from './interfaces/lookup-identification-data.interface';
import { ILookupContext } from './interfaces/lookup-context.interface';
import { IIdentificationData } from '@libs/platform/common';

/**
 * Represents the class for lookup identification
 */
export class LookupIdentificationData implements ILookupIdentificationData {
	public id: number;

	public constructor(
		public key: number | string,
		public pKey1?: number,
		public pKey2?: number,
		public pKey3?: number,
	) {
		this.id = isNumber(key) ? key : -1;
	}

	/**
	 * Static method to create lookup identification data instance
	 * @param value
	 * @param context
	 */
	public static create<TItem extends object, TEntity extends object>(value: number | string | IIdentificationData, context?: ILookupContext<TItem, TEntity>): LookupIdentificationData {
		let id: LookupIdentificationData;

		if (isNumber(value) || isString(value)) {
			id = new LookupIdentificationData(value);
			if (context?.entity && context?.lookupConfig) {
				const entity = context.entity;
				const config = context.lookupConfig;

				if (config.pkey1Property) {
					id.pKey1 = get(entity, config.pkey1Property) as number;
				}
				if (config.pkey2Property) {
					id.pKey2 = get(entity, config.pkey2Property) as number;
				}
				if (config.pkey3Property) {
					id.pKey3 = get(entity, config.pkey3Property) as number;
				}
			}
		} else {
			const data = value as IIdentificationData;
			id = new LookupIdentificationData(data.id, data.pKey1, data.pKey2, data.pKey3);
		}

		return id;
	}

	/**
	 * Static method to convert entity identification to lookup identification data
	 * @param value
	 */
	public static convert(value: number | string | IIdentificationData): ILookupIdentificationData {
		// if it is already lookup identification data instance, return it.
		if (value instanceof LookupIdentificationData) {
			return value as ILookupIdentificationData;
		}

		return LookupIdentificationData.create(value);
	}

	/**
	 * Static method to compare two identification data
	 * @param i1
	 * @param i2
	 * @private
	 */
	public static equal(i1: IIdentificationData, i2: IIdentificationData) {
		const d1 = LookupIdentificationData.convert(i1);
		const d2 = LookupIdentificationData.convert(i2);
		return d1.key === d2.key && d1.pKey1 === d2.pKey1 && d1.pKey2 === d2.pKey2 && d1.pKey3 === d2.pKey3;
	}

	/**
	 * Static method to stringify identification data
	 * @param id
	 * @private
	 */
	public static stringify(id: IIdentificationData) {
		const data = LookupIdentificationData.convert(id);
		return `${data.key}-${data.pKey1 || 'N'}-${data.pKey2 || 'N'}-${data.pKey3 || 'N'}`;
	}
}
