/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit, inject } from '@angular/core';
import { AboutDialogDetailService } from '../../services/about-dialog-detail.service';
import { ContextService, PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { DatePipe } from '@angular/common';
import { ISystemInfo } from '../../interfaces/system-info.interface';
import { IBuildRecord } from '../../interfaces/build-record.interface';
import { IOtherComponentsRecord } from '../../interfaces/other-components-record.interface';

/**
 * Component representing the detail view of the About Dialog.
 */
@Component({
  selector: 'ui-common-about-detail-dialog',
  templateUrl: './about-dialog-detail.component.html',
  styleUrls: ['./about-dialog-detail.component.scss'],
})
export class AboutDialogDetailComponent implements OnInit {

  /**
   * System information to be displayed in the About Dialog.
   */
  public systemInfo!: ISystemInfo;

  //TODO: added here beacuase additionalinfo not implemented yet.
  public additionalInfo: string = 'Data Created with this beta version may not be further used in the later productive version';

  private aboutDialogDetailService = inject(AboutDialogDetailService);
  private translateService = inject(PlatformTranslateService);
  private contextService = inject(ContextService);
  private platformConfigurationService = inject(PlatformConfigurationService);

  public constructor(private datePipe: DatePipe) { 
   
  }
  
  public ngOnInit() {
    this.translateService.load(['cloud.desktop']);
    this.aboutDialogDetail();
  }

  /**
   *Fetches details for the About Dialog from the service.
   *@returns An observable that emits the system information for the About Dialog.
   */
  public async aboutDialogDetail() {
    await this.aboutDialogDetailService.getDialogDetailsData('services/platform/getsysteminfo').subscribe(
      (result: ISystemInfo) => {
        if (result) {
          this.systemInfo = result;
          this.systemInfo.serverUrl = this.platformConfigurationService.serverUrl;
          this.systemInfo.clientUrl = this.platformConfigurationService.clientUrl;

          if (this.systemInfo.productVersion) {
            this.systemInfo.productVersion = this.translateService.instant('cloud.desktop.formAboutVersion', {
              p1: this.systemInfo.productVersion,
            }).text;
          }

          if (this.systemInfo.buildVersion) {
            this.systemInfo.buildVersion = this.translateService.instant('cloud.desktop.formAboutBuildNo', {
              p1: this.systemInfo.buildVersion,
            }).text;
          }

          if (this.systemInfo.productDate) {
            this.systemInfo.productDate = this.systemInfo.productDate
              ? this.datePipe.transform(this.systemInfo.productDate, 'dd/MM/yyyy hh:mm:ss') || 'n/a'
              : this.translateService.instant('cloud.desktop.formAboutDate', { p1: 'n/a' }).text;
          }

          if (this.systemInfo.installationDate) {
            this.systemInfo.installationDate = this.systemInfo.installationDate
              ? this.datePipe.transform(this.systemInfo.installationDate, 'dd/MM/yyyy hh:mm:ss') || 'n/a'
              : this.translateService.instant('cloud.desktop.formAboutInstallationDate', { p1: 'n/a' }).text;
          }

          if (this.systemInfo.buildRecords) {
            this.systemInfo.buildRecords.forEach((item: IBuildRecord) => {
              if (item.inserted !== null) {
                item.inserted = this.datePipe.transform(item.inserted, 'dd/MM/yyyy hh:mm:ss') || 'n/a';
              } else {
                item.inserted = 'n/a';
              }
            });
          }

          if (this.systemInfo.otherComponentsRecords) {
            this.systemInfo.otherComponentsRecords.forEach((item: IOtherComponentsRecord) => {
              if (item.buildDate !== null) {
                item.buildDate = this.datePipe.transform(item.buildDate, 'dd/MM/yyyy hh:mm:ss') || 'n/a';
              } else {
                item.buildDate = 'n/a';
              }
            });
          }

          const uILanguageInfo = this.translateService.instant('cloud.desktop.formAboutUiLanguage', {
            p1: this.contextService.getLanguage(),
          });

          const dataLanguageInfo = this.translateService.instant('cloud.desktop.formAboutDataLanguage', {
            p1: this.contextService.getDataLanguageId(),
          });

          this.systemInfo.languageInfo = `${uILanguageInfo.text} ${dataLanguageInfo.text}`;
        }
      },
    );
  }
}
