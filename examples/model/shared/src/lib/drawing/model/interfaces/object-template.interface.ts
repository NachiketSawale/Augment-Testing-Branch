/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Dimension object template
 */
export interface IObjectTemplate {
    id: number;
    mode: number;
    name: string;
    height: number;
    multiplier: number;
    offset: number;
    positiveColor: number;
    negativeColor: number;
    positiveTexture: number;
    negativeTexture: number;
}