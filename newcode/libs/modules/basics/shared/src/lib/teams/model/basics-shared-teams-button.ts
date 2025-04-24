/*
 * Copyright(c) RIB Software GmbH
 */
import {ILookupContext, UiCommonLookupBtn} from '@libs/ui/common';

export class BasicsSharedTeamsButton<TItem extends object, TEntity extends object> extends UiCommonLookupBtn<TItem, TEntity> {
    public override canExecute?: (context?: ILookupContext<TItem, TEntity>) => boolean = (context) => {
        return true;
    };

    /**
     * button is active or not
     * @param context
     */
    public override isDisabled(context?: ILookupContext<TItem, TEntity>): boolean {
        return this.disabled || (!!this.canExecute && !this.canExecute(context));
    }
}