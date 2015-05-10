define(["require", "jquery", "knockout", "pubsub"], function (require, $, ko, pubsub) {
  function NewsFeedModel() {
    var _this = this;
    _this.state = ko.observable("");
    _this.newsfeed = ko.observableArray([]);

    pubsub.subscribe("stateChange", function (newState) {
      _this.state(newState);
      FetchNewsFeed();
    });

    function FetchNewsFeed() {
      var url = window.location.origin + "/newsfeed";
      $.get(url, function (args) {
        _this.newsfeed(args);
      });
    }

    _this.GetImageUrl = function (imageName) {
      return window.location.origin + "/photo?id=" + imageName;
    };

    _this.OnMoreBtnClick = function () {

    };
  }

  return new NewsFeedModel();
});