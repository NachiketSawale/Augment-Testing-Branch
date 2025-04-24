/*
 * Copyright(c) RIB Software GmbH
 */

import { IGenericWizardInstanceConfiguration } from '@libs/basics/config';
import { GenericWizardContainers } from '../../../configuration/base/enum/rfq-bidder-container-id.enum';

/**
 * Prepares layout attributes from wizard instance configuration.
 * @param wizardInstanceConfig wizard instance configuration from modules module.
 * @param containerUuid generic wizard container uuid.
 * @returns An array of layout attributes.
 */
export function prepareLayoutAttributes(wizardInstanceConfig: IGenericWizardInstanceConfiguration, containerUuid: GenericWizardContainers) {
    const layoutAttributes = wizardInstanceConfig.Steps.map(step => step.Container.find(container => container.Instance.ContainerUuid === containerUuid)?.Properties)?.filter(item => item !== undefined)[0]?.map(item => {
        return {
            id: item.PropertyId,
            isReadonly: item.IsReadOnly,
            sorting: item.Sorting,
            isPinned: item.IsPinned
        };
    }) ?? [];
    return layoutAttributes;
}