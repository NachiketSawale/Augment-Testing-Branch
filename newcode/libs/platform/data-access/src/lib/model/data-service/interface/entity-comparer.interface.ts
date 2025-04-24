/*
 * Copyright(c) RIB Software GmbH
 */


/**
 * Class for comparison of entities by there simple database ID
 * @typeParam T -  entity type of the entities to be compared
 */
export interface IEntityComparer<T extends object> {
    compare(left: T, right: T): number
}


