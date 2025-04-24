import {InjectionToken} from '@angular/core';

export const ATTENDEE_LOOKUP_OPTION_TOKEN = new InjectionToken<MtgAttendeeOption>('ATTENDEE_LOOKUP_OPTION_TOKEN');
export interface MtgAttendeeOption{
    clerkFromContext?:boolean
    contactFromContext?:boolean
    /**
     * Clerk case or Contact case
     */
    isLookupClerk:boolean
    contextClerks?:number[]
    contextContacts?:number[];
    contextBp?:number;
}