/*
 * Copyright(c) RIB Software GmbH
 */


/**
 * Settings view dialog options
 */
export interface ISettingsViewDialogOptions {
    /**
     * activate user setting or not
     */
    useSettings: boolean;

    /**
     * activate auto number settings
     */
    autoNumberSettings: boolean;

    /**
     * to show/hide ruler
     */
    showRuler: boolean;

    /**
     * unit of measurement 
     */
    unitOfMeasurement: string;

    /**
     * document width
     */
    documentWidth: number;

    /**
     * document padding
     */
    documentPadding: number;

    /**
     * old unit
     */
    oldUnit: string;
}