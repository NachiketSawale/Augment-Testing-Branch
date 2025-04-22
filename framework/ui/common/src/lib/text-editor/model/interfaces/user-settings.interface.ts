/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * used to stored user settings data
 */
export interface IUserSettings {
    /**
     * is auto number settings
     */
    autoNumberSettings: boolean;

    /**
     * document padding
     */
    documentPadding: number;

    /**
     * document width
     */
    documentWidth: number;

    /**
     * is show ruler
     */
    showRuler: boolean;

    /**
     * unit of measurement
     */
    unitOfMeasurement: string;

    /**
     * us use settings
     */
    useSettings: boolean;
}