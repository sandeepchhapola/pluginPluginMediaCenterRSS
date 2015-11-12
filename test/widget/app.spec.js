describe('Unit: pluginPluginMediaCenterRSS widget app', function () {
  describe('Unit: app routes', function () {
    beforeEach(module('mediaCenterRSSPluginWidget'));
    var location, route, rootScope;
    beforeEach(inject(function (_$location_, _$route_, _$rootScope_) {
      location = _$location_;
      route = _$route_;
      rootScope = _$rootScope_;
    }));

    describe('Media route', function () {
      beforeEach(inject(
        function ($httpBackend) {
          $httpBackend.expectGET('templates/media.html')
            .respond(200);
          $httpBackend.expectGET('/item')
            .respond(200);
        }));

      it('should load the home page on successful load of location path /item', function () {
        location.path('/item');
        rootScope.$digest();
        expect(route.current.controller).toEqual('WidgetMediaCtrl')
      });
    });
  });
});