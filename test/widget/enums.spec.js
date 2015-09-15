describe('Unit : pluginPluginMediaCenterRSS widget Enums', function () {

  var TAG_NAMES, STATUS_CODE, STATUS_MESSAGES, MEDIUM_TYPES;

  beforeEach(module('mediaCenterRSSPluginWidget'));

  beforeEach(inject(function (_TAG_NAMES_, _STATUS_CODE_, _STATUS_MESSAGES_, _MEDIUM_TYPES_) {
    TAG_NAMES = _TAG_NAMES_;
    STATUS_CODE = _STATUS_CODE_;
    STATUS_MESSAGES = _STATUS_MESSAGES_;
    MEDIUM_TYPES = _MEDIUM_TYPES_;
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
    it('STATUS_CODE.UNDEFINED_EVENT should exist and equals to "UNDEFINED_EVENT"', function () {
      expect(STATUS_CODE.UNDEFINED_EVENT).toEqual('UNDEFINED_EVENT');
    });
  });

  describe('Unit : Enum STATUS_MESSAGES', function () {
    it('STATUS_MESSAGES should exist and be an object', function () {
      expect(typeof STATUS_MESSAGES).toEqual('object');
    });
    it('STATUS_MESSAGES.UNDEFINED_EVENT should exist and equals to "Undefined event provided"', function () {
      expect(STATUS_MESSAGES.UNDEFINED_EVENT).toEqual('Undefined event provided');
    });
  });

  describe('Unit : Enum MEDIUM_TYPES', function () {
    it('MEDIUM_TYPES should exist and be an object', function () {
      expect(typeof MEDIUM_TYPES).toEqual('object');
    });
    it('MEDIUM_TYPES.VIDEO should exist and equals to "VIDEO"', function () {
      expect(MEDIUM_TYPES.VIDEO).toEqual('VIDEO');
    });
    it('MEDIUM_TYPES.AUDIO should exist and equals to "AUDIO"', function () {
      expect(MEDIUM_TYPES.AUDIO).toEqual('AUDIO');
    });
    it('MEDIUM_TYPES.IMAGE should exist and equals to "IMAGE"', function () {
      expect(MEDIUM_TYPES.IMAGE).toEqual('IMAGE');
    });
    it('MEDIUM_TYPES.OTHER should exist and equals to "OTHER"', function () {
      expect(MEDIUM_TYPES.OTHER).toEqual('OTHER');
    });
  });

});