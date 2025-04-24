/*
 * Copyright(c) RIB Software GmbH
 */

import {get} from 'lodash';
import {IMainDataDto} from '../interfaces';

export class MainDataDto<T> implements IMainDataDto<T> {

    public get Main() {
        return this.getValueAs<T[]>('Main', [])!;
    }

    public get main() {
        return this.getValueAs<T[]>('main', [])!;
    }

    public constructor(public dto: unknown) {

    }

    public getValueAs<TValue>(field: string, defaultValue?: TValue) {
        const value = get(this.dto, field);

        if (value) {
            return value as TValue;
        }

        return defaultValue;
    }
}