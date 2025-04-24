/*
 * Copyright(c) RIB Software GmbH
 */

import { IButtons } from './buttons.interface';
import { IFontSize } from './font-size.interface';
import { IFonts } from './fonts.interface';

/**
 * Used to stored editor system settings data
 */
export interface ISystemSettings {
    /**
     * buttons data to be displayed in editor
     */
    buttons: IButtons[];

    /**
     * default alignment
     */
    defaultAlignment: string;

    /**
     * default font data
     */
    defaultFont: string;

    /**
     * default font size
     */
    defaultFontSize: number;

    /**
     * document padding
     */
    documentPadding: number;

    /**
     * document width
     */
    documentWidth: number;

    /**
     * font sizes data
     */
    fontSizes: IFontSize[];

    /**
     * font data
     */
    fonts: IFonts[];

    /**
     * is show/hide ruler
     */
    showRuler: boolean;

    /**
     * is show system fonts
     */
    showSystemFonts: boolean;

    /**
     * unit of measurement
     */
    unitOfMeasurement: string;
}


