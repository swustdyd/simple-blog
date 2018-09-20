export type ExpressRequest = {
	/**
	 * This property holds a reference to the instance of the Express application that is using the middleware.
     * If you follow the pattern in which you create a module that just exports a middleware function and require() it in your main file, 
     * then the middleware can access the Express instance via req.app
     * @see http://www.expressjs.com.cn/4x/api.html#app for detail
     * @example
     * //index.js
        app.get('/viewdirectory', require('./mymiddleware.js'))
        //mymiddleware.js
        module.exports = function (req, res) {
        res.send('The views directory is ' + req.app.get('views'));
        });
	 */
	app: Object,
	/**
	 * The URL path on which a router instance was mounted.
     * The req.baseUrl property is similar to the mountpath property of the app object, except app.mountpath returns the matched path pattern(s).
	 */
	baseUrl: string,
	/**
	 * Contains key-value pairs of data submitted in the request body.
	 * By default, it is undefined, and is populated when you use body-parsing middleware such
	 * as body-parser and multer.
	 */
	body: Object,
	/**
	 * When using cookie-parser middleware, this property is an object that
	 * contains cookies sent by the request.  If the request contains no cookies, it defaults to {}.
	 */
	cookies: Object,
	/**
	 * Indicates whether the request is “fresh.”  It is the opposite of req.stale.
     * @see http://www.expressjs.com.cn/4x/api.html#req.fresh for detail
	 */
	fresh: Boolean,
	/**
	 * Contains the hostname derived from the Host HTTP header.
     * When the trust proxy setting does not evaluate to false, this property will instead have the value of the X-Forwarded-Host header field. 
     * This header can be set by the client or by the proxy.
     * @example
     * // Host: "example.com:3000"
        req.hostname
        // => "example.com"
	 */
	hostname: string,
	/**
	 * Contains the remote IP address of the request.
     * When the trust proxy setting does not evaluate to false, 
     * the value of this property is derived from the left-most entry in the X-Forwarded-For header. 
     * This header can be set by the client or by the proxy.
     * @example
     * req.ip
        // => "127.0.0.1"
	 */
	ip: string,
	/**
	 * When the trust proxy setting does not evaluate to false,
	 * this property contains an array of IP addresses
	 * specified in the X-Forwarded-For request header. Otherwise, it contains an
	 * empty array. This header can be set by the client or by the proxy.
     * @note if X-Forwarded-For is client, proxy1, proxy2, req.ips would be ["client", "proxy1", "proxy2"], where proxy2 is the furthest downstream.
	 */
	ips: [],
	/**
	 * Contains a string corresponding to the HTTP method of the request:
	 * GET, POST, PUT, and so on.
	 */
	method: string,
	/**
	 * This property is much like req.url; however, it retains the original request URL,
	 * allowing you to rewrite req.url freely for internal routing purposes. For example,
	 * the “mounting” feature of app.use() will rewrite req.url to strip the mount point.
     * @example
     * // GET /search?q=something
        req.originalUrl
        // => "/search?q=something"
        app.use('/admin', function(req, res, next) {  // GET 'http://www.example.com/admin/new'
        console.log(req.originalUrl); // '/admin/new'
        console.log(req.baseUrl); // '/admin'
        console.log(req.path); // '/new'
        next();
        });
	 */
	originalUrl: string,
	/**
	 * This property is an object containing properties mapped to the named route “parameters”. For example, 
     * if you have the route /user/:name, then the “name” property is available as req.params.name. This object defaults to {}.
     * @example
     * // GET /user/tj
        req.params.name
        // => "tj"
	 */
	params: string,
	/**
	 * Contains the path part of the request URL.
     * @example
     * // example.com/users?sort=desc
        req.path
        // => "/users"
	 */
	path: string,
	/**
	 * Contains the request protocol string: either http or (for TLS requests) https.
	 */
	protocol: string,
	/**
	 * This property is an object containing a property for each query string parameter in the route.
	 * If there is no query string, it is the empty object, {}.
     * @example
     * // GET /search?q=tobi+ferret
        req.query.q
        // => "tobi ferret"

        // GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse
        req.query.order
        // => "desc"

        req.query.shoe.color
        // => "blue"

        req.query.shoe.type
        // => "converse"
	 */
	query: Object,
	/**
	 * Contains the currently-matched route, a string.  For example:
     * @example
     * app.get('/user/:id?', function userIdHandler(req, res) {
        console.log(req.route);
        res.send('GET');
        });
        // { path: '/user/:id?',
        //     stack:
        //     [ { handle: [Function: userIdHandler],
        //         name: 'userIdHandler',
        //         params: undefined,
        //         path: undefined,
        //         keys: [],
        //         regexp: /^\/?$/i,
        //         method: 'get' } ],
        //     methods: { get: true } }
	 */
	route: Object,
	/**
	 * A Boolean property that is true if a TLS connection is established. Equivalent to:
     * @when 'https' == req.protocol;
	 */
	secure: Boolean,
	/**
	 * When using cookie-parser middleware, this property
	 * contains signed cookies sent by the request, unsigned and ready for use. Signed cookies reside
	 * in a different object to show developer intent; otherwise, a malicious attack could be placed on
	 * req.cookie values (which are easy to spoof). Note that signing a cookie does not make it “hidden”
	 * or encrypted; but simply prevents tampering (because the secret used to sign is private).
     * If no signed cookies are sent, the property defaults to {}.
     * @example
     * // Cookie: user=tobi.CP7AWaXDfAKIRfH49dQzKJx7sKzzSoPq7/AcBBRVwlI3
        req.signedCookies.user
        // => "tobi"
	 */
	signedCookies: Object,
	/**
	 * Indicates whether the request is “stale,” and is the opposite of req.fresh.
	 * For more information, see req.fresh.
	 */
	stale: Boolean,
	/**
	 * An array of subdomains in the domain name of the request.
     * @example
     * // Host: "tobi.ferrets.example.com"
        req.subdomains
        // => ["ferrets", "tobi"]
	 */
	subdomains: [],
	/**
	 * A Boolean property that is true if the request’s X-Requested-With header field is
	 * “XMLHttpRequest”, indicating that the request was issued by a client library such as jQuery.
	 */
	xhr: Boolean,
	/**
	 * Checks if the specified content types are acceptable, based on the request’s Accept HTTP header field.
	 * The method returns the best match, or if none of the specified content types is acceptable, returns
	 * false (in which case, the application should respond with 406 "Not Acceptable").
     * @example
     * // Accept: text/html
        req.accepts('html');
        // => "html"

        // Accept: text/*, application/json
        req.accepts('html');
        // => "html"
        req.accepts('text/html');
        // => "text/html"
        req.accepts(['json', 'text']);
        // => "json"
        req.accepts('application/json');
        // => "application/json"

        // Accept: text/*, application/json
        req.accepts('image/png');
        req.accepts('png');
        // => undefined

        // Accept: text/*;q=.5, application/json
        req.accepts(['html', 'json']);
        // => "json"
	 */
	accepts: (types: string | []) => string,
	/**
	 * Returns the first accepted charset of the specified character sets,
	 * based on the request’s Accept-Charset HTTP header field.
	 * If none of the specified charsets is accepted, returns false.
	 */
	acceptsCharsets: (charset: []) => string,
	/**
	 * Returns the first accepted encoding of the specified encodings,
	 * based on the request’s Accept-Encoding HTTP header field.
	 * If none of the specified encodings is accepted, returns false.
	 */
	acceptsEncodings: (encoding : []) => string,
	/**
	 * Returns the first accepted language of the specified languages,
	 * based on the request’s Accept-Language HTTP header field.
	 * If none of the specified languages is accepted, returns false.
	 */
	acceptsLanguages: (lang : []) => string,
	/**
	 * Returns the specified HTTP request header field (case-insensitive match).
	 * The Referrer and Referer fields are interchangeable.
     * @example
     * req.get('Content-Type');
        // => "text/plain"

        req.get('content-type');
        // => "text/plain"

        req.get('Something');
        // => undefined
	 */
	get: (field: string) => string,
	/**
	 * Returns the matching content type if the incoming request’s “Content-Type” HTTP header field
	 * matches the MIME type specified by the type parameter. If the request has no body, returns null.
	 * Returns false otherwise.
     * @example
     * // With Content-Type: text/html; charset=utf-8
        req.is('html');       // => 'html'
        req.is('text/html');  // => 'text/html'
        req.is('text/*');     // => 'text/*'

        // When Content-Type is application/json
        req.is('json');              // => 'json'
        req.is('application/json');  // => 'application/json'
        req.is('application/*');     // => 'application/*'

        req.is('html');
        // => false
	 */
	is: (type: string) => string | Boolean,
	/**
	 * Returns the value of param name when present.
     * @example
     * // ?name=tobi
        req.param('name')
        // => "tobi"

        // POST name=tobi
        req.param('name')
        // => "tobi"

        // /user/tobi for /user/:name
        req.param('name')
        // => "tobi"
	 */
	param: (name: string, defaultValue?: any) => string,
	/**
	 * Range header parser.
     * The size parameter is the maximum size of the resource.
     * The options parameter is an object that can have the following properties.
     * @example
     * // parse header from request
        var range = req.range(1000)

        // the type of the range
        if (range.type === 'bytes') {
        // the ranges
        range.forEach(function (r) {
            // do something with r.start and r.end
        })
        }
	 */
	range: Function
}