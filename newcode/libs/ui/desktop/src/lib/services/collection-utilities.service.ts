/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
	providedIn: 'root',
})
/**
 * Service file for collection-utilities.
 */
export class CollectionUtilitiesService {
	constructor() {}
	/**
	 * Returns an array of ids. The cloud is that you are very flexible about what you pass on as id. It can be a single id string, but you can also pass an object or arrays of IDs or objects.
	 * @param { object,number,string, array } value The id of the external module
	 * @param { string } valueProp The name of the property for the value. Default is 'id'. This is only used, if an object is passed.
	 * @return { array |object} An array of ids or an object
	 */
	 getValueArray(value: string[], valueProp: string = 'id'): string[] | object {
        let values: object | number | string | [] = _.isUndefined(value) ? [] : _.isArray(value) ? value : [value];
        values = _.map(values, (item: string): string => {
            if (_.isObject(item)) {
                valueProp = valueProp;
                return item['valueProp'];
            } else {
                return item;
            }
        });

        return values;

    }
}
