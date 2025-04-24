/*
 * Copyright(c) RIB Software GmbH
 */

import {Subscription} from 'rxjs';

/**
 * Manage the subscription of observable in lookup
 */
export class LookupSubscriber {
    private subscriptionMap = new Map<string, Subscription>();

    /**
     * add a subscription
     * @param key
     * @param value
     */
    public addSubscription(key: string, value: Subscription) {
        this.unsubscribeSubscription(key);
        this.subscriptionMap.set(key, value);
    }

    /**
     * remove a subscription
     * @param key
     */
    public removeSubscription(key: string) {
        this.unsubscribeSubscription(key);
        this.subscriptionMap.delete(key);
    }

    private unsubscribeSubscription(key: string) {
        const v = this.subscriptionMap.get(key);

        if (v && !v.closed) {
            v.unsubscribe();
        }
    }

    /**
     * unsubscribe and clear all known subscriptions
     */
    public clearAllSubscriptions() {
        this.subscriptionMap.forEach(e => {
            if (!e.closed) {
                e.unsubscribe();
            }
        });
        this.subscriptionMap.clear();
    }
}