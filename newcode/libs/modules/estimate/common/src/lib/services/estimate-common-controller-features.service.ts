/*
 * Copyright(c) RIB Software GmbH
 */

// TODO this service is will be completely implemented in future 


import { Injectable } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { IInfoOverlay } from '@libs/ui/common';
// CloudDesktopPinningContextService not implemented yet
//import { CloudDesktopPinningContextService } from 'path-cloud-desktop-pinning-context-service';

@Injectable({
    providedIn: 'root'
})
export class EstimateCommonControllerFeaturesService {
    public constructor(
        private translateService: PlatformTranslateService,
        // private cloudDesktopPinningContextService: CloudDesktopPinningContextService
    ) {}

    public extendControllerByIsProjectContextService(infoOverlay: IInfoOverlay) {
        infoOverlay.info = this.translateService.instant('estimate.common.noPinnedProject').toString();

    
        // const onClearPinningContext = () => {
        //     this.showInfo(infoOverlay, infoOverlay.info as string) ;
        // };

        const onSetPinningContext = () => {
            // "Todo" CloudDesktopPinningContextService not implemented yet

            //const context = this.cloudDesktopPinningContextService.getPinningItem('project.main');
            //infoOverlay.visible = !context;
        };

        onSetPinningContext();

        // "Todo" CloudDesktopPinningContextService not implemented yet

        //this.cloudDesktopPinningContextService.onSetPinningContext.register(onSetPinningContext);
        //this.cloudDesktopPinningContextService.onClearPinningContext.register(onClearPinningContext);

        // Unregister event listeners when the component is destroyed
        
        return () => {
            // "Todo" CloudDesktopPinningContextService not implemented yet
            
            //this.cloudDesktopPinningContextService.onSetPinningContext.unregister(onSetPinningContext);
            //this.cloudDesktopPinningContextService.onClearPinningContext.unregister(onClearPinningContext);
        };
    }

    private showInfo(infoOverlay: IInfoOverlay, info: string): void {
        infoOverlay.info = info;
        infoOverlay.visible = true;
    }
}
