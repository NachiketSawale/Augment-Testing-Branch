/*
 * Copyright(c) RIB Software GmbH
 */


import { IEntityIdentification } from '@libs/platform/common';

/**
 * Class for comparison of entities by there simple database ID
 * @typeParam T - entity type of the objects to be compared
 */
export class EntityComparer<T extends IEntityIdentification> {
	public compare(left: T | null, right: T | null): number {
		if(right !== null && left !== null){
			const diffId = right.Id - left.Id;
			const diffPkey1 = this.getValue(right.PKey1, 0) - this.getValue(left.PKey1, 0);
			const diffPkey2 = this.getValue(right.PKey2, 0) - this.getValue(left.PKey2, 0);
			const diffPkey3 = this.getValue(right.PKey3, 0) - this.getValue(left.PKey3, 0);
			if (diffId === 0 && diffPkey1 === 0 && diffPkey2 === 0 && diffPkey3 === 0) {
				return 0;
			} else {
				return -1;
			}
		} else if (right === null && left === null){
			return 0;
		} else {
			return 1;
		}
	}

	private getValue<V>(val: V | null | undefined, defaultValue: V): V {
		return val === undefined || val === null ? defaultValue : val;
	}
}


