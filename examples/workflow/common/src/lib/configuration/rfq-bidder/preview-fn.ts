import { PlatformHttpService, PlatformLazyInjectorService } from '@libs/platform/common';
import { RfqBidderProjectDocument } from './types/rfq-bidder-project-document.type';
import { Injector } from '@angular/core';
import { IMenuItemEventInfo, ItemType } from '@libs/ui/common';
import { GenericWizardContainers, GenericWizardContainerTypeUnion } from '../base/enum/rfq-bidder-container-id.enum';
import { GenericWizardConcreteMenuItem } from '../../models/types/generic-wizard-toolbar-item.type';

/**
 * Prepares the preview button for the document.
 * @param containerUuid 
 * @returns 
 */
export function preparePreviewDocumentBtn(containerUuid: GenericWizardContainers): GenericWizardConcreteMenuItem {
    return {
        id: 'preview',
        sort: 0,
        caption: 'basics.common.preview.button.previewCaption',
        type: ItemType.Item,
        iconClass: 'tlb-icons ico-preview-form',
        fn: previewDocumentFn,
        hideItem: false,
        containerUuid: containerUuid
    };
}

/**
 * Prepares the selected document to be previewed.
 * @param info 
 * @param injector 
 * @param lazyInjector 
 * @param selectedItem 
 */
async function previewDocumentFn(info: IMenuItemEventInfo<void>, injector: Injector, lazyInjector: PlatformLazyInjectorService, selectedItem: GenericWizardContainerTypeUnion | null) {
    const httpService = injector.get(PlatformHttpService);
    const document = selectedItem as RfqBidderProjectDocument;
    if (document) {
        const fileArchiveDocId: number = document.FileArchiveDocFk;
        const fileURL = document.Url;
        if (fileArchiveDocId) {
            const previewInput = {
                params: { fileArchiveDocId: fileArchiveDocId }, responseType: 'text' as 'json'
            };
            const response = await httpService.get<string>('basics/common/document/preview', previewInput);
            if (response) {
                window.open(response, '_target');
            }
        } else if (fileURL && fileURL !== undefined) {
            window.open(fileURL, '_target');
        }
    }
}