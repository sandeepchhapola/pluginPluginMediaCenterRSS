describe('Unit : pluginPluginMediaCenterRSS widget.home.controller.js', function () {
  var WidgetHome, $scope, $filter, $rootScope, $controller, ItemDetailsService, q, FeedParseService, $timeout, $httpBackend, Location, DataStore, Buildfire, Underscore, TAG_NAMES, STATUS_CODE, STATUS_MESSAGES, MEDIUM_TYPES;

  beforeEach(module('mediaCenterRSSPluginWidget'));

  beforeEach(inject(function (_$rootScope_, _$controller_, _$q_, _$filter_, _FeedParseService_, _ItemDetailsService_, _Location_, _$timeout_, _$httpBackend_, _DataStore_, _Buildfire_, _Underscore_, _TAG_NAMES_, _MEDIUM_TYPES_, _STATUS_CODE_, _STATUS_MESSAGES_) {
    q = _$q_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    $filter = _$filter_;
    FeedParseService = _FeedParseService_;
    ItemDetailsService = _ItemDetailsService_;
    $timeout = _$timeout_;
    $httpBackend = _$httpBackend_;
    DataStore = _DataStore_;
    Buildfire = _Buildfire_;
    Underscore = _Underscore_;
    Location = _Location_;
    TAG_NAMES = _TAG_NAMES_;
    STATUS_CODE = _STATUS_CODE_;
    STATUS_MESSAGES = _STATUS_MESSAGES_;
  }));

  beforeEach(function () {
    WidgetHome = $controller('WidgetHomeCtrl', {
      $q: q,
      $scope: $scope,
      $filter: $filter,
      DataStore: DataStore,
      Buildfire: Buildfire,
      FeedParseService: FeedParseService,
      ItemDetailsService: ItemDetailsService,
      Location: Location,
      TAG_NAMES: TAG_NAMES,
      Underscore: Underscore,
      STATUS_CODE: STATUS_CODE,
      STATUS_MESSAGES: STATUS_MESSAGES
    });
  });

  describe('Units Should be defined', function () {
    it('WidgetHome should be defined', function () {
      expect(WidgetHome).toBeDefined();
    });
    it('$scope should be defined', function () {
      expect($scope).toBeDefined();
    });
    it('$filter should be defined', function () {
      expect($filter).toBeDefined();
    });
    it('DataStore should be defined', function () {
      expect(DataStore).toBeDefined();
    });
    it('Buildfire should be defined', function () {
      expect(Buildfire).toBeDefined();
    });
    it('FeedParseService should be defined', function () {
      expect(FeedParseService).toBeDefined();
    });
    it('ItemDetailsService should be defined', function () {
      expect(ItemDetailsService).toBeDefined();
    });
    it('Location should be defined', function () {
      expect(Location).toBeDefined();
    });
    it('TAG_NAMES should be defined', function () {
      expect(TAG_NAMES).toBeDefined();
    });
    it('Underscore should be defined', function () {
      expect(Underscore).toBeDefined();
    });
    it('STATUS_CODE should be defined', function () {
      expect(STATUS_CODE).toBeDefined();
    });
    it('STATUS_MESSAGES should be defined', function () {
      expect(STATUS_MESSAGES).toBeDefined();
    });
  });
});