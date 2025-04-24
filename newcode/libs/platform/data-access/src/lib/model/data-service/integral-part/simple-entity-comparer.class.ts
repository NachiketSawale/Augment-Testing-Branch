/*
 * Copyright(c) RIB Software GmbH
 */


/**
 * Class for comparison of entities by there simple database ID
 * @typeParam T - entity type of the objects to be compared
 */
export class SimpleEntityComparer<T extends object> {
    public compare(left: T, right: T): number {
		 if('Id' in left && typeof left.Id === 'number' && 'Id' in right && typeof right.Id === 'number') {
			 return left.Id - right.Id;
		 }

	    throw new Error('In case not working with database Id property, the data service msut provide a entity comparer');
    }
}


