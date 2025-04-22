/*
 * Copyright(c) RIB Software GmbH
 */

import {find, get, set, padStart, has, isNil, isUndefined, isInteger, isBoolean, camelCase} from 'lodash';
import {Observable} from 'rxjs';

import {IIdentificationData} from '@libs/platform/common';

import {ILookupSearchRequest} from '../model/interfaces/lookup-search-request.interface';
import {ILookupSearchResponse} from '../model/interfaces/lookup-search-response.interface';
import {UiCommonLookupReadonlyDataService} from './lookup-readonly-data.service';
import {ILookupConfig} from '../model/interfaces/lookup-options.interface';
import {ILookupSimpleOptions} from '../model/interfaces/lookup-simple-options.interface';
import {ILookupSimpleData} from '../model/interfaces/lookup-simple-data.interface';
import {ILookupSimpleItem} from '../model/interfaces/lookup-simple-item.interface';
import {LookupSearchResponse} from '../model/lookup-search-response';
import { ILookupContext } from '../model/interfaces/lookup-context.interface';
import { LookupSimpleEntity } from '../model/lookup-simple-entity';

/**
 * The base lookup data service for simple lookup data provider
 */
export class UiCommonLookupSimpleDataService<TItem extends object, TEntity extends object = object> extends UiCommonLookupReadonlyDataService<TItem, TEntity> {
    protected dataOptions: ILookupSimpleOptions;

    /**
     * The constructor
     * @param moduleQualifier
     * @param config
     * @param simpleDataOptions
     */
    public constructor(public moduleQualifier: string, config: ILookupConfig<TItem, TEntity>, simpleDataOptions?: ILookupSimpleOptions) {
        super(config);
        this.dataOptions = simpleDataOptions || {};
        this.cache.enabled = true;
        this.paging.enabled = false;
        this.syncService = {
            getListSync: () => {
                return this.cache.getAll();
            }
        };
        this.config.searchSync = true;
        this.config.isClientSearch = true;
        if(this.config.showCustomInputContent) {
            this.config.formatter = this;
        }
    }

    /**
     * Display text formatter
     * @param dataItem
     * @param context
     */
    public format(dataItem: TItem, context: ILookupContext<TItem, TEntity>) {
        let displayText = get(dataItem, this.config.displayMember, '') as string;

        if (has(dataItem, 'Color') && this.dataOptions.customIntegerProperty && this.dataOptions.field && this.dataOptions.field.toLowerCase() === 'color') {
            const color = padStart((get(dataItem, 'Color') as number).toString(16), 7, '#000000');
            displayText = '<span class="btn btn-default btn-colorpicker" style="background-color:' + color + ';margin-right:2px"></span>' + displayText;
        }

        return displayText;
    }

    /**
     * Get lookup item by identification data
     * @param key
     * @deprecated use getItemByKeyAsync instead
     */
    public getItemByKey(key: IIdentificationData): Observable<TItem> {
        return new Observable<TItem>(observer => {
            const cacheItem = this.cache.getItem(key);

            if (cacheItem) {
                observer.next(cacheItem);
                observer.complete();
            } else {
                this.getList().subscribe(list => {
                    const item = find(list, e => get(e, this.config.valueMember) === key.id);
                    observer.next(item);
                    observer.complete();
                });
            }
        });
    }

