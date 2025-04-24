/**
 * Created by hni on 2015/7/28.
 */
//jshint ignore: start
var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var TSMAPPING = require('./ticket-system-mapping');
var TSDATA = require('./ticket-system-data');
var TSAPI=require('./ticket-system-api');

describe(' test search and submit in ticket system module', function () {

    var keyboard;
    var quantityAdd = MAPPING.TICKET_SYSTEM.QUANTITY_ADD;
    var quantityDecrease = MAPPING.TICKET_SYSTEM.QUANTITY_DECREASE;
    var quantityAddIntoCartItem = MAPPING.TICKET_SYSTEM.ADD_INTO_CART_ITEM;
    beforeEach(function () {
        keyboard = API.createNewAPI();
        keyboard.avoidException();
    });

    afterEach(function () {
        keyboard = null;
    });

    it('open ticket system module', function () {
        keyboard.openWorkspaceModule('Ticket System');
        keyboard.maxContainerLayout(0, 'Commodity Search')
    });
    it('test whether the search function is ok', function () {
        TSAPI.setSearchWordForTicketSystemAndSearch(TSDATA.TS_COMMODITY_SEARCH.SEARCH);
    });
    it('check whether the search result is right', function () {
        TSAPI.checkSearchResultInSearchUI().then(function (count) {
            expect(count).toBe(1, 'items count should be 1');
        });
    });
    it('set quantity for item by click button and check whether the quantity change', function () {
        TSAPI.setQuantityForSearchUIByButton(0, quantityAdd);
        TSAPI.setQuantityForSearchUIByButton( 0, quantityAdd);
        TSAPI.setQuantityForSearchUIByButton(0, quantityDecrease);
        //TSAPI.checkQuantityForSearchUI(0, '2 HSTK');
    });
    it('set quantity for item by input quantity and check whether the quantity change', function () {
        var quantity = 10;
        TSAPI.setQuantityForSearchUIByInput(0, quantity);
        keyboard.pressKey(protractor.Key.TAB);
      //  keyboard.checkQuantityForTicketSystem('Search', 0, quantity + ' HSTK');

    });
    it('add material to cart item and check whether add successfully', function () {
        TSAPI.checkCartItemForTicketSystem().then(function (beforeAddText) {
            var beforeAddTextInt = parseInt(beforeAddText);
            TSAPI.setQuantityForSearchUIByButton(0, quantityAddIntoCartItem);
            TSAPI.checkCartItemForTicketSystem().then(function (afterAddText) {
                var afterAddTextInt = parseInt(afterAddText);
                var beforeAddTextIntAndAddCount = beforeAddTextInt + 1;
                expect(afterAddTextInt).not.toBe(0);
            });
        });
    });
});
//jshint ignore: end