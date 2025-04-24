/**
 * Created by hni on 2015/6/1.
 */
/**
 * Created by lja on 5/7/2015.
 */

// var cellType = {
//     normalCell: 'normalCell',
//     comboBoxCell: 'comboBox',
//     dropDownCell: 'dropDownBox',
//     readOnlyCell: 'readOnlyCell'
// };


module.exports = {
  CONTAINER_SEARCH:'AUTO TEST',
    PRC_HEADER: {
        UNIQUE_CODE: {
            SEARCH: 'AUTO TEST'
        },
        TEST_SAVE_SEARCH_CASE: {
            CODE:'AUTOTEST0810',
            DESCRIPTION:'AUTOTEST0810',
            COST_CODE:'AUTOTEST',
            TAX_CODE:'AUTOTEST'
        }

    },
    PRC_GENERALS: {
        SEARCH: '20150LAN',
        TEST_SAVE_AND_SEARCH:{
            CONFIGURATION: 'Subcontractor',
            TYPE: 'Material on Site',
            VALUE: '3000.33',
            COMMENT: 'auto test01'
        }
    },
    PRC_CERTIFICATES: {
        SEARCH: '20150LAN',

        TEST_SAVE_AND_SEARCH:{
            CONFIGURATION: 'Subcontractor',
            TYPE: 'Gewerbekarte',
            COMMENT: 'Autotest01'
        }
    },
    PRC_ACCOUNTS: {
        SEARCH: '20150LAN',

        TEST_SAVE_AND_SEARCH:{
            TYPE: 'Progress Application Cost',
            TAX_CODE: '01',
            ACCOUNT: '3000',
            OFFSET_ACCOUNT: '2000'
        }

    },
    PRC_EVALUATION: {
        SEARCH: '20150LAN',

        TEST_SAVE_AND_SEARCH:{
            COMPANY: 'niu company',
            EVALUATION_SCHEMA: '2015051804'
        }
    },
    PRC_ROLES: {
        SEARCH: '20150LAN',

        TEST_SAVE_AND_SEARCH:{
            COMPANY: 'niu company',
            CLERK_ROLE: 'Projektleitung',
            CLERK: 'BrHa2008',
            COMMENT: 'Auto test 01'
        }
    },
    PRC_EVENT:{
        TEST_SAVE_AND_SEARCH:{
          EVENT_TYPE:'Delivery',
            START_DAY:'10',
            START_BASIS:'Before system event',
            SYSTEM_EVENT_TYPE_START:'Package Created',
            END_DAY:'20',
            END_BASIS:'After event start'

        }
    }
};
