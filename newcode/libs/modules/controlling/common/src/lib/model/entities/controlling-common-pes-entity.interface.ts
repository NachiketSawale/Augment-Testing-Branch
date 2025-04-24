/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import {IEntityBase} from '@libs/platform/common';

export interface IControllingCommonPesEntity extends IEntityBase{
    /*
     * Code
     */
    Code?: string | null;

    /*
     * Description
     */
    Description?: string | null;

    /*
    * Id
     */
    Id?: number | null;

    /*
     * MdcControllingunitFk
     */
    MdcControllingunitFk?: number | null;

    /*
     * PesStatusFk
     */
    PesStatusFk?: number | null;

    /*
    * PesValue
    */
    PesValue?: number | null;

    /*
     * PrjChangeFk
     */
    PrjChangeFk?: number | null;

    ControllingUnitCode?: string | null;

    ControllingUnitDescription?: string | null;

    ContrCostCodeFk?: number | null;

    ContrCostCodeCode?: string | null;

    ContrCostCodeDescription?: string | null;

    HeaderId?: number | null;

    HeaderCode?: string | null;

    HeaderDescription?: string | null;

    HeaderTotal?: number | null;

    ItemFilteredTotal?: number | null;

    StatusFk?: number | null;

    BusinessPartnerFk?: number | null;
}
