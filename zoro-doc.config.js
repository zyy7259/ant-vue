const path = require('path');

const { join } = path;

module.exports = {
  groupPath: ['category', 'type'],
  // only accept markdowns
  files: [join(__dirname, 'README.md')],
  concurrency: 5,
  groupMap: {
    category: {
      order: ['changlog', 'component'],
      component: {
        title: 'Components',
        order: ['general', 'layout']
      }
    },
    type: {
      order: ['general'],
      general: {
        title: 'General',
        order: ['btn', 'alert']
      }
    }
  },
  metadata: {
    menu: {
      category: {
        component: {
          general: {}
        }
      }
    }
  }
};
