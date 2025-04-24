/*
 * Copyright(c) RIB Software GmbH
 */
import {Component, Input} from '@angular/core';
import {MaterialSearchScope} from '../../model/material-search-scope';
import { IPrcStructureEntity } from '@libs/basics/interfaces';

/**
 * Navigator component of material search view, handle structure
 */
@Component({
  selector: 'basics-shared-material-search-navigator',
  templateUrl: './material-search-navigator.component.html',
  styleUrls: ['./material-search-navigator.component.scss']
})
export class BasicsSharedMaterialSearchNavigatorComponent {
  /**
   * Search scope
   */
  @Input()
  public scope!: MaterialSearchScope;

  /**
   * Get structures from root to leaf
   */
  public get structures() {
    if (this.scope.prcStructureId) {
      return this.buildStructures(this.scope.response.structures, this.scope.prcStructureId);
    }
    return [];
  }

  /**
   * Structures tracy by for ngFor
   * @param index
   * @param structure
   */
  public structureTracyBy(index: number, structure: IPrcStructureEntity) {
    return structure.Id;
  }

  private buildStructures(structures: IPrcStructureEntity[], structureId: number): IPrcStructureEntity[] {
    for (let i = 0; i < structures.length; i++) {
      const item = structures[i];

      if (item.Id === structureId) {
        return [item];
      }

      if (item.ChildItems) {
        let results = this.buildStructures(item.ChildItems, structureId);

        if (results.length > 0) {
          results = [item].concat(results);
          return results;
        }
      }
    }

    return [];
  }
}