#! /usr/bin/env pytthon
# -*- coding: utf-8 -*-
import sys
import tornado
import tornado.web
from sandstorm.handlers import YAStaticFileHandler


def view_defaults(*args, **kwds):
    def _wrap():
        return None
    return _wrap


def main(argv=sys.argv[1:]):
    app = tornado.web.Application([
        (r'/', MainHandler),
        ])
    app.listen(8000)
    runner = tornado.ioloop.IOLoop.instance()
    runner.start()


def includeme(config):
    config.add_route('top', '/')

@view_defaults()
class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write('Tornado.jp!!')

if __name__ == '__main__':
    sys.exit(main())
