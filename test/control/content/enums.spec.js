describe('Unit : pluginPluginMediaCenterRSS content Enums', function () {

  var TAG_NAMES, STATUS_CODE, STATUS_MESSAGES, LAYOUTS;

  beforeEach(module('mediaCenterRSSPluginContent'));

  beforeEach(inject(function (_TAG_NAMES_, _STATUS_CODE_, _STATUS_MESSAGES_, _LAYOUTS_) {
    TAG_NAMES = _TAG_NAMES_;
    STATUS_CODE = _STATUS_CODE_;
    STATUS_MESSAGES = _STATUS_MESSAGES_;
    LAYOUTS = _LAYOUTS_;
  }));

  describe('Unit : Enum TAG_NAMES', function () {
    it('TAG_NAMES should exist and be an object', function () {
      expect(typeof TAG_NAMES).toEqual('object');
    });
    it('TAG_NAMES.RSS_FEED_INFO should exist and equals to "RssFeedInfo"', function () {
      expect(TAG_NAMES.RSS_FEED_INFO).toEqual('RssFeedInfo');
    });
  });

  describe('Unit : Enum STATUS_CODE', function () {
    it('STATUS_CODE should exist and be an object', function () {
      expect(typeof STATUS_CODE).toEqual('object');
    });
    it('STATUS_CODE.UNDEFINED_DATA should exist and equals to "UNDEFINED_DATA"', function () {
      expect(STATUS_CODE.UNDEFINED_DATA).toEqual('UNDEFINED_DATA');
    });
    it('STATUS_CODE.UNDEFINED_ID should exist and equals to "UNDEFINED_ID"', function () {
      expect(STATUS_CODE.UNDEFINED_ID).toEqual('UNDEFINED_ID');
    });
    it('STATUS_CODE.ITEM_ARRAY_FOUND should exist and equals to "ITEM_ARRAY_FOUND"', function () {
      expect(STATUS_CODE.ITEM_ARRAY_FOUND).toEqual('ITEM_ARRAY_FOUND');
    });
  });

  describe('Unit : Enum STATUS_MESSAGES', function () {
    it('STATUS_MESSAGES should exist and be an object', function () {
      expect(typeof STATUS_MESSAGES).toEqual('object');
    });
    it('STATUS_MESSAGES.UNDEFINED_DATA should exist and equals to "Undefined data provided"', function () {
      expect(STATUS_MESSAGES.UNDEFINED_DATA).toEqual('Undefined data provided');
    });
    it('STATUS_MESSAGES.UNDEFINED_ID should exist and equals to "Undefined id provided"', function () {
      expect(STATUS_MESSAGES.UNDEFINED_ID).toEqual('Undefined id provided');
    });
    it('STATUS_MESSAGES.ITEM_ARRAY_FOUND should exist and equals to "Array of Items provided"', function () {
      expect(STATUS_MESSAGES.ITEM_ARRAY_FOUND).toEqual('Array of Items provided');
    });
  });

  describe('Unit : Enum LAYOUTS', function () {
    it('LAYOUTS should exist and be an object', function () {
      expect(typeof LAYOUTS).toEqual('object');
    });
    it('LAYOUTS.itemListLayouts should be an array', function () {
      expect(Array.isArray(LAYOUTS.itemListLayouts)).toEqual(true);
    });
    it('LAYOUTS.itemDetailsLayouts should be an array', function () {
      expect(Array.isArray(LAYOUTS.itemDetailsLayouts)).toEqual(true);
    });
    it('LAYOUTS.itemListLayouts[0].name should exist and equals to "List_Layout_1"', function () {
      expect(LAYOUTS.itemListLayouts[0].name).toEqual('List_Layout_1');
    });
    it('LAYOUTS.itemListLayouts[1].name should exist and equals to "List_Layout_2"', function () {
      expect(LAYOUTS.itemListLayouts[1].name).toEqual('List_Layout_2');
    });
    it('LAYOUTS.itemListLayouts[2].name should exist and equals to "List_Layout_3"', function () {
      expect(LAYOUTS.itemListLayouts[2].name).toEqual('List_Layout_3');
    });
    it('LAYOUTS.itemListLayouts[3].name should exist and equals to "List_Layout_4"', function () {
      expect(LAYOUTS.itemListLayouts[3].name).toEqual('List_Layout_4');
    });
    it('LAYOUTS.itemDetailsLayouts[0].name should exist and equals to "Feed_Layout_1"', function () {
      expect(LAYOUTS.itemDetailsLayouts[0].name).toEqual('Feed_Layout_1');
    });
    it('LAYOUTS.itemDetailsLayouts[1].name should exist and equals to "Feed_Layout_2"', function () {
      expect(LAYOUTS.itemDetailsLayouts[1].name).toEqual('Feed_Layout_2');
    });
  });
});