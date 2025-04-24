import {CompleteIdentification, IEntityIdentification} from '@libs/platform/common';
import {IPrcHeaderDataService} from '@libs/procurement/common';
import {DataServiceFlatLeaf, IEntitySelection} from '@libs/platform/data-access';
import { IOrdPaymentScheduleEntity } from '@libs/sales/interfaces';

export interface SalesContractPaymentScheduleDataServiceInterface<
    T extends IOrdPaymentScheduleEntity,
    PT extends IEntityIdentification,
    PU extends CompleteIdentification<PT>>
    extends PaymentScheduleDataServiceInterface<T, PT, PU> {

    /**
     * Total source data url
     */
    totalSourceUrl: string

    /**
     * Parent data service
     */
    parentService: IPrcHeaderDataService<PT, PU>
}

export interface PaymentScheduleDataServiceInterface<
    T extends IOrdPaymentScheduleEntity,
    PT extends IEntityIdentification,
    PU extends CompleteIdentification<PT>>
    extends DataServiceFlatLeaf<T, PT, PU> {

    /**
     * Parent data service
     */
    parentService: IEntitySelection<PT>
    /**
     * Payment schedule url
     */
    paymentScheduleUrl: string
    /**
     * Payment schedule target value
     */
    paymentScheduleTarget: {
        netOc: number,
        grossOc: number,
        net: number,
        gross: number
    }

    /**
     * Get vat percent
     */
    getVatPercent(): number

    /**
     * Get exchange rate
     */
    getExchangeRate(): number

    /**
     * Whether parent is main entity
     * @param parent
     */
    isParentMainEntity(parent?: PT): boolean

    /**
     * Whether show grid container header total setting part
     * @param parent
     */
    isShowTotalSetting(parent: PT): boolean

    /**
     * Create entity and payment schedule target
     */
    createEntityNTarget(): Promise<T | undefined>

    /**
     * Update payment schedule total line value
     * @param netOc
     * @param grossOc
     */
    updatePaymentScheduleTarget(netOc: number, grossOc: number): Promise<boolean>

    /**
     * whether disable recalculate button
     */
    disabledRecalculateTo100(): boolean

    /**
     * Recalculate to 100%
     */
    recalculateTo100(): void

    /**
     * Update entity readonly
     * @param entity
     */
    updateReadOnly(entity: T): void
}