/*
 * Copyright(c) RIB Software GmbH
 */

import {MaterialSearchSort} from './interfaces/material-search-sort.enum';
import {IMaterialAttributeRangeMinMaxEntity} from './interfaces/material-search-attribute-range.interface';
import {IMaterialAttributeLoadEntity} from './interfaces/material-search-attribute-load.interface';
import { IBasicsSearchStructurePreDefine } from '@libs/basics/interfaces';

/**
 * Material search request model
 */
export class MaterialSearchRequest {
    /**
     * current page of material
     */
    public CurrentPage: number = 1;
    /**
     * items count per page
     */
    public ItemsPerPage: number = 10;
    /**
     *  current page of material attribute
     */
    public AttrPageNumber: number = 1;
    /**
     * page count of material attribute
     */
    public AttrPageCount: number = 100;
    /**
     * user input to search
     */
    public SearchText: string = '';
    /**
     * Filter string of material search SQL
     */
    public FilterString: string = '';
    /**
     * Display price, see MaterialSearchPriceTypeEnum
     */
    public DisplayedPriceType: MaterialSearchPriceTypeEnum = MaterialSearchPriceTypeEnum.CostPrice;
    /**
     * Filter, for material lookup controller
     */
    public Filter: IMaterialSearchFilter = {};
    /**
     * filter by material catalog id
     */
    public CategoryIdsFilter: number[] = [];
    /**
     * filter by uom id
     */
    public UomIdsFilter = null;
    /**
     * filter by uom
     */
    public UomsFilter: string[] = [];
    /**
     * filter by price range
     */
    public PriceRange: IMaterialAttributeRangeMinMaxEntity | null = null;
    /**
     * filter by co2source name
     */
    public Co2SourceNameFilter: number[] | null = null;
    /**
     * filter by co2source id
     */
    public Co2SourceIdsFilter = null;
    /**
     * filter by co2source range
     */
    public Co2SourceRange: IMaterialAttributeRangeMinMaxEntity | null = null;
    /**
     * filter by co2project name
     */
    public Co2ProjectRange: IMaterialAttributeRangeMinMaxEntity | null = null;
    /**
     * filter by procurement structure id
     */
    public StructureId?: number | null = null;
    /**
     * filter by material attribute
     */
    public AttributeFilters: IMaterialAttributeLoadEntity[] = [];
    /**
     * default is Price low -> high
     */
    public SortOption: MaterialSearchSort = MaterialSearchSort.PriceAscending;
    /**
     * predefine filter
     */
    public PreDefine: IBasicsSearchStructurePreDefine | null | undefined = null;
    /**
     * do filter by framework catalog
     */
    public FilterByFramework = false;
    /**
     * if true; it will not filter material categories based on ratebook(master data filter)
     */
    public isMaster = false;
    /**
     * Filter by material type
     */
    public MaterialTypeFilter: IMaterialTypeFilter = {
        IsForEstimate: false,
        IsForProcurement: false,
        IsForRM: false,
        IsForLogistics: false,
        IsForModel: false,
        IsForSales: false
    };
    /**
     * show trace log for material search
     */
    public ShowTraceLog = true;
    /**
     * filter by main contract
     */
    public EnableOnlyMainContract = false;
    /**
     * Is reset catalog
     */
    public IsResetCatalog = false;
    /**
     * Is reset attribute
     */
    public IsResetAttribute = false;
    /**
     * more attributes property
     */
    public MorePropValue: {
        Property: string;
        ExcludeValues: string[];
    } | null = null;

    /**
     * Material id, used by material lookup initialization
     */
    public MaterialId?: number;

    /**
     * IsLabour
     */
    public IsLabour: boolean = false;
}

/**
 * Material search filter interface
 */
export interface IMaterialSearchFilter {
    BasisContractId?: number;
    PrcStructureId?: number;
    PrcStructureTypeId?: number;
    PrcStructureOptional?: boolean;
    IsTicketSystem?: boolean;
    IsFilterCompany?: boolean;
    MaterialCatalogId?: number;
    PrcConfigurationId?: number;
    ConHeaderId?: number;
    PrcCopyMode?: number;
    PackageId?: number;
    IncludeCatalogIds?: number[];
    ExcludeCatalogIds?: number[];
    IsFromContract?: boolean;
    IsFromPackage?: boolean;
    IsFreeItemsAllowed?: boolean;
}

/**
 * Material price type used to display
 */
export enum MaterialSearchPriceTypeEnum {
    /**
     * Line item module using estimate price
     */
    EstimatePrice = 0,
    /**
     * Procurement module using cost price
     */
    CostPrice = 1,
    /**
     * List price
     */
    ListPrice = 2
}

export interface IMaterialTypeFilter {
    IsForEstimate: boolean,
    IsForProcurement: boolean,
    IsForRM: boolean,
    IsForLogistics: boolean,
    IsForModel: boolean,
    IsForSales: boolean
}