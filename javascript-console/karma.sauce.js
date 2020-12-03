module.exports = function(config) {
  let customLaunchers = {
    sl_ios_safari_8: {
      base: 'SauceLabs',
      browserName: 'iphone',
      version: '8.4'
    },
    sl_ios_safari_9: {
      base: 'SauceLabs',
      browserName: 'iphone',
      version: '9.3'
    },
    sl_android_4_4: {
      base: 'SauceLabs',
      browserName: 'android',
      version: '4.4'
    },
    sl_android_5_1: {
      base: 'SauceLabs',
      browserName: 'android',
      version: '5.1'
    }
  }

  config.set({
    basePath: '',
    frameworks: ['jquery-1.8.3'],
    files: [
      'eruda.js',
      'test/init.js',
      'node_modules/jasmine-core/lib/jasmine-core/jasmine.js',
      'node_modules/karma-jasmine/lib/boot.js',
      'node_modules/karma-jasmine/lib/adapter.js',
      'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
      'test/util.js',
      'test/console.js',
      'test/elements.js',
      'test/info.js',
      'test/network.js',
      'test/resources.js',
      'test/snippets.js',
      'test/sources.js',
      'test/settings.js',
      'test/eruda.js'
    ],
    plugins: ['karma-jasmine', 'karma-jquery', 'karma-sauce-launcher'],
    reporters: ['dots', 'saucelabs'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    sauceLabs: {
      testName: 'eruda'
    },
    captureTimeout: 120000,
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    singleRun: true
  })
}
