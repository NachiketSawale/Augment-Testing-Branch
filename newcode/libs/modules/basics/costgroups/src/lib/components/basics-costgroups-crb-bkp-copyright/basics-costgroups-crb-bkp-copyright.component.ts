/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, inject, OnInit} from '@angular/core';
import {PlatformConfigurationService} from '@libs/platform/common';

/**
 * material alternative list grid
 */
@Component({
  selector: 'basics-costgroups-crb-bkp-copyright',
  templateUrl: './basics-costgroups-crb-bkp-copyright.component.html',
  styleUrls: ['./basics-costgroups-crb-bkp-copyright.component.scss']
})
export class BasicsCostgroupsCrbBkpCopyrightComponent implements OnInit {
  public readonly configurationService = inject(PlatformConfigurationService);

  public image: string = '';

  /**
   * Loads the data into the grid on component initialization
   */
  public ngOnInit(): void {
    const language = this.configurationService.savedOrDefaultUiCulture;

    this.image = 'Cloud.Style/content/images/crb-copyright/CRB_Dialogbox_' + (language==='fr' ? 'F' : language==='it' ? 'I' : 'D') + '_BKP.gif';
  }
}
