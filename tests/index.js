/* eslint-env node, mocha */
'use strict';

const expect = require('chai').expect;
const { createBuilder, createTempDir } = require('broccoli-test-helper');
const BroccoliStyleManifest = require('../index');
const { stripIndent } = require('common-tags');
const os = require('os');

describe("style-manifest", function() {
  let input;
  let output;
  let subject;

  beforeEach(async function() {
    input = await createTempDir();
    subject = new BroccoliStyleManifest(input.path(), {
      outputFileNameWithoutExtension: 'something'
    });
    output = createBuilder(subject);
  });

  afterEach(async function() {
    await input.dispose();
    await output.dispose();
  });


  it("should handle a single style type", async function() {
    input.write({
      "src": {
        "ui": {
          "components": {
            "todo-item": {
              "style.scss": '/* todo item styles */'
            },
            "other-thing": {
              "style.scss": '/* other thing styles */'
            }
          }
        }
      }
    });

    await output.build();

    expect(output.read()).to.deep.equal({
      "something.scss": stripIndent`
        @import "src/ui/components/other-thing/style.scss";
        @import "src/ui/components/todo-item/style.scss";
      ` + os.EOL
    });
  });


  it("should handle a multiple style files in a direactory", async function() {
    input.write({
      "src": {
        "ui": {
          "components": {
            "todo-item": {
              "style.scss": '/* todo item styles */',
              "other-style.scss": '/* todo item other styles */'
            },
            "other-thing": {
              "style.scss": '/* other thing styles */'
            }
          }
        }
      }
    });

    await output.build();

    expect(output.read()).to.deep.equal({
      "something.scss": stripIndent`
        @import "src/ui/components/other-thing/style.scss";
        @import "src/ui/components/todo-item/other-style.scss";
        @import "src/ui/components/todo-item/style.scss";
      ` + os.EOL
    });
  });

  it("should handle a multiple style types", async function() {
    input.write({
      "src": {
        "ui": {
          "components": {
            "scss-component": {
              "style.scss": '/* scss component styles */'
            },
            "other-scss-component": {
              "style.scss": '/* other scss component styles */'
            },
            "stylus-component": {
              "style.styl": '/* stylus component styles */'
            },
            "other-stylus-component": {
              "style.styl": '/* other stylus component styles */'
            },
            "sass-component": {
              "style.sass": '/* sass component styles */'
            },
            "other-sass-component": {
              "style.sass": '/* other sass component styles */'
            },
            "less-component": {
              "style.less": '/* less component styles */'
            },
            "other-less-component": {
              "style.less": '/* other less component styles */'
            },
            "plain-css-component": {
              "style.css": '/* plain css component styles */'
            },
            "other-plain-css-component": {
              "style.css": '/* other plain css component styles */'
            }
          }
        }
      }
    });

    await output.build();

    expect(output.read()).to.deep.equal({
      "something.css": stripIndent`
        @import "src/ui/components/other-plain-css-component/style.css";
        @import "src/ui/components/plain-css-component/style.css";
      ` + os.EOL,
      "something.less": stripIndent`
        @import "src/ui/components/less-component/style.less";
        @import "src/ui/components/other-less-component/style.less";
      ` + os.EOL,
      "something.sass": stripIndent`
        @import "src/ui/components/other-sass-component/style.sass";
        @import "src/ui/components/sass-component/style.sass";
      ` + os.EOL,
      "something.styl": stripIndent`
        @import "src/ui/components/other-stylus-component/style.styl";
        @import "src/ui/components/stylus-component/style.styl";
      ` + os.EOL,
      "something.scss": stripIndent`
        @import "src/ui/components/other-scss-component/style.scss";
        @import "src/ui/components/scss-component/style.scss";
      ` + os.EOL
    });
  });

});
