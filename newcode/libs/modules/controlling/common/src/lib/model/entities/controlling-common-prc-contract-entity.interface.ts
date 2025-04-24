/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import {IEntityBase,IDescriptionInfo} from '@libs/platform/common';

export interface IControllingCommonPrcContractEntity extends IEntityBase {

    /*
     * ConHeaderFk
     */
    ConHeaderFk: number;

    /*
     * DateOrdered
     */
    DateOrdered: string;

    /*
     * DateReported
     */
    DateReported?: string | null;

    /*
     * DateCanceled
     */
    DateCanceled?: string | null;

    /*
     * DateDelivery
     */
    DateDelivery?: string | null;

    /*
     * DateCallofffrom
     */
    DateCallofffrom?: string | null;

    /*
     * DateCalloffto
     */
    DateCalloffto?: string | null;

    /*
     * DateQuotation
     */
    DateQuotation?: string | null;

    /*
     * ConfirmationDate
     */
    ConfirmationDate?: string | null;

    /*
     * DatePenalty
     */
    DatePenalty?: string | null;

    /*
     * DateEffective
     */
    DateEffective: string;

    /*
     * ExecutionStart
     */
    ExecutionStart?: string | null;

    /*
     * ExecutionEnd
     */
    ExecutionEnd?: string | null;

    /*
     * ContrCostCodeCode
     */
    ContrCostCodeCode?: string | null;

    /*
     * ContrCostCodeDescription
     */
    ContrCostCodeDescription?: IDescriptionInfo | null;
    /*
       * ContrCostCodeFk
       */
    ContrCostCodeFk?: number | null;
    /*
     * ControllingUnitCode
     */
    ControllingUnitCode?: string | null;

    /*
     * ControllingUnitDescription
     */
    ControllingUnitDescription?: IDescriptionInfo | null;
    /*
    * ControllingUnitFk
    */
    ControllingUnitFk?: number | null;
    /*
     * ValidFrom
     */
    ValidFrom?: string | null;
    /*
     * ValidTo
     */
    ValidTo?: string | null;

    /*
     * Id
     */

    Id?: number | null;
    /*
    * HeaderId
    */
    HeaderId :number;
    /*
    * HeaderCode
    */
    HeaderCode? :string | null;
    /*
    * HeaderDescription
    */
    HeaderDescription? : string | null;
    /*
    * HeaderTotal
    */
    HeaderTotal : number;
    /*
    *ItemFilteredTotal
    */
    ItemFilteredTotal : number;
    /*
    * StatusFk
    */
    StatusFk : number;
    /*
    * BusinessPartnerFk
    */
    BusinessPartnerFk ? : number | null;

}