/*
 * Copyright(c) RIB Software GmbH
 */
import {ILookupContext} from '../model/interfaces/lookup-context.interface';
import {ILookupConfig} from '../model/interfaces/lookup-options.interface';
import {LookupReadonlyDataServiceFacade} from './lookup-readonly-data-service-facade';
import { Injector } from '@angular/core';
import { ILookupInput } from './interfaces/lookup-input.interface';
import { ILookupIdentificationData } from './interfaces/lookup-identification-data.interface';

/**
 * Lookup context object for lookup view component
 */
export class LookupContext<TItem extends object, TEntity extends object> implements ILookupContext<TItem, TEntity> {
    private _entity?: TEntity;
    private _indexInSet?: number;
    private _totalCount: number = 0;
    private _lookupConfig?: ILookupConfig<TItem, TEntity>;
    private _selectedId?: ILookupIdentificationData | null;
    private _inputValue?: string;

    /**
     * Returns the current entity object.
     */
    public get entity(): TEntity | undefined {
        if (this.lookupInput) {
            return this.lookupInput.effectiveEntityContext.entity;
        }
        return this._entity;
    }

    public set entity(value) {
        this._entity = value;
    }

    /**
     * Returns the index of the current entity object its containing set, if any.
     */
    public get indexInSet(): number | undefined {
        if(this.lookupInput) {
            return this.lookupInput.effectiveEntityContext.indexInSet;
        }
        return this._indexInSet;
    }

    public set indexInSet(value) {
        this._indexInSet = value;
    }

    /**
     * Returns the total count of entities in the set.
     */
    public get totalCount(): number {
        if(this.lookupInput) {
            return this.lookupInput.effectiveEntityContext.totalCount;
        }
        return this._totalCount;
    }

    public set totalCount(value) {
        this._totalCount = value;
    }

    /**
     * Returns the lookup configuration object
     */
    public get lookupConfig(): ILookupConfig<TItem, TEntity> {
        if (this.lookupInput) {
            return this.lookupInput.config;
        }
        return this._lookupConfig!;
    }

    public set lookupConfig(value) {
        this._lookupConfig = value;
    }

    /**
     * Current id
     */
    public get selectedId(): ILookupIdentificationData | null | undefined {
        if(this.lookupInput) {
            return this.lookupInput.getSelectedId();
        }
        return this._selectedId;
    }

    public set selectedId(value) {
        this._selectedId = value;
    }

    /**
     * Current input string
     */
    public get inputValue(): string | undefined {
        if(this.lookupInput) {
            return this.lookupInput.inputValue;
        }
        return this._inputValue;
    }

    public set inputValue(value) {
        this._inputValue = value;
    }

    /**
     * Lookup data facade
     */
    public lookupFacade!: LookupReadonlyDataServiceFacade<TItem, TEntity>;

    /**
     * Default constructor
     * @param injector
     * @param lookupInput
     */
    public constructor(public injector: Injector, public lookupInput?: ILookupInput<TItem, TEntity>) {

    }
}