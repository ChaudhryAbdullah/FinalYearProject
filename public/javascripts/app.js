requirejs.config({
  baseUrl: 'javascripts/',
  shim:{
    bootstrap: {deps:['jquery']}
  },
  paths  : {
    jquery    : './thirdparty/jquery-2.1.1',
    bootstrap : './thirdparty/bootstrap.min',
    mustache  : './thirdparty/mustache',
    knockout  : './thirdparty/knockout',
    pubsub    : './thirdparty/pubsub',
    moment    : './thirdparty/momentjs',
    underscore: './thirdparty/underscore',
    main      : './scripts/main'
  }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['require', 'main', 'jquery'],
  function (require, main, $)
  {
    $(document).ready(main);
  });