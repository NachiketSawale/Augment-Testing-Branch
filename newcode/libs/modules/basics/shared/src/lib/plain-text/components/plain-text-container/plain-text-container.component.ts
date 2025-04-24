/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, inject, OnInit} from '@angular/core';
import {EntityContainerBaseComponent} from '@libs/ui/business-base';
import {IPlainTextAccessor, PLAIN_TEXT_ACCESSOR} from '../../model/interfaces/plain-text-accessor.interface';

/**
 * A common plain text editor container.
 */
@Component({
  selector: 'basics-shared-plain-text-container',
  templateUrl: './plain-text-container.component.html',
  styleUrl: './plain-text-container.component.css'
})
export class BasicsSharedPlainTextContainerComponent<T extends object> extends EntityContainerBaseComponent<T> implements  OnInit{

  public selected?: T;

  public accessor = inject<IPlainTextAccessor<T>>(PLAIN_TEXT_ACCESSOR);

  public constructor() {
    super();
  }

  private updateSelected(selections: T[]) {
    if (selections.length > 0) {
      this.selected = selections[0];
    }
  }

  public handleChange(value: string) {
    this.accessor.setText(this.selected!, value);
    this.entityModification!.setModified([this.selected!]);
  }

  public ngOnInit(): void {
    this.updateSelected(this.entitySelection.getSelection());

    const selSub = this.entitySelection.selectionChanged$.subscribe(e => {
      this.updateSelected(e);
    });

    this.registerFinalizer(() => selSub.unsubscribe());
  }
}
