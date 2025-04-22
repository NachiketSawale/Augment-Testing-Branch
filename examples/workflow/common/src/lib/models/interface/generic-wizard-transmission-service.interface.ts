/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { RfqBidders } from '../../configuration/rfq-bidder/types/rfq-bidders.type';
import { IGenericWizardTransmissionErrors } from './generic-wizard-transmission-errors.interface';

/**
 * Defines the transmission service used for generic wizard.
 */
export interface IGenericWizardTransmissionService {

    /**
     * Gets the current business partners
     */
    getBusinessPartners$(): Observable<RfqBidders[]>;

    /**
     * Gets business partners with included flag as true and loads them to the business partner observable with sendstatus to loading.
     */
    loadIncludedBusinessPartners(): void;

    /**
     * Updates the status of the business partner transmission.
     * @param RfqBidders The business partner to update.
     */
    updateBusinessPartnersSendStatus$(RfqBidders: RfqBidders): void;

    /**
     * Resets current error list.
     */
    resetErrorList(): void;

    /**
     * Stores the error list.
     */
    setErrorList(errorList: IGenericWizardTransmissionErrors[]): void;

    /**
     * Get error list.
     */
    getErrorList(): IGenericWizardTransmissionErrors[];
}