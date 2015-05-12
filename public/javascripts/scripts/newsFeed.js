define(["require", "jquery", "knockout", "pubsub"], function (require, $, ko, pubsub) {
  function NewsFeedModel() {
    var _this = this,
      pageNumber = 0;

    _this.state = ko.observable("");
    _this.newsfeed = ko.observableArray([]);

    pubsub.subscribe("stateChange", function (newState) {
      _this.state(newState);
      pageNumber = 0;
      FetchNewsFeed();
    });

    function FetchNewsFeed() {
      var url = window.location.origin + "/newsfeed?page=" + pageNumber;
      $.get(url, function (args) {
        if (!pageNumber) {
          _this.newsfeed(args);
        }
        else {
          _this.newsfeed(_this.newsfeed().concat(args));
        }
      });
    }

    _this.GetImageUrl = function (imageName) {
      return window.location.origin + "/photo?id=" + imageName;
    };

    _this.OnMoreBtn = function () {
      pageNumber++;
      FetchNewsFeed();
    };
  }

  return new NewsFeedModel();
});