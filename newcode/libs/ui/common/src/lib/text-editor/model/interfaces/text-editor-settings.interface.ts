/*
 * Copyright(c) RIB Software GmbH
 */

import { ISystemSettings } from './system-settings.interface';
import { IUserSettings } from './user-settings.interface';

/**
 * Used to stored editor settings data.
 */
export interface ITextEditorSettings {
    /**
     * system settings
     */
    system: ISystemSettings;

    /**
     * user settings
     */
    user: IUserSettings;
}