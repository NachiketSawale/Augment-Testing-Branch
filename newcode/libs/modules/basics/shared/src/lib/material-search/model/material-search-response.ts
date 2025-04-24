/*
 * Copyright(c) RIB Software GmbH
 */

import {IMaterialSearchEntity} from './interfaces/material-search-entity.interface';
import { IPrcStructureEntity } from '@libs/basics/interfaces';
import {IMaterialSearchError} from './interfaces/material-search-error.interface';
import {IAlternativeSource} from './interfaces/alternative-source.interface';
import {IMaterialSearchCatalog} from './interfaces/material-search-catalog.interface';
import {IMaterialAttributeRangeEntity} from './interfaces/material-search-attribute-range.interface';
import {IMaterialAttributeLoadEntity} from './interfaces/material-search-attribute-load.interface';
import {IMaterialAttributeUomEntity} from './interfaces/material-search-attribute-uom.interface';
import {IMaterialAttributeCo2SourcesEntity} from './interfaces/material-search-attribute-co2sources.interface';

/**
 * Material search response model
 */
export class MaterialSearchResponse {
    /**
     * Material search entities
     */
    public items: IMaterialSearchEntity[] = [];
    /**
     * Material group entities
     */
    public groups: unknown[] = [];
    /**
     * Material catalog entities
     */
    public categories: IMaterialSearchCatalog[] = [];
    /**
     * Internet material catalogs
     */
    public internetCategories: unknown[] = [];
    /**
     * Procurement structure entities
     */
    public structures: IPrcStructureEntity[] = [];
    /**
     * Material attribute entities
     */
    public attributes: IMaterialAttributeLoadEntity[] = [];
    /**
     * Material attribute entities
     */
    public attributesFinished: boolean = false;
    /**
     * Uom entities
     */
    public uoms: IMaterialAttributeUomEntity[] = [];
    /**
     * Price range
     */
    public price:IMaterialAttributeRangeEntity | null = null;
    /**
     * Co2Project range
     */
    public co2project:IMaterialAttributeRangeEntity | null = null;
    /**
     * Co2source range
     */
    public co2source:IMaterialAttributeRangeEntity | null = null;
    /**
     * Co2source attribute
     */
    public co2sources: IMaterialAttributeCo2SourcesEntity[] = [];
    /**
     * Total count of material
     */
    public matchedCount = 0;
    /**
     * Max count of material group
     */
    public maxGroupCount = 0;
    /**
     * Search Result
     */
    public hasResult = false;
    // public progress = {
    //     isLoading: false,
    //     info: 'Loading'
    // };
    /**
     * alternative Sources
     */
    public alternativeSources: IAlternativeSource[] = [];
    // public attrContext = {};
    /**
     * Errors of internet catalog
     */
    public errors: IMaterialSearchError[] = [];
}