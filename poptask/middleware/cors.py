class CorsMiddleware(object):
    def __call__(self, request):
        resp = self.get_response(request)
        resp["Access-Control-Allow-Origin"] = "*"
        resp["Access-Control-Allow-Headers"] = "*"
        return resp

    def __init__(self, get_response):
        super().__init__()
        self.get_response = get_response 

    def process_response(self, req, resp):
        resp["Access-Control-Allow-Origin"] = "*"
        resp["Access-Control-Allow-Headers"] = "*"
        return resp