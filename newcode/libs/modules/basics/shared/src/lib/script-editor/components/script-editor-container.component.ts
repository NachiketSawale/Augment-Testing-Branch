/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, InjectionToken } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
    IEntityBase,
    IEntityIdentification,
    PlatformConfigurationService,
    PlatformTranslateService,
    Translatable
} from '@libs/platform/common';
import {extend, get, isFunction, isUndefined, set} from 'lodash';
import { EntityContainerBaseComponent } from '@libs/ui/business-base';
import { IScriptEditorEntityOption} from '../model/interfaces/script-editor-entity-option.interface';
import { IScriptEditorEntity } from '../model/interfaces/script-editor-entity.interface';
import {IScriptEditorOptions, ItemType, ScriptDefService} from '@libs/ui/common';

export const SCRIPT_EDITOR_ENTITY_TOKEN = new InjectionToken<IScriptEditorEntityOption>('script-editor-entity-option-token');

/**
 * script editor contianer
 */
@Component({
    selector: 'basics-shared-script-editor-container',
    templateUrl: './script-editor-container.component.html',
    styleUrls: ['./script-editor-container.component.css'],
})
export class BasicsSharedScriptEditorContainerComponent<T extends IEntityIdentification & IEntityBase> extends EntityContainerBaseComponent<T> {
    protected readonly http = inject(HttpClient);
    protected readonly configurationService = inject(PlatformConfigurationService);
    private readonly translate = inject(PlatformTranslateService);

    public doc: string = '';

    public readonly = true;

    public config: IScriptEditorOptions;

    private readonly defService = inject(ScriptDefService);

    protected options: IScriptEditorEntityOption = {
        scriptField: 'ValidateScriptData',
        mainItemIdKeyName: 'mainItemId',
        mainItemIdField: 'Id',
        ScriptProvider: this.defService
    };

    private itemToSave: IScriptEditorEntity = {
        Id: 0,
        ScriptData: '',
        ValidateScriptData: ''
    };

    public constructor() {
        super();

        const customOption = inject(SCRIPT_EDITOR_ENTITY_TOKEN);
        extend(this.options, customOption);

        this.config = {
            defProvider: this.options.ScriptProvider
        };

        this.setLockMessage(this.options.lockMessage);

        this.subscribeSelectionChanged();

        this.setStandardToolbar();
    }

    /**
     * set lock message
     * @param lockMessage
     * @private
     */
    private setLockMessage(lockMessage: Translatable | undefined){
        if (lockMessage){
            const translated = this.translate.instant(lockMessage);
            this.doc = translated.text;
        }
    }

    /**
     * selected change for mainitem
     * @private
     */
    private subscribeSelectionChanged() {
        const subscription = this.entitySelection?.selectionChanged$.subscribe(async () => {
            await this.getDoc();
        });
        this.registerFinalizer(() => subscription.unsubscribe());
    }

    /**
     * get and set doc
     * @private
     */
    private async getDoc(){
        const selectedMainItem = this.entitySelection?.getSelectedEntity();
        if (!selectedMainItem) {
            return;
        }

        this.doc = '';
        this.itemToSave.Id = 0;

        this.readonly = this.options.isReadonly ? this.options.isReadonly() : false;

        if (!this.readonly) {
            if (this.options.getUrl && this.options.mainItemIdField) {
                const url = this.configurationService.webApiBaseUrl + (isFunction(this.options.getUrl) ? this.options.getUrl(selectedMainItem) : this.options.getUrl);
                const mainItemId = get(selectedMainItem, this.options.mainItemIdField);
                const response = await firstValueFrom(this.http.post(url, isUndefined(this.options.getPostRequestBody) ? {[this.options.mainItemIdKeyName]: mainItemId} : this.options.getPostRequestBody(selectedMainItem,this.options.mainItemIdField)));
                if (response) {
                    const data = response as IScriptEditorEntity;

                    // new mainitem, defualt new script
                    let isNew: boolean = false;
                    if (this.options.isNewDefaultScript && this.options.isNewDefaultScript() && this.options.newDefaultScript){
                        set(data, this.options.scriptField, this.options.newDefaultScript);
                        isNew = true;
                    }

                    if (this.options.setItemAsModified) {
                        extend(this.itemToSave, data);

                        if (isNew){
                            this.options.setItemAsModified(this.itemToSave);
                        }
                    }

                    this.doc = get(data, this.options.scriptField);
                }

            } else {
                this.doc = get(selectedMainItem, this.options.scriptField);
            }
        } else {
            this.setLockMessage(this.options.lockMessage);
        }
    }

