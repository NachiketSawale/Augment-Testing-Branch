/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import Quill from 'quill';
import Toolbar from 'quill/modules/toolbar';

import { ICreateButtonOptions } from '../model/interfaces/create-button-options.interface';
import { ICreateButton, IDropdownItem } from '../model/interfaces/create-button.interface';
import { ICustomToolbarItem } from '../model/interfaces/custom-toolbar-item.interface';
import { ICreateDropdownItemOptionInterface, PlaceholderToolbarMap } from '../model/interfaces/create-dropdown-item-option.interface';

@Injectable({
  providedIn: 'root'
})

export class TextEditorToolbaritemService {

  /**
   * Used to create custom button in text editor.
   * 
   * @param {ICreateButtonOptions} options 
   * @returns {ICreateButton} return button data
   */
  public createButton(options: ICreateButtonOptions): ICreateButton {
    const button = {} as ICreateButton;
    button.options = options;
    button.editorFormatsEl = document.createElement('span');
    button.editorFormatsEl.className = 'ql-formats';
    button.id = button.options.id || `button-${this.generateId()}`;
    button.editorButton = document.createElement('button');
    button.editorButton.className = `ql-${button.id}`;
    this.setValue(button);
    this.setIcon(button);

    button.editorButton.addEventListener('click', () => {
      if (button.options.toggle && button.editorButton) {
        if (button.editorButton.classList.contains('active')) {
          button.editorButton.classList.remove('active');
        } else {
          button.editorButton.classList.add('active');
        }
      }
    });

    button.editorFormatsEl.appendChild(button.editorButton);
    return button;
  }


  /**
  * Generate a random ID.
  *
  * @returns {string} random 10 digit ID
  */
  public generateId(): string {
    return Math.random().toString().substr(2, 10);
  }



  /**
   * Used to set button icon.
   * 
   * @param {ICreateButton} button button data 
   */
  public setIcon(button: ICreateButton) {
    if (button.editorButton) {
      button.editorButton.innerHTML = button.options.icon;
    }
  }


  /**
   * Used to set value to button.
   * 
   * @param {ICreateButton} button  button data
   */
  public setValue(button: ICreateButton) {
    if (button.editorButton) {
      button.editorButton.value = button.options.value as string;
    }

  }


  /**
   * Used to bind custom button in text editor
   * 
   * @param {Quill} editor text editor instance
   * @param {ICustomToolbarItem<T>} toolbaritem toolbar item
   * @param {number} index index
   */
  public attach<T>(editor: Quill, toolbaritem: ICustomToolbarItem<T>, index?: number) {
    toolbaritem.toolbar = editor.getModule('toolbar') as Toolbar;
    toolbaritem.toolbarEl = toolbaritem.toolbar.container as HTMLElement;

    if (index) {
      if (toolbaritem.toolbarEl.childElementCount > index) {
        toolbaritem.toolbarEl.insertBefore(toolbaritem.editorFormatsEl, toolbaritem.toolbarEl.children[index]);
      } else {
        toolbaritem.toolbarEl.appendChild(toolbaritem.editorFormatsEl);
      }
    } else {
      toolbaritem.toolbarEl.appendChild(toolbaritem.editorFormatsEl);
    }
  }


