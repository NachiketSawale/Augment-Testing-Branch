/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, Input} from '@angular/core';
import {MaterialSearchScope} from '../../model/material-search-scope';

/**
 * The body of search view, include material sidebar filter and list view
 */
@Component({
  selector: 'basics-shared-material-search-body',
  templateUrl: './material-search-body.component.html',
  styleUrls: ['./material-search-body.component.scss']
})
export class BasicsSharedMaterialSearchBodyComponent {
  /**
   * Search scope
   */
  @Input()
  public scope!: MaterialSearchScope;
}
