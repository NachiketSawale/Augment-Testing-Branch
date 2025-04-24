/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '../../base';
import { AboutDialogDetailComponent } from '../components/about-dialog-detail/about-dialog-detail.component';
import { CertificatesDialogDetailComponent } from '../components/certificates-dialog-detail/certificates-dialog-detail.component';
import { LicencesDialogDetailComponent } from '../components/licences-dialog-detail/licences-dialog-detail.component';

/**
 * This service display about dialogs.
 */
@Injectable({
  providedIn: 'root'
})
export class AboutDialogService {

  private modalDialogService = inject(UiCommonDialogService);

/**
 * A custom dialog to open about dialog.	 
 */
  public async openAboutDialog(event: string) {
    const modalOptions: ICustomDialogOptions<{ text: string }, AboutDialogDetailComponent> = {
      width: '700px',
      windowClass: 'app-settings',
      resizeable: false,
      showCloseButton: false,
      buttons: [{ id: StandardDialogButtonId.Ok, caption: { key: 'ui.common.dialog.okBtn' } }],
      customButtons: [
        {
          id: 'licences',
          caption: 'cloud.desktop.aboutdialog.softwareLicencesText',
          isDisabled: false,
          autoClose: false,
          fn: () => {
            return this.licencesDetailDialog('licences');
          },
        },
        {
          id: 'certificates',
          caption: 'cloud.desktop.aboutdialog.certificatesText',
          isDisabled: false,
          autoClose: false,
          fn: () => {
            return this.certificatesDetailDialog('certificates');
          },
        },
      ],
      headerText: 'cloud.desktop.mainMenuAbout',
      id: event,
      bodyComponent: AboutDialogDetailComponent,
    };
    await this.modalDialogService.show(modalOptions);
  }

  /**
   * A custom dialog to open certificates within about dialog.	 
   */
  public async certificatesDetailDialog(event: string) {
    const modalOptions = {
      width: '700px%',
      resizeable: false,
      headerText: 'cloud.desktop.aboutdialog.certificatesText',
      id: event,
      bodyComponent: CertificatesDialogDetailComponent,
      buttons: [{ id: StandardDialogButtonId.Ok, caption: { key: 'ui.common.dialog.okBtn' } }],
    };
    await this.modalDialogService.show(modalOptions);
  }

  /**
   * A custom dialog to open licences within about dialog.	 
   */
  public async licencesDetailDialog(event: string) {
    const modalOptions = {
      width: '700px%',
      resizeable: false,
      headerText: 'cloud.desktop.aboutdialog.softwareLicencesText',
      id: event,
      bodyComponent: LicencesDialogDetailComponent,
      showCloseButton: false,
      buttons: [{ id: StandardDialogButtonId.Ok, caption: { key: 'ui.common.dialog.okBtn' } }],
    };
    await this.modalDialogService.show(modalOptions);
  }
}
