/*
 * Copyright(c) RIB Software GmbH
 */

import {InjectionToken} from '@angular/core';

/**
 * Validation data when copying material from internet
 */
export interface IMaterialSearchValidation {
    /**
     * Type
     */
    MessageType: number;
    /**
     * content
     */
    ErrorContent: string;
}

/**
 * injection token of validations
 */
export const MATERIAL_SEARCH_VALIDATIONS = new InjectionToken<IMaterialSearchValidation[]>('MATERIAL_SEARCH_VALIDATIONS');