  /**
   * Used to create custom dropdown item in text editor.
   * 
   * @param {ICreateDropdownItemOptionInterface} options dropdown item options
   * @returns {IDropdownItem} returns dropdown item
   */
  public createDropdownItem(options: ICreateDropdownItemOptionInterface): IDropdownItem {
    const dropDownItem = {} as IDropdownItem;
    dropDownItem.options = options;

    dropDownItem.editorFormatsEl = document.createElement('span');
    dropDownItem.editorFormatsEl.className = 'ql-formats';

    dropDownItem.id = dropDownItem.options.id || `dropdown-${this.generateId()}`;

    const qlPicker = document.createElement('span');
    qlPicker.className = `ql-${dropDownItem.id} ql-picker`;
    dropDownItem.editorFormatsEl.appendChild(qlPicker);

    const qlPickerLabel = document.createElement('span');
    qlPickerLabel.className = 'ql-picker-label';
    qlPicker.appendChild(qlPickerLabel);
    qlPickerLabel.addEventListener('click', (e) => {
      qlPicker.classList.toggle('ql-expanded');
    });
    window.addEventListener('click', (e) => {
      if (!qlPicker.contains(e.target as HTMLElement)) {
        qlPicker.classList.remove('ql-expanded');
      }
    });

    const qlPickerOptions = document.createElement('span');
    qlPickerOptions.className = 'ql-picker-options';
    qlPicker.appendChild(qlPickerOptions);

    dropDownItem.dropDownEl = qlPicker;
    dropDownItem.dropDownPickerEl = dropDownItem.dropDownEl.querySelector('.ql-picker-options');
    dropDownItem.dropDownPickerLabelEl = dropDownItem.dropDownEl.querySelector('.ql-picker-label');
    (dropDownItem.dropDownPickerLabelEl as HTMLElement).innerHTML = '<svg viewBox="0 0 18 18"> <polygon class="ql-stroke" points="7 11 9 13 11 11 7 11"></polygon> <polygon class="ql-stroke" points="7 7 9 5 11 7 7 7"></polygon> </svg>';

    this.setLabel(dropDownItem);
    this.setItems(dropDownItem);
    this.addCssRule(`
      .ql-snow .ql-picker.ql-${dropDownItem.id} .ql-picker-label::before, .ql-${dropDownItem.id} .ql-picker.ql-size .ql-picker-item::before {
      content: attr(data-label);}`);

    return dropDownItem;

  }


  /**
   * Used to add css rule for custom element.
   * @param {string} cssRule 
   */
  public addCssRule(cssRule: string) {
    const style = document.createElement('style');
    document.head.appendChild(style);
    (style.sheet as CSSStyleSheet).insertRule(cssRule, 0);
  }


  /**
   * Used to set lable to custom element.
   * 
   * @param {IDropdownItem} dropDownItem custom dropdown 
   */
  public setLabel(dropDownItem: IDropdownItem) {
    const newLabel: string = dropDownItem.options.label || '';
    const requiredWidth = `${this.getTextWidth(newLabel) + 30}px`;
    (dropDownItem.dropDownPickerLabelEl as HTMLElement).style.width = requiredWidth;
    (dropDownItem.dropDownPickerLabelEl as HTMLElement).setAttribute('data-label', newLabel);
  }

  /**
   * Used to set items to dropdown element.
   * 
   * @param {IDropdownItem} dropDownItem dropdown element. 
   */
  public setItems(dropDownItem: IDropdownItem) {
    const items: PlaceholderToolbarMap = dropDownItem.options.items;
    for (const [label, value] of Object.entries(items)) {
      const newItemEl = document.createElement('span');
      newItemEl.className = 'ql-picker-item';
      newItemEl.innerText = label;
      newItemEl.setAttribute('data-value', value);
      newItemEl.setAttribute('title', label);
      newItemEl.addEventListener('click', (e) => {
        if (dropDownItem.dropDownEl) {
          dropDownItem.dropDownEl.classList.remove('ql-expanded');
        }
        dropDownItem.onSelect(label, value);
      });

      (dropDownItem.dropDownPickerEl as HTMLElement).appendChild(newItemEl);
    }
  }


  /**
   * Used to get text width.
   * 
   * @param {string} text 
   * @returns returns text width
   */
  public getTextWidth(text: string): number {
    const font = '500 14px "Helvetica Neue", "Helvetica", "Arial", sans-serif';
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = font;
      const metrics = context.measureText(text);
      return metrics.width;
    } else {
      return 0;
    }

  }


  /**
   * 
   * Used to reset variable dropdown data on language change.
   * 
   * @param {{ [key: string]: string }} items variable items
   * @param {IDropdownItem} dropdown  dropdown button instance
   */
  public resetItems(items: { [key: string]: string }, dropdown: IDropdownItem) {
    if (dropdown) {
      (dropdown.dropDownPickerEl as Element).innerHTML = '';
      Object.entries(items).forEach(([label, value]) => {
        const newItemEl = document.createElement('span');
        newItemEl.className = 'ql-picker-item';
        newItemEl.innerText = label;
        newItemEl.setAttribute('data-value', value);
        newItemEl.addEventListener('click', () => {
          if (dropdown.dropDownEl) {
            dropdown.dropDownEl.classList.remove('ql-expanded');
          }
          if (dropdown.options.rememberSelection) {
            dropdown.setLabel(label);
          }

          if (dropdown.onSelect) {
            dropdown.onSelect(label, value);
          }
        });
        (dropdown.dropDownPickerEl as Element).appendChild(newItemEl);
      });
    }

  }

}
