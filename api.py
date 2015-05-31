#! /usr/bin/env python
# -*- coding: utf-8 -*-
import os
import sys
import argparse
from tornado.web import (
    Application,
    RequestHandler,
    )
from tornado.ioloop import IOLoop
from sandstorm.handlers import YAStaticFileHandler as StaticFileHandler

_HERE = os.path.abspath(os.path.dirname(__file__))
DEFAULT_WWW_ROOT = os.path.join(_HERE, 'www_root')


class PingPongHandler(RequestHandler):
    def get(self):
        self.write('pong!!')


def application_factory(www_root=DEFAULT_WWW_ROOT):
    app = Application([
        (r'/ping', PingPongHandler),
        (r'/(.*)', StaticFileHandler, {'path': www_root}),
        ])
    return app


def main(argv=sys.argv[1:]):
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', default=8888, type=int)
    args = parser.parse_args(argv)
    app = application_factory()
    app.listen(args.port)
    IOLoop.current().start()

if __name__ == '__main__':
    app = main()
