/*
 * Copyright(c) RIB Software GmbH
 */

/**
 *
 * Last qto line address returns from request http
 */
export interface ILastLineAddressInterface {
    IsCheck?: boolean;
    IsOverflow?: boolean;
    LineIndex?: number;
    LineReference?: string;
    PageNumber?: number;
    QtoDetailReference?: string;
}