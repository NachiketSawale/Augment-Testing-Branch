/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Qto Detail Result
 */
export interface QtoShareDetailResult {
    reference: string;
    result: number;

    val1?: number | null;
    val2?: number | null;
    val3?: number | null;
    val4?: number | null;
    val5?: number | null;

    val1Detail?: string | null;
    val2Detail?: string | null;
    val3Detail?: string | null;
    val4Detail?: string | null;
    val5Detail?: string | null;

    operator1?: string | null;
    operator2?: string | null;
    operator3?: string | null;
    operator4?: string | null;
    operator5?: string | null;
}