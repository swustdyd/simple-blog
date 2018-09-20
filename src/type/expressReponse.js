export type ExpressResponse = {
	/**
	 * This property holds a reference to the instance of the Express application that is using the middleware.
	 */
	app: Object,
	/**
	 * Boolean property that indicates if the app sent HTTP headers for the response.
     * @example
     * app.get('/', function (req, res) {
     * console.log(res.headersSent); // false
     * res.send('OK');
     * console.log(res.headersSent); // true
     * });
	 */
	headersSent: Boolean,
	/**
	 * An object that contains response local variables scoped to the request, and therefore available only to
	 * the view(s) rendered during that request / response cycle (if any). Otherwise,
	 * this property is identical to app.locals.
     * This property is useful for exposing request-level information such as the request path name, 
     * authenticated user, user settings, and so on.
     * @example
     * app.use(function(req, res, next){
        res.locals.user = req.user;
        res.locals.authenticated = ! req.user.anonymous;
        next();
        });
	 */
	locals: Object,
	/**
	 * Appends the specified value to the HTTP response header field.  If the header is not already set,
	 * it creates the header with the specified value.  The value parameter can be a string or an array.
     * @note calling res.set() after res.append() will reset the previously-set header value. 
     * @example 
     * res.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']);
     * res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
     * res.append('Warning', '199 Miscellaneous warning');
	 */
	append: (key: string, value: string | []) => void,
	/**
	 * Sets the HTTP response Content-Disposition header field to “attachment”. If a filename is given,
	 * then it sets the Content-Type based on the extension name via res.type(),
	 * and sets the Content-Disposition “filename=” parameter.
     * @example
     * res.attachment();
        // Content-Disposition: attachment

        res.attachment('path/to/logo.png');
        // Content-Disposition: attachment; filename="logo.png"
        // Content-Type: image/png
	 */
	attachment: (filename: string) => void,
	/**
	 * Sets cookie name to value.  The value parameter may be a string or object converted to JSON.
     * @see http://www.expressjs.com.cn/4x/api.html#res.cookie for options detail
     * @example
     * res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true });
       res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
	 */
	cookie: (name: string, value: string, options?: {}) => void,
	/**
	 * Clears the cookie specified by name. For details about the options object, see res.cookie().
     * @note Web browsers and other compliant clients will only clear the cookie if the given options is identical to 
     * those given to res.cookie(), excluding expires and maxAge.
     * @example
     * res.cookie('name', 'tobi', { path: '/admin' });
       res.clearCookie('name', { path: '/admin' });
	 */
	clearCookie: (name: string, options?: {}) => void,
	/**
	 * Transfers the file at path as an “attachment”. Typically, browsers will prompt the user for download.
	 * By default, the Content-Disposition header “filename=” parameter is path (this typically appears in the browser dialog).
	 * Override this default with the filename parameter.
     * @example
     * res.download('/report-12345.pdf');

        res.download('/report-12345.pdf', 'report.pdf');

        res.download('/report-12345.pdf', 'report.pdf', function(err){
        if (err) {
            // Handle error, but keep in mind the response may be partially-sent
            // so check res.headersSent
        } else {
            // decrement a download credit, etc.
        }
        });
	 */
	download: (path: string, filename?: string, options?: {}, callback?: (err: Error) => void) => void,
	/**
	 * Ends the response process. This method actually comes from Node core, specifically the response.end() method of  http.ServerResponse.
     * Use to quickly end the response without any data. If you need to respond with data, instead use methods such as res.send() and res.json().
     * @example
     * res.end();
       res.status(404).end();
	 */
	end: (data, encoding?: string) => void,
	/**
	 * Performs content-negotiation on the Accept HTTP header on the request object, when present.
	 * It uses req.accepts() to select a handler for the request, based on the acceptable
	 * types ordered by their quality values. If the header is not specified, the first callback is invoked.
	 * When no match is found, the server responds with 406 “Not Acceptable”, or invokes the default callback.
     * @example
     * res.format({
        'text/plain': function(){
            res.send('hey');
        },

        'text/html': function(){
            res.send('<p>hey</p>');
        },

        'application/json': function(){
            res.send({ message: 'hey' });
        },

        'default': function() {
            // log the request and respond with 406
            res.status(406).send('Not Acceptable');
        }
        });
	 */
	format: (object: {}) => void,
	/**
	 * Returns the HTTP response header specified by field.
	 * The match is case-insensitive.
     * @example
     * res.get('Content-Type');
       // => "text/plain"
	 */
	get: (field: string) => string,
	/**
	 * Sends a JSON response. This method sends a response (with the correct content-type) that is the parameter converted to a 
	 * JSON string using JSON.stringify().
     * The parameter can be any JSON type, including object, array, string, Boolean, 
     * or number, and you can also use it to convert other values to JSON, such as null, 
     * and undefined (although these are technically not valid JSON).
     * @example
     * res.json(null);
       res.json({ user: 'tobi' });
       res.status(500).json({ error: 'message' });
	 */
	json: (body) => void,
	/**
	 * Sends a JSON response with JSONP support. This method is identical to res.json(),
	 * except that it opts-in to JSONP callback support.
     * @example
     * res.jsonp(null);
        // => callback(null)

        res.jsonp({ user: 'tobi' });
        // => callback({ "user": "tobi" })

        res.status(500).jsonp({ error: 'message' });
        // => callback({ "error": "message" })
	 */
	jsonp: (body) => void,
	/**
	 * Joins the links provided as properties of the parameter to populate the response’s
	 * Link HTTP header field.
     * @example
     * res.links({
        next: 'http://api.example.com/users?page=2',
        last: 'http://api.example.com/users?page=5'
        });
     * @result Yields the following results:
     * Link: <http://api.example.com/users?page=2>; rel="next",
             <http://api.example.com/users?page=5>; rel="last"}
	 */
	links: (links: {}) => void,
	/**
	 * Sets the response Location HTTP header to the specified path parameter.
     * @example
     * res.location('/foo/bar');
        res.location('http://example.com');
        res.location('back');
	 */
	location: (path: string) => void,
	/**
	 * Redirects to the URL derived from the specified path, with specified status, a positive integer
	 * that corresponds to an HTTP status code .
	 * If not specified, status defaults to “302 “Found”.
     * @see http://www.expressjs.com.cn/4x/api.html#res.redirect for detail
     * @example
     * res.redirect('/foo/bar');
        res.redirect('http://example.com');
        res.redirect(301, 'http://example.com');
        res.redirect('../login');
	 */
	redirect: (status?: number, path: string) => void,
	/**
	 * Renders a view and sends the rendered HTML string to the client.
	 * Optional parameters:
     * @param locals an object whose properties define local variables for the view.
     * @param callback a callback function. If provided, the method returns both the possible error and rendered string, 
     * but does not perform an automated response. When an error occurs, the method invokes next(err) internally.
     * @example
     * // send the rendered view to the client
        res.render('index');

        // if a callback is specified, the rendered HTML string has to be sent explicitly
        res.render('index', function(err, html) {
        res.send(html);
        });

        // pass a local variable to the view
        res.render('user', { name: 'Tobi' }, function(err, html) {
        // ...
        });
	 */
	render: (view: string, locals?: {}, callback:? (err: Error, html: string) => void) => void,
	/**
	 * Sends the HTTP response.
     * The body parameter can be a Buffer object, a String, an object, or an Array.
     * @example
     * res.send(new Buffer('whoop'));
        res.send({ some: 'json' });
        res.send('<p>some html</p>');
        res.status(404).send('Sorry, we cannot find that!');
        res.status(500).send({ error: 'something blew up' });
	 */
	send: (body) => void,
	/**
	 * Transfers the file at the given path. Sets the Content-Type response HTTP header field
	 * based on the filename’s extension. Unless the root option is set in
	 * the options object, path must be an absolute path to the file.
     * @see http://www.expressjs.com.cn/4x/api.html#res.sendFile for detail
     * @example 
     * app.get('/file/:name', function (req, res, next) {

        var options = {
            root: __dirname + '/public/',
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };

        var fileName = req.params.name;
        res.sendFile(fileName, options, function (err) {
            if (err) {
            next(err);
            } else {
            console.log('Sent:', fileName);
            }
        });

        });
	 */
	sendFile: (path: string, options?: {}, callback?: (err: Error) => void) => void,
	/**
	 * Sets the response HTTP status code to statusCode and send its string representation as the response body.
     * @example
     * res.sendStatus(200); // equivalent to res.status(200).send('OK')
        res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
        res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
        res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')
	 */
	sendStatus: (statusCode: number) => void,
	/**
	 * Sets the response’s HTTP header field to value.
	 * To set multiple fields at once, pass an object as the parameter.
     * @example
     * res.set('Content-Type', 'text/plain');
        res.set({
        'Content-Type': 'text/plain',
        'Content-Length': '123',
        'ETag': '12345'
        });
	 */
	set: (field: string, value?: string) => void,
	/**
	 * Sets the HTTP status for the response.
	 * It is a chainable alias of Node’s response.statusCode.
     * @example
     * res.status(403).end();
        res.status(400).send('Bad Request');
        res.status(404).sendFile('/absolute/path/to/404.png');
	 */
	status: (code: number) => void,
	/**
	 * Sets the Content-Type HTTP header to the MIME type as determined by
	 * mime.lookup() for the specified type.
	 * If type contains the “/” character, then it sets the Content-Type to type.
     * @example
     * res.type('.html');              // => 'text/html'
        res.type('html');               // => 'text/html'
        res.type('json');               // => 'application/json'
        res.type('application/json');   // => 'application/json'
        res.type('png');                // => image/png:
	 */
	type: (type: stirng) => void,
	/**
	 * Adds the field to the Vary response header, if it is not there already.
     * @example res.vary('User-Agent').render('docs');
	 */
	vary: (field: string) => void
}