    /**
     * script channge event
     * @param newValue
     */
    public onValueChange(newValue: string): void {
        const selectedMainItem = this.entitySelection?.getSelectedEntity();
        if (!selectedMainItem) {
            return;
        }

        if (this.options.setItemAsModified) {
            if (this.itemToSave && this.itemToSave.Id > 0) {
                // if no change will not set modified
                const scriptValue = get(this.itemToSave, this.options.scriptField);
                if (scriptValue === newValue) {
                    return;
                }

                set(this.itemToSave, this.options.scriptField, newValue);
                this.options.setItemAsModified(this.itemToSave);
            }
        } else {
            // if no change will not set modified
            const scriptValue = get(selectedMainItem, this.options.scriptField);
            if (scriptValue === newValue) {
                return;
            }

            set(selectedMainItem, this.options.scriptField, newValue);
            this.entityModification?.setModified(selectedMainItem);
        }
    }


    /**
     * addStandardToolS
     */
    public setStandardToolbar(){
        // TODO: Fn function logic
        this.uiAddOns.toolbar.addItems([
            {
                id: 't00',
                sort: 0,
                caption: 'basics.common.taskBar.undo',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-undo',
                // fn: fireCommand('undo')
            },
            {
                id: 't01',
                sort: 1,
                caption: 'basics.common.taskBar.redo',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-redo',
                // fn: fireCommand('redo')
            },
            {
                id: 't09',
                sort: 9,
                caption: 'basics.common.taskBar.renameVariable',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-rename-variable',
                // fn: fireCommand('rename')
            },
            {
                id: 't11',
                sort: 11,
                caption: 'basics.common.taskBar.jumpBack',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-jump-back',
                // fn: fireCommand('jumpBack')
            },
            {
                id: 't10',
                sort: 10,
                caption: 'basics.common.taskBar.jumpToDef',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-jump-to-def',
                // fn: fireCommand('jumpToDef')
            },
            {
                id: 't19',
                sort: 19,
                caption: 'basics.common.taskBar.showHint',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-show-type-doc',
                // fn: fireCommand('showDoc')
            },
            {
                id: 't20',
                sort: 20,
                caption: 'basics.common.taskBar.codeFold',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-code-fold',
                // fn: fireCommand('foldAll')
            },
            {
                id: 't21',
                sort: 21,
                caption: 'basics.common.taskBar.codeUnfold',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-code-unfold',
                // fn: fireCommand('unfoldAll')
            },
            {
                id: 't30',
                sort: 30,
                caption: 'basics.common.taskBar.comment',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-toggle-comment',
                // fn: fireCommand('toggleComment')
            },
            {
                id: 't31',
                sort: 31,
                caption: 'basics.common.taskBar.indent',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-code-indent',
                // fn: fireCommand('indent')
            },
            {
                id: 't32',
                sort: 32,
                caption: 'basics.common.taskBar.format',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-code-format',
                // fn: fireCommand('format')
            },
            {
                id: 't41',
                sort: 41,
                caption: 'basics.common.taskBar.find',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-find',
                // fn: fireCommand('find')
            },
            {
                id: 't42',
                sort: 42,
                caption: 'basics.common.taskBar.clearSearch',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-find-clear',
                // fn: fireCommand('clearSearch')
            },
            {
                id: 't44',
                sort: 44,
                caption: 'basics.common.taskBar.findPrev',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-find-previous',
                // fn: fireCommand('findPrev')
            },
            {
                id: 't43',
                sort: 43,
                caption: 'basics.common.taskBar.findNext',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-find-next',
                // fn: fireCommand('findNext')
            },
            {
                id: 'd110',
                sort: 119,
                type: ItemType.Divider,
            },
            {
                id: 't45',
                sort: 45,
                caption: 'basics.common.taskBar.replace',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-replace',
                // fn: fireCommand('replace')
            },
            {
                id: 't46',
                sort: 46,
                caption: 'basics.common.taskBar.replaceAll',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-replace-all',
                // fn: fireCommand('replaceAll')
            },
            {
                id: 'd120',
                sort: 129,
                type: ItemType.Divider,
            },
            {
                id: 't47',
                sort: 47,
                caption: 'basics.common.taskBar.jumpToLine',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-jump-to-line',
                // fn: fireCommand('jumpToLine')
            },
            {
                id: 't98',
                sort: 98,
                caption: 'basics.common.taskBar.shortcuts',
                type: ItemType.Item,
                iconClass: 'tlb-icons ico-info',
                //  fn: showShortcut
            }
        ]);
    }


}
