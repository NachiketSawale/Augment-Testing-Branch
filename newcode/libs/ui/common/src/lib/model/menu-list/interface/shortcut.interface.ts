/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * interface for hotkey service shortcuts
 */
export interface IShortcuts{
    [key: string]:{ [toolTip:string]:string}

}