/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext, ITranslatable } from '@libs/platform/common';
import { PRC_RFQ_BUSINESS_PARTNER_LAYOUT_SERVICE } from '@libs/procurement/interfaces';
import { FieldType, IAdditionalLookupField, ILayoutConfiguration, TransientFieldSpec, TypedConcreteFieldOverload } from '@libs/ui/common';
import { RfqBidders } from '../types/rfq-bidders.type';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN } from '@libs/businesspartner/interfaces';
import { ProcurementRfqBusinesspartnerContactFilterService } from '../services/lookup-services/rfq-businesspartner-contact-filter.service';

/**
 * Creates the required layout for rfq bidder wizard business partner container.
 * @param ctx 
 * @returns 
 */
export async function GetBidderLayoutConfiguration(ctx: IInitializationContext) {
    let layout = await (await ctx.lazyInjector.inject(PRC_RFQ_BUSINESS_PARTNER_LAYOUT_SERVICE)).generateLayout() as ILayoutConfiguration<RfqBidders>;
    const bpRelatedLookupProvider = await ctx.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
    //Removes history fields
    layout.suppressHistoryGroup = true;

    //Adds custom fields to bidder container
    let transientFields: TransientFieldSpec<RfqBidders>[] = [];
    if (layout.transientFields) {
        transientFields = [...layout.transientFields];
    }
    transientFields = transientFields.concat([        
        {
            id: 'companycc',
            model: 'companycc',
            type: FieldType.Boolean,
            sortOrder: 0,
            label: { key: 'procurement.rfq.wizard.businessPartner.CompanyEmailCC' }
        },
        {
            id: 'biddercontactcc',
            model: 'biddercontactcc',
            type: FieldType.Boolean,
            sortOrder: 0,
            label: { key: 'procurement.rfq.wizard.businessPartner.BidderContactCC' }
        },
        {
            id: 'branchcc',
            model: 'branchcc',
            type: FieldType.Boolean,
            sortOrder: 0,
            label: { key: 'procurement.rfq.wizard.businessPartner.BranchCC' }
        }]
    );

    //To get all the contacts for the related business partner.
    if (layout.overloads) {
        layout.overloads['ContactFk'] = bpRelatedLookupProvider.getContactLookupOverload({
            showClearButton: true,
            displayMember: 'FamilyName',
            customServerSideFilterToken: ProcurementRfqBusinesspartnerContactFilterService,
            additionalFields: [
                createAdditionalField('ContactFirstName', 'FirstName', { text: 'Contact First Name', key: 'procurement.rfq.rfqBusinessPartnerContactFirstName' }),
                createAdditionalField('ContactLastName', 'LastName', { text: 'Contact Last Name', key: 'procurement.rfq.rfqBusinessPartnerContactLastName' }),
                createAdditionalField('ContactEmail', 'Email', { text: 'Contact Email', key: 'procurement.rfq.rfqBusinessPartnerContactEmail' })
            ],
        }) as TypedConcreteFieldOverload<RfqBidders>;
    }

    //TODO: remove once label of contact is proper in business module.
    if (layout.labels) {
        layout.labels['ContactFk'] = { text: 'Contact Last Name', key: 'procurement.rfq.rfqBusinessPartnerContactLastName' };
    }

    layout = {
        ...layout,
        transientFields: transientFields
    };
    return layout;
}

const createAdditionalField = function (id: string, displayMember: string, label: ITranslatable): IAdditionalLookupField {
    return {
        id: id,
        displayMember: displayMember,
        label: label,
        column: true,
        singleRow: true,
    };
};