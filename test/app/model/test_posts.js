var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var posts = require('../../../app/model/posts');
var database = require('../../../app/model/database');
var config = require('../../../config');

describe('posts', function() {
  before(function () {
    database.init(config.test.database);
    return posts.createTable();
  });

  beforeEach(function() {
    return posts.deleteAll();
  });

  describe('#add', function() {
    it('should add a post', function() {
      return expect(posts.add({
        title: 'Text',
        body: 'Hello',
        slug: 'test'
      })).to.eventually.equal(1);
    });
  });

  describe('#delete', function() {
    it('should delete a post', function() {
      return expect(
        posts.add({
          title: 'Delete Test',
          body: 'Hello',
          slug: 'test'
        }).then(function(id) {
          return posts.remove(id);
        })
      ).to.eventually.equal(1);
    })
  });

  describe('#getAll', function() {
    it('should get all the posts', function() {
      return expect(
        posts.add({
          title: 'Test',
          body: 'Hello',
          slug: 'test',
          posted_at: new Date('2016-02-01')
        }).then(function() {
          return posts.add({
            title: 'Test 2',
            body: 'Another',
            slug: 'test2',
            posted_at: new Date('2016-02-10')
          });
        }).then(function() {
          return posts.getAll();
        })
      ).to.eventually.deep.equal([
        {
          id: 2,
          title: 'Test 2',
          body: 'Another',
          slug: 'test2',
          posted_at: new Date('2016-02-10')
        },
        {
          id: 1,
          title: 'Test',
          body: 'Hello',
          slug: 'test',
          posted_at: new Date('2016-02-01')
        }
      ])
    });
  })

  describe('#getBySlug', function() {
    it('should a post from the slug', function() {
      return expect(
        posts.add({
          title: 'Test',
          body: 'Hello',
          slug: 'test',
          posted_at: new Date('2016-02-10')
        }).then(function() {
          return posts.getBySlug('test');
        })
      ).to.eventually.deep.equal({
          id: 1,
          title: 'Test',
          body: 'Hello',
          slug: 'test',
          posted_at: new Date('2016-02-10')
      })
    })
  });

  describe('#update', function() {
    it('should update a post', function() {
      return expect(
        posts.add({
          title: 'Test',
          body: 'Hello',
          slug: 'test'
        }).then(function(id) {
          return posts.update(id, {
            body: 'New body'
          });
        }).then(function() {
          return posts.getBySlug('test');
        }).then(function (post) {
          return post.body;
        })
      ).to.eventually.equal('New body');
    })
  });
});