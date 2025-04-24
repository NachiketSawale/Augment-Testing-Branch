/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';


/**
 * image select domain item source entity.
 */
interface ISelectWizardGroupIcon {
    /**
     * Id
     */
    id: number;

    /**
     * Display name
     */
    displayName: string;

    /**
     * Icon css
     */
    iconCSS: string
}

@Injectable({
    providedIn: 'root'
})

//TODO : Functions implementation will be modify once icon-basis service
// (platformIconBasisService) implementation is done.

/**
 * Used to create array of wizard css icon data for icon
 * image select dropdown from wizard group entity
 */
export class BasicsConfigWizardGroupIconService {

    /**
     * total icon count
     */
    public totalIcon = 125;


    /**
     * Used to create wizard css icon objects.
     * @returns {ISelectWizardGroupIcon} item source for imageselect 
     * dropdown
     */
    public createWizardGroupCssIconObjects(): ISelectWizardGroupIcon[] {
        const icons: ISelectWizardGroupIcon[] = [];

        for (let i = 1; i <= this.totalIcon; i++) {
            const itemSource = {
                id: i,
                displayName: `wizard${i.toString()}`,
                iconCSS: `wizard-icons ico-wizard${i.toString().padStart(2, '0')}`,
            };
            icons.push(itemSource);
        }
        return icons;
    }
}
