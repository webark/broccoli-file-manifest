const expect = require('chai').expect;
const { createBuilder, createTempDir } = require('broccoli-test-helper');
const { stripIndent } = require('common-tags');
const os = require('os');

const manifest = require('../src/index');

describe("manifest", function() {
  beforeEach(async function() {
    this.input = await createTempDir();
    const subject = manifest(this.input.path(), {
      outputFileNameWithoutExtension: 'something',
      templates: {
        default: '@import "<file-path>";',
        js: 'require("<file-path>");',
      },
    });
    this.output = createBuilder(subject);
  });

  afterEach(async function() {
    await this.input.dispose();
    await this.output.dispose();
  });


  it("should handle a single file extention", async function() {
    this.input.write({
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

    await this.output.build();

    expect(this.output.read()).to.deep.equal({
      "something.scss": stripIndent`
        @import "src/ui/components/other-thing/style.scss";
        @import "src/ui/components/todo-item/style.scss";
      ` + os.EOL
    });
  });


  it("should handle a different templates for different files extentions", async function() {
    this.input.write({
      "src": {
        "ui": {
          "components": {
            "todo-item": {
              "component.js": '/* todo item styles */',
              "style.scss": '/* todo item styles */',
            },
            "other-thing": {
              "component.js": '/* other thing styles */',
              "style.scss": '/* todo item styles */',
            }
          }
        }
      }
    });

    await this.output.build();

    expect(this.output.read()).to.deep.equal({
      "something.scss": stripIndent`
        @import "src/ui/components/other-thing/style.scss";
        @import "src/ui/components/todo-item/style.scss";
      ` + os.EOL,
      "something.js": stripIndent`
        require("src/ui/components/other-thing/component.js");
        require("src/ui/components/todo-item/component.js");
      ` + os.EOL
    });
  });


  it("should not rebuild if nothing has changed", async function() {
    this.input.write({
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

    await this.output.build();

    expect(this.output.read()).to.deep.equal({
      "something.scss": stripIndent`
        @import "src/ui/components/other-thing/style.scss";
        @import "src/ui/components/todo-item/style.scss";
      ` + os.EOL
    });

    await this.output.build();

    expect(this.output.changes()).to.deep.equal({});

    this.input.write({
      "src": {
        "ui": {
          "components": {
            "todo-item": {
              "style.scss": null
            }
          }
        }
      }
    });

    await this.output.build();

    expect(this.output.read()).to.deep.equal({
      "something.scss": stripIndent`
        @import "src/ui/components/other-thing/style.scss";
      ` + os.EOL
    });
  });


  it("should handle a multiple files in a direactory", async function() {
    this.input.write({
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

    await this.output.build();

    expect(this.output.read()).to.deep.equal({
      "something.scss": stripIndent`
        @import "src/ui/components/other-thing/style.scss";
        @import "src/ui/components/todo-item/other-style.scss";
        @import "src/ui/components/todo-item/style.scss";
      ` + os.EOL
    });
  });


  it("should handle a multiple file extentions", async function() {
    this.input.write({
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

    await this.output.build();

    expect(this.output.read()).to.deep.equal({
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


  it("should handle a no files", async function() {
    this.input.write({
      "src": {
        "ui": {
          "components": {
            "todo-item": {},
            "other-thing": {}
          }
        }
      }
    });

    await this.output.build();

    expect(this.output.read()).to.deep.equal({});
  });


  it("should include top level items before nested children", async function() {
    this.input.write({
      "src": {
        "ui": {
          "components": {
            "todo-item": {
              "style.scss": '/* todo item styles */',
              "nested-item": {
                "style.scss": '/* todo item styles */',
                "double-nested-item": {
                  "style.scss": '/* todo item styles */',
                },
              },
              "other-style.scss": '/* todo item other styles */'
            },
            "other-thing": {
              "style.scss": '/* other thing styles */',
              "nested-item": {
                "style.scss": '/* todo item styles */',
                "double-nested-item": {
                  "style.scss": '/* todo item styles */',
                },
              },
            },
          },
        },
      },
    });

    await this.output.build();

    expect(this.output.read()).to.deep.equal({
      "something.scss": stripIndent`
        @import "src/ui/components/other-thing/style.scss";
        @import "src/ui/components/todo-item/other-style.scss";
        @import "src/ui/components/todo-item/style.scss";
        @import "src/ui/components/other-thing/nested-item/style.scss";
        @import "src/ui/components/todo-item/nested-item/style.scss";
        @import "src/ui/components/other-thing/nested-item/double-nested-item/style.scss";
        @import "src/ui/components/todo-item/nested-item/double-nested-item/style.scss";
      ` + os.EOL
    });
  });


  it("should handle multiple nested items in outermost first, irrigardless of what the directory starts wtih it.", async function() {
    this.input.write({
      "attendees": {
        "wizard": {
          "-components": {
            "finish-button": {
              "style.scss": '/* todo item styles */',
            },
            "single-step": {
              "style.scss": '/* todo item styles */',
            },
            "progress-indicator": {
              "style.scss": '/* todo item styles */',
            },
          },
          "avatar": {
            "style.scss": '/* todo item styles */',
          },
          "style.scss": '/* todo item styles */',
        },
        "style.scss": '/* todo item styles */',
      },
    });

    await this.output.build();

    expect(this.output.read()).to.deep.equal({
      "something.scss": stripIndent`
        @import "attendees/style.scss";
        @import "attendees/wizard/style.scss";
        @import "attendees/wizard/avatar/style.scss";
        @import "attendees/wizard/-components/finish-button/style.scss";
        @import "attendees/wizard/-components/progress-indicator/style.scss";
        @import "attendees/wizard/-components/single-step/style.scss";
      ` + os.EOL
    });
  });
});
