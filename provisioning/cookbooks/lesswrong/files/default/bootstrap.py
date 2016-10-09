# Initialise a newly-created db with required tables, users,
# categories and tags.
from r2.lib.db.thing import NotFound
from r2.models.account import Account, AccountExists, register
from r2.models.link import Tag, TagExists
from r2.models.subreddit import Subreddit

try:
    register('admin', 'swordfish', '', False)
except AccountExists:
    pass

admin = Account._by_name('admin')
admin.email_validated = True
admin._commit()

try:
    Subreddit._by_name('main')
except NotFound:
    Subreddit._create_and_subscribe('main', admin,
                                    { 'title': 'Effective Altruism Forum',
                                      'type': 'restricted',
                                      'default_listing': 'new' })

try:
    Subreddit._by_name('admin')
except NotFound:
    Subreddit._create_and_subscribe('admin', admin,
                                    { 'title': 'Admin',
                                      'type': 'restricted',
                                      'default_listing': 'new' })

try:
    Subreddit._by_name('meetups')
except NotFound:
    s = Subreddit._create_and_subscribe('meetups', admin,
                                        { 'title': 'Meetups',
                                          'type': 'restricted',
                                          'default_listing': 'new' })

    s.posts_per_page_multiplier = 4
    s.post_karma_multiplier = 1
    s._commit()
