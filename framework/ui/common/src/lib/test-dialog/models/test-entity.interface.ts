/*
 * Copyright(c) RIB Software GmbH
 */

import { IFileSelectControlResult, RgbColor } from '@libs/platform/common';

/**
 * Test form entity interface.
 */
export interface ITestEntity {
    remark?: string;
    url?: string;
    comment?: string;
    integer?: number;
    description: string;
    decimal?: number;
    exchangeRate?: number;
    factor?: number;
    quantity?: number;
    imperialFt?: number;
    code?: string;
    history?: string;
    email?: string;
    password?: string;
    iban?: string;
    durationSec?: number;
    lookup?: number;
    money?: number;
    date?: Date;
    boolean?: boolean;
    select?: number;
    inputSelect?: string;
    customTranslate?: string;
    radio?: string | number | boolean;
    script?: string;
    customComponent?: number;
    myFile?: IFileSelectControlResult;
    color?: RgbColor;
    isValid?: boolean;
    isPresent?: boolean;
    dataFile?: IFileSelectControlResult;
}