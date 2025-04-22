/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentRef, inject, Injectable, Type, ViewContainerRef } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';

@Injectable({
  providedIn: 'root'
})
export class UiCommonPrintService {

  private readonly configService = inject(PlatformConfigurationService);

  public showProtocol<T>(component: Type<T>, viewContainerRef: ViewContainerRef): void {
    if (!component) {
      console.error('No component provided to showProtocol function');
      return;
    }
    const componentRef: ComponentRef<T> = viewContainerRef.createComponent<T>(component, {
    });
    const componentHtml = componentRef.location.nativeElement.innerHTML;
    this.openInNewTab(componentHtml);
    componentRef.destroy();
  }


  public openInNewTab(htmlContent: string): void {
    const newTab = window.open(this.configService.appBaseUrl + '', 'Protocol');
    if (newTab) {
      newTab.document.write(`
      <html>
        <head>
        <title></title>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);
      newTab.document.close();
    } else {
      console.error('Failed to open a new tab.');
    }
  }

}
