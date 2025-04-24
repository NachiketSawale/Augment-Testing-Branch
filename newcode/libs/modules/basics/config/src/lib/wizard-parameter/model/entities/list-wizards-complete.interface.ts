/*
 * Copyright(c) RIB Software GmbH
 */


/**
 * Used to initialized list wizards complete based on wizard id.
 */
export interface IListWizards {
    /**
     * domain name
     */
    Domain: string | null;

    /**
     * group description
     */
    GroupDescription: string | null;

    /**
     * group name
     */
    GroupName: string | null;

    /**
     * id
     */
    Id: number | null;

    /**
     * module name
     */
    ModuleName: string | null;

    /**
     * Name
     */
    Name: string | null;

    /**
     * type
     */
    Type: string | null;

    /**
     * value
     */
    Value: string | null;

    /**
     * wizardFk
     */
    WizardFk: number | null;

    /**
     * wizardGuid
     */
    WizardGuid: string | null;

    /**
     * WizardParameterFk
     */
    WizardParameterFk: number | null

}