    /**
     * Get whole list
     * @deprecated use getListAsync instead
     */
    public getList(): Observable<TItem[]> {
        return new Observable(observer => {
            if (this.cache.loaded) {
                observer.next(this.cache.list);
            } else {
	            const postData = {
		            lookupModuleQualifier: this.moduleQualifier,
		            displayProperty: this.config.displayMember,
		            valueProperty: this.config.valueMember,
		            CustomIntegerProperty: this.dataOptions.customIntegerProperty,
		            CustomIntegerProperty1: this.dataOptions.customIntegerProperty1,
		            CustomBoolProperty: this.dataOptions.customBoolProperty,
		            CustomBoolProperty1: this.dataOptions.customBoolProperty1,
		            isColorBackGround: this.dataOptions.isColorBackGround,
		            serverName: this.dataOptions.serverName
	            };

	            this.post('basics/lookupData/getData', postData).subscribe(response => {
		            let entities = ((response as ILookupSimpleData).items as ILookupSimpleItem[])
			            .filter(e => e.sorting !== 0 && e.isLive !== false)
			            .map(e => this.mapEntity(e));

		            entities = this.handleList(entities);

		            if (this.cache.enabled) {
			            this.cache.setList(entities);
		            }

		            observer.next(entities);
	            });
            }
        });
    }

    /**
     * Search list
     * @param request
     * @deprecated use getSearchListAsync instead
     */
    public getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<TItem>> {
        return new Observable((observer) => {
            this.getList().subscribe(list => {
                observer.next(new LookupSearchResponse(list));
                observer.complete();
            });
        });
    }

    /**
     * New entity instance, override this method for entity
     * @protected
     */
    protected newEntity() : TItem {
        return new LookupSimpleEntity() as TItem;
    }

    /**
     * Map lookup item entity from http data
     * @param item
     */
    public override mapEntity(item: ILookupSimpleItem): TItem {
        const mappedLookupItem = this.newEntity();

        set(mappedLookupItem, this.config.displayMember, item.displayValue);
        set(mappedLookupItem, this.config.valueMember, item.itemValue);
        set(mappedLookupItem, 'sorting', !isNil(item.sorting) ? item.sorting : null);
        set(mappedLookupItem, 'isLive', !isNil(item.isLive) ? item.isLive : null);
        set(mappedLookupItem, 'isDefault', item.isDefault ? item.isDefault : null);
        set(mappedLookupItem, 'icon', item.icon ? item.icon : null);

        if (this.dataOptions) {
            if (isUndefined(this.dataOptions.customIntegerProperty) && this.dataOptions.field) {
                console.warn('The parameter "field" (' + this.dataOptions.field + ', lookupModuleQualifier: ' + this.moduleQualifier + ') is only for usage with "customIntegerProperty". For all other like "customBoolProperty" or "customIntegerProperty1" field will be ignored!');
            }
            if (this.dataOptions.customIntegerProperty) {
                const p = this.dataOptions.field ? this.dataOptions.field : this.createPascalPropertyName(this.dataOptions.customIntegerProperty);
                set(mappedLookupItem, p, isInteger(item.customIntProperty) ? item.customIntProperty : undefined);
            }
            if (this.dataOptions.customIntegerProperty1) {
                const p = this.dataOptions.field1 ? this.dataOptions.field1 : this.createPascalPropertyName(this.dataOptions.customIntegerProperty1);
                set(mappedLookupItem, p, isInteger(item.customIntProperty1) ? item.customIntProperty1 : undefined);
            }
            if (this.dataOptions.customBoolProperty) {
                const p = this.dataOptions.fieldBool ? this.dataOptions.fieldBool : this.createPascalPropertyName(this.dataOptions.customBoolProperty);
                set(mappedLookupItem, p, isBoolean(item.customBoolProperty) ? item.customBoolProperty : undefined);
            }
            if (this.dataOptions.customBoolProperty1) {
                const p = this.dataOptions.fieldBool1 ? this.dataOptions.fieldBool1 : this.createPascalPropertyName(this.dataOptions.customBoolProperty1);
                set(mappedLookupItem, p, isBoolean(item.customBoolProperty1) ? item.customBoolProperty1 : undefined);
            }
        }

        return mappedLookupItem;
    }

    private createPascalPropertyName(originName: string) {
        const camelCaseName = camelCase(originName);
        const firstLetter = originName.charAt(0).toUpperCase();
        return firstLetter + camelCaseName.slice(1);
    }
}