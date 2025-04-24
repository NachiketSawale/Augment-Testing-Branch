/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { inject, Injectable } from '@angular/core';

/**
 * Comparison Option Lookup Service
 */
@Injectable({
    providedIn: 'root'
})
export class EstimateMainSplitLineItemMethodsLookupService {
    private lookupFactory = inject(UiCommonLookupDataFactoryService);

    public SplitLineItemMethods = {
        SplitByObjectLocation: {
            id: 1,
            text: 'Split by  Object Location',
            key: 'estimate.main.splitLineItemWizard.splitByLocation'
        },
        SplitByObjects: {
            id: 2,
            text: 'Split by Objects',
            key: 'estimate.main.splitLineItemWizard.splitByObjects'
        },
        SplitByCommissioningResources: {
            id: 3,
            text: 'Split by Commissioning Resources',
            key: 'estimate.main.splitLineItemWizard.splitByCommissioningResources'
        },
        SplitByPercentAndQuantity: {
            id: 4,
            text: 'Split by % and Quantity',
            key: 'estimate.main.splitLineItemWizard.splitByPercentAndQuantity'
        },
        SplitByResources: {
            id: 5,
            text: 'Split by Resources',
            key: 'estimate.main.splitLineItemWizard.splitByResources'
        }
    };

    /**
     * create Lookup Service for Split LineItem Methods
     * @returns lookup
     */
    public createLookupService() {
        return this.lookupFactory.fromSimpleItemClass(
            [
                {
                    id: this.SplitLineItemMethods.SplitByObjectLocation.id,
                    desc: {
                        text: this.SplitLineItemMethods.SplitByObjectLocation.text,
                        key: this.SplitLineItemMethods.SplitByObjectLocation.key
                    }
                },
                {
                    id: this.SplitLineItemMethods.SplitByObjects.id,
                    desc: {
                        text: this.SplitLineItemMethods.SplitByObjects.text,
                        key: this.SplitLineItemMethods.SplitByObjects.key
                    }
                },
                {
                    id: this.SplitLineItemMethods.SplitByCommissioningResources.id,
                    desc: {
                        text: this.SplitLineItemMethods.SplitByCommissioningResources.text,
                        key: this.SplitLineItemMethods.SplitByCommissioningResources.key
                    }
                },
                {
                    id: this.SplitLineItemMethods.SplitByPercentAndQuantity.id,
                    desc: {
                        text: this.SplitLineItemMethods.SplitByPercentAndQuantity.text,
                        key: this.SplitLineItemMethods.SplitByPercentAndQuantity.key
                    }
                },
                {
                    id: this.SplitLineItemMethods.SplitByResources.id,
                    desc: {
                        text: this.SplitLineItemMethods.SplitByResources.text,
                        key: this.SplitLineItemMethods.SplitByResources.key
                    }
                }], {
            uuid: '',
            valueMember: 'id',
            displayMember: 'desc',
            translateDisplayMember: true
        });

    }
}