/*
 * Copyright(c) RIB Software GmbH
 */
import {IDescriptionInfo} from '@libs/platform/common';
/**
 *  Procurement Structure Account
 */
export class BasAccountEntity {

    /**
     * description info
     */
    public DescriptionInfo!: IDescriptionInfo;
    /**
     * Is Balance Sheet
     */
    public IsBalanceSheet!: boolean;
    /**
     * Is Profit And Loss
     */
    public IsProfitAndLoss!: boolean;
    /**
     * Is Cost Code
     */
    public IsCostCode!: boolean;
    /**
     * Is Revenue Code
     */
    public IsRevenueCode!: boolean;

    /**
     * constructor
     * @param Id
     * @param Code
     */
    public constructor(public Id: number, public Code: string) {

    }
}