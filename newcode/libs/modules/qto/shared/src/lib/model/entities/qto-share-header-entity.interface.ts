/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo, IEntityBase, IEntityIdentification} from '@libs/platform/common';

/**
 * qto detail entity interface
 */
export interface IQtoShareHeaderEntity extends IEntityBase, IEntityIdentification {
    /*
    * BasGoniometerTypeFk
    */
    BasGoniometerTypeFk?: number | null;

    /*
     * BasRubricCategoryFk
     */
    BasRubricCategoryFk: number;

    /*
     * BoqHeaderFk
     */
    BoqHeaderFk: number;

    /*
     * BoqId
     */
    BoqId?: number | null;

    /*
     * BusinessPartnerFk
     */
    BusinessPartnerFk?: number | null;

    /*
     * ClerkFk
     */
    ClerkFk?: number | null;

    /*
     * Code
     */
    Code: string;

    /*
     * ConHeaderFk
     */
    ConHeaderFk?: number | null;

    /*
     * ContractCode
     */
    ContractCode?: string | null;

    /*
     * DescriptionInfo
     */
    DescriptionInfo?: IDescriptionInfo | null;

    /*
     * DetailTotal
     */
    DetailTotal?: number | null;

    /*
     * Id
     */
    Id: number;

    /*
     * IsAQ
     */
    IsAQ: boolean;

    /*
     * IsBQ
     */
    IsBQ: boolean;

    /*
     * IsFreeItemsAllowedOfContract
     */
    IsFreeItemsAllowedOfContract?: boolean | null;

    /*
     * IsIQ
     */
    IsIQ: boolean;

    /*
     * IsLive
     */
    IsLive: boolean;

    /*
     * IsWQ
     */
    IsWQ: boolean;

    /*
     * NoDecimals
     */
    NoDecimals?: number | null;

    /*
     * OenLvHeader
     */
    // TODO: Temporarily commenting out to resolve eslint the error because it never used.
    // OenLvHeader?: {} | null;

    /*
     * OrdHeaderFk
     */
    OrdHeaderFk?: number | null;

    /*
     * PackageFk
     */
    PackageFk?: number | null;

    /*
     * PerformedFrom
     */
    PerformedFrom?: Date | null;

    /*
     * PerformedTo
     */
    PerformedTo?: Date | null;

    /*
     * PermissionObjectInfo
     */
    PermissionObjectInfo?: string | null;

    /*
     * PrcBoqFk
     */
    PrcBoqFk?: number | null;

    /*
     * PrcStructureFk
     */
    PrcStructureFk?: number | null;

    /*
     * PrjChangeStutasReadonly
     */
    PrjChangeStutasReadonly?: boolean | null;

    /*
     * ProjectFk
     */
    ProjectFk: number;

    /*
     * QTOStatusFk
     */
    QTOStatusFk?: number | null;

    /*
     * QtoConfigEntities
     */
    // QtoConfigEntities?: IQtoConfigEntity[] | null;

    /*
     * QtoDate
     */
    QtoDate?: Date | null;

    /*
     * QtoSheetEntities
     */
    // QtoSheetEntities?: IQtoSheetEntity[] | null;

    /*
     * QtoStatusEntity
     */
    // QtoStatusEntity?: IQtoStatusEntity | null;

    /*
     * QtoStatusHistoryEntities
     */
    // QtoStatusHistoryEntities?: IQtoStatusHistoryEntity[] | null;

    /*
     * QtoTargetType
     */
    QtoTargetType: number;

    /*
     * QtoTypeFk
     */
    QtoTypeFk: number;

    /*
     * Remark
     */
    Remark?: string | null;

    /*
     * UseRoundedResults
     */
    UseRoundedResults: boolean;

    /*
     * hasQtoDetal
     */
    hasQtoDetal?: boolean;
}