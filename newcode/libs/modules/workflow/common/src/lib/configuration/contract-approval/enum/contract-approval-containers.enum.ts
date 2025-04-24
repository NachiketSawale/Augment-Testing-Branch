/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Enums to identify containers in contract approval generic wizard.
 */
export enum ContractApprovalContainers {
    /**
     * Business partner grid container for contract approval.
     */
    BUSINESSPARTNER_LIST = '75dcd826c28746bf9b8bbbf80a1168e8',

    /**
     * Business partner detail container for contract approval.
     */
    BUSINESSPARTNER_DETAIL = '411D27CFBB0B4643A368B19FA95D1B40',

    /**
     * Rfq list container for contract approval.
     */
    RFQ_LIST = '1ec440875e364e8684f0ad25f0d94510',

    /**
     * Quote container for contract approval.
     * This container is based on rfq container.
     */
    QUOTE = 'deb620733c7e494b8f4d261c4aa01c6b',

    /**
     * Certificates container for contract approval.
     */
    CERTIFICATES = '5055BA9CE9C14F78B445A97D74BC8B90',

    /**
     * Actual certificates container for contract approval.
     */
    ACTUAL_CERTIFICATES = '0F6AE8F1F34545559C008FCA53BE2754',

    /**
     * contract approver container for contract approval.
     */
    CONTRACT_APPROVER = 'c6079d3605874e1691c1221c77e8421a',

    /**
     * Approver container for contract approval.
     */
    APPROVER = '22307f2249d04061986c26508e5f6b1a',

    /**
     * Pinboard comments container for contract approval.
     */
    PINBOARD_COMMENTS = '54dbff34150c4db09300d900d521baf0',

    /**
     * Totals container for contract approval.
     */
    TOTALS = 'B19C1F681EEE490EBB3AC023854DB68D',

    /**
     * Boq structure container for contract approval.
     */
    BOQ_STRUCTURE = 'DC5C6ADCDC2346E09ADADBF5508842DE',

    /**
     * Generals container for contract approval.
     */
    GENERALS = '54DC0AE6C79E44548AD5C84EDD339DB4',

    /**
     * BP Relation Chart for contract approval
     */
    BP_RELATION_CHART = '11DD248F6DB045029BA634BAA501FAAD'
}