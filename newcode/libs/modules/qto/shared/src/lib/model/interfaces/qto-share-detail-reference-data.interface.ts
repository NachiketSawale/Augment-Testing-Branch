/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * qto detail Reference Data
 */

export type CodeMap = {
    id: number;
    code: string;
    result: number;
    qtoDetailReferenceFk: number;
    referenceCodes: string[];
};

export interface QtoShareDetailReferenceData {
    CodeMap: CodeMap[];

    ReferenceDic:  Record<string, string[]>;

    formulaError: string[];
}