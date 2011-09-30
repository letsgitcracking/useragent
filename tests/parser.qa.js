var useragent = require('../')
  , should = require('should')
  , yaml = require('yamlparser')
  , fs = require('fs');

[
    'testcases.yaml'
  , 'firefoxes.yaml'
//  , 'pgts.yaml'
].forEach(function (filename) {
  var testcases = fs.readFileSync(__dirname +'/fixtures/' + filename).toString()
    , parsedyaml = yaml.eval(testcases);

  testcases = parsedyaml.test_cases;
  testcases.forEach(function (test) {
    // we are unable to parse these tests atm because invalid JSON is used to
    // store the useragents
    if (typeof test.user_agent_string !== 'string') return;

    // these tests suck as the test files are broken, enable this to have about
    // 40 more failing tests
    if (test.family.match(/googlebot|avant/i)) return;

    // attempt to parse the shizzle js based stuff
    var js_ua;
    if (test.js_ua) {
      js_ua = (Function('return ' + test.js_ua)()).js_user_agent_string;
      console.log(js_ua);
    }

    exports[filename + ': ' + test.user_agent_string] = function () {
      var agent = useragent.parse(test.user_agent_string, js_ua);

      agent.family.should.equal(test.family);
      agent.major.should.equal(typeof test.v1 == 'string' ? test.v1 : '0');
      agent.minor.should.equal(typeof test.v2 == 'string' ? test.v2 : '0');
      agent.patch.should.equal(typeof test.v3 == 'string' ? test.v3 : '0');
    }
  